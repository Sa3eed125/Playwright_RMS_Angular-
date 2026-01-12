# GitHub Actions Workflow Diagram

## 🔄 Workflow Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     TRIGGER EVENT                            │
│  • Pull Request to main/develop                             │
│  • Push to main/develop                                     │
│  • Manual workflow dispatch                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               STEP 1: Setup Environment                      │
│  ✓ Checkout code                                            │
│  ✓ Setup Node.js 20 (with npm cache)                       │
│  ✓ Install dependencies (npm ci)                           │
│  ✓ Install Playwright browsers (chromium)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               STEP 2: Run Smoke Tests                        │
│  Environment Variables (from GitHub Secrets):               │
│    • BASE_URL                                               │
│    • TEST_EMAIL                                             │
│    • TEST_PASSWORD                                          │
│    • TEST_REALM                                             │
│    • TEST_ENV                                               │
│                                                             │
│  Test Execution:                                            │
│    • Run: npx playwright test tests/smoke/                 │
│    • Browser: Chromium only                                │
│    • Retries: 1 attempt                                    │
│    • Workers: 1 (sequential)                               │
│    • Reporters: html, list, json                           │
│    • Timeout: 15 minutes                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│            STEP 3: Upload Artifacts (Always)                 │
│  📦 smoke-test-results (test-results/)                      │
│  📦 playwright-report (playwright-report/)                  │
│  📦 failure-screenshots (only on failure)                   │
│  📦 failure-videos (only on failure)                        │
│                                                             │
│  Retention: 7 days                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         STEP 4: Comment on PR (if PR event)                  │
│                                                             │
│  Example Comment:                                           │
│  ┌─────────────────────────────────────────────────┐       │
│  │ ### 🔥 Smoke Test Results                       │       │
│  │                                                  │       │
│  │ | Status | Count |                              │       │
│  │ |--------|-------|                              │       │
│  │ | ✅ Passed | 2 |                               │       │
│  │ | ❌ Failed | 0 |                               │       │
│  │ | 📊 Total | 2 |                                │       │
│  │                                                  │       │
│  │ **Duration:** 45.23s                            │       │
│  │ ✨ All smoke tests passed!                       │       │
│  └─────────────────────────────────────────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                    ✅ COMPLETE
```

## 📊 Test Result Flow

```
Test Execution
     │
     ├─► ✅ PASSED ──────────────┐
     │                           │
     └─► ❌ FAILED ──────────────┤
           │                     │
           └─► 🔄 RETRY (1x)     │
                 │               │
                 ├─► ✅ PASSED ──┤
                 │               │
                 └─► ❌ FAILED ──┤
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Capture Artifacts:    │
                    │  • Screenshot          │
                    │  • Video Recording     │
                    │  • Trace File          │
                    │  • Error Context       │
                    └────────────────────────┘
```

## 🔐 Secrets Usage

```
GitHub Repository Secrets
    │
    ├─► BASE_URL ───────────► process.env.BASE_URL
    │
    ├─► TEST_EMAIL ─────────► process.env.TEST_EMAIL
    │
    ├─► TEST_PASSWORD ──────► process.env.TEST_PASSWORD
    │
    ├─► TEST_REALM ─────────► process.env.TEST_REALM
    │
    └─► TEST_ENV ───────────► process.env.TEST_ENV
                │
                ▼
         Playwright Tests
         (LoginPage, etc.)
```

## 📁 Artifact Structure

```
Workflow Run Artifacts/
│
├── smoke-test-results/
│   ├── results.json           # JSON test results
│   └── .last-run.json         # Last run metadata
│
├── playwright-report/
│   ├── index.html             # Main report page
│   ├── data/                  # Report data files
│   └── trace/                 # Trace files (on retry)
│
├── failure-screenshots/       # Only if tests fail
│   ├── test-1-failure.png
│   └── test-2-failure.png
│
└── failure-videos/            # Only if tests fail
    ├── test-1.webm
    └── test-2.webm
```

## 🎯 Decision Tree

```
                    PR Created/Updated
                           │
                           ▼
                   Is workflow file
                    in main branch?
                    ┌─────┴─────┐
                   NO           YES
                    │            │
                    ▼            ▼
              Don't Run    Are secrets
                           configured?
                           ┌─────┴─────┐
                          NO           YES
                           │            │
                           ▼            ▼
                    Tests fail     Run tests
                   (auth error)         │
                                       │
                           ┌───────────┴───────────┐
                           │                       │
                           ▼                       ▼
                      Tests Pass            Tests Fail
                           │                       │
                           ▼                       ▼
                   Post ✅ comment         Post ❌ comment
                   No artifacts          Upload artifacts:
                   (only results)        • Screenshots
                                        • Videos
                                        • Traces
```

## 🔄 Concurrency Strategy

```
Same Branch → Multiple Pushes
      │
      ├─► Push 1 → Workflow Run #1 ──┐
      │                               │
      ├─► Push 2 → Workflow Run #2    │
      │              │                │
      │              └─► CANCELS ─────┘
      │                  (Run #1)
      │
      └─► Push 3 → Workflow Run #3
                     │
                     └─► CANCELS ─────┐
                         (Run #2)     │
                                      ▼
                              Only Run #3 Completes
```

**Benefit:** Saves CI/CD minutes by canceling outdated runs.

---

## 📚 Legend

| Symbol | Meaning |
|--------|---------|
| ✓ | Completed step |
| ✅ | Success |
| ❌ | Failure |
| 🔄 | Retry/Repeat |
| 📦 | Artifact/Package |
| 🔐 | Secret/Secure |
| 📊 | Report/Results |
| 🎯 | Decision Point |
