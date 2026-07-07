# ThoughtFlow Ops

An intelligent pipeline that ingests QA test-failure spreadsheets (Excel/CSV),
uses a local LLM to auto-categorize and summarize failures, and surfaces them
on a live triage dashboard.

## Branching Strategy (Day 1)

- `main` — always production-ready. Nothing is committed here directly.
- `develop` — integration branch. All feature branches merge here first.
- `feature/<name>` — one branch per day/task, e.g. `feature/day02-docker-db`.

Rule: no direct commits to `main`. Work happens in `feature/*` branches,
gets merged into `develop`, and only tested, stable code is promoted to `main`.

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(scope): ...` — new feature
- `fix(scope): ...` — bug fix
- `chore(scope): ...` — tooling/setup, no production code change
- `docs(scope): ...` — documentation only
- `test(scope): ...` — adding/adjusting tests

## Progress Log

- **Day 1**: Git repo initialized (`main` + `develop` branches). Express
  backend scaffolded with a working `/health` endpoint.
