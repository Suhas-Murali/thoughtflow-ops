from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import json
import ollama

app = FastAPI()

CATEGORIES = ["DATABASE_ERROR", "UI_FLAKINESS", "AUTH_FAILURE", "NETWORK_ERROR", "UNKNOWN"]
SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]


class FailureItem(BaseModel):
    id: str
    rawErrorLog: str


class AnalyzeRequest(BaseModel):
    failures: List[FailureItem]


class AnalyzeResult(BaseModel):
    id: str
    category: str
    severity: str
    cleanSummary: str


class AnalyzeResponse(BaseModel):
    results: List[AnalyzeResult]


def build_prompt(error_log: str) -> str:
    examples = """Example 1:
Error log: "org.postgresql.util.PSQLException: FATAL: remaining connection slots are reserved for non-replication superuser connections"
JSON response: {"category": "DATABASE_ERROR", "severity": "HIGH", "cleanSummary": "Database connection pool exhausted, no slots available"}

Example 2:
Error log: "com.microsoft.playwright.TimeoutException: Timeout 30000ms exceeded.\\nwaiting for selector \\"text=Dashboard\\""
JSON response: {"category": "UI_FLAKINESS", "severity": "MEDIUM", "cleanSummary": "UI element did not appear in time, likely a flaky rendering issue"}

Example 3:
Error log: "ValueError: Invalid token format\\n\\nFile \\"/app/auth/security.py\\", line 84, in decode_token\\n    raise ValueError(\\"Invalid token format\\")"
JSON response: {"category": "AUTH_FAILURE", "severity": "HIGH", "cleanSummary": "Authentication token could not be decoded due to invalid format"}

Example 4:
Error log: "requests.exceptions.ConnectionError: HTTPSConnectionPool(host='api.payment.internal', port=443): Max retries exceeded"
JSON response: {"category": "NETWORK_ERROR", "severity": "HIGH", "cleanSummary": "Repeated failed attempts to connect to a remote service over HTTPS"}
"""

    return f"""You are a test failure triage assistant. Analyze the error log below and respond with ONLY a valid JSON object, no other text, no markdown formatting, no explanation.

The JSON object must have exactly these three fields:
- "category": one of {CATEGORIES}
- "severity": one of {SEVERITIES}
- "cleanSummary": a single plain-English sentence (max 20 words) explaining what went wrong

Category definitions:
- DATABASE_ERROR: database connections, queries, pooling, constraints, or transaction failures
- UI_FLAKINESS: frontend rendering, element timeouts, browser automation issues
- AUTH_FAILURE: login, token, session, or permission-related failures specifically
- NETWORK_ERROR: connectivity issues to external services, APIs, or messaging systems (not the database itself)
- UNKNOWN: use only if truly none of the above fit

Here are some correctly labeled examples:

{examples}
Now analyze this error log:
{error_log}

JSON response:"""


def analyze_error(error_log: str) -> dict:
    prompt = build_prompt(error_log)
    response = ollama.generate(model="llama3.2", prompt=prompt)
    raw_text = response["response"].strip()

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError:
        parsed = {}

    category = parsed.get("category")
    severity = parsed.get("severity")
    summary = parsed.get("cleanSummary")

    # Validate the model actually returned values from our allowed lists.
    # If not, fall back to safe defaults rather than storing invalid data.
    if category not in CATEGORIES:
        category = "UNKNOWN"
    if severity not in SEVERITIES:
        severity = "LOW"
    if not summary or not isinstance(summary, str):
        summary = "AI could not generate a summary for this error."

    return {
        "category": category,
        "severity": severity,
        "cleanSummary": summary,
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "thoughtflow-ai-service"}


@app.post("/api/v1/analyze", response_model=AnalyzeResponse)
def analyze_batch(request: AnalyzeRequest):
    results = []
    for failure in request.failures:
        analysis = analyze_error(failure.rawErrorLog)
        results.append(AnalyzeResult(
            id=failure.id,
            category=analysis.get("category", "UNKNOWN"),
            severity=analysis.get("severity", "LOW"),
            cleanSummary=analysis.get("cleanSummary", "No summary available."),
        ))
    return AnalyzeResponse(results=results)