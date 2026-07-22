import ollama

CATEGORIES = ["DATABASE_ERROR", "UI_FLAKINESS", "AUTH_FAILURE", "NETWORK_ERROR", "UNKNOWN"]
SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

def build_prompt(error_log: str) -> str:
    examples = """Example 1:
Error log: "org.postgresql.util.PSQLException: FATAL: remaining connection slots are reserved for non-replication superuser connections"
JSON response: {"category": "DATABASE_TIMEOUT", "severity": "HIGH", "cleanSummary": "Database connection pool exhausted, no slots available"}

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
- DATABASE_ERROR: database connections, queries, pooling, or transaction failures
- UI_FLAKINESS: frontend rendering, element timeouts, browser automation issues
- AUTH_FAILURE: login, token, session, or permission-related failures specifically
- NETWORK_ERROR: connectivity issues to external services, APIs, or messaging systems (not the database itself)
- UNKNOWN: use only if truly none of the above fit

Here are some correctly labeled examples:

{examples}
Now analyze this error log:
{error_log}

JSON response:"""

def analyze_error(error_log: str) -> str:
    prompt = build_prompt(error_log)
    response = ollama.generate(model="llama3.2", prompt=prompt)
    return response["response"]

if __name__ == "__main__":
    sample_logs = [
        "com.rabbitmq.client.AlreadyClosedException: connection is already closed due to connection timeout",
        "java.lang.AssertionError: expected:<200> but was:<500>\n\tat org.junit.Assert.fail(Assert.fail.java:89)",
        "!!! UNHANDLED CRITICAL SHUTDOWN CRASH TIMEOUT !!! \nKeyError: 'user_id'\n\nFile \"/app/api/routes.py\", line 42, in get_user\n    user_data = session['user_id']\n[TRAILING NOISE STRINGS]",
    ]

    for log in sample_logs:
        result = analyze_error(log)
        print("INPUT:", log[:80].replace("\n", " "), "...")
        print("OUTPUT:", result)
        print("-" * 60)