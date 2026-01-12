# 🚀 Quick Start: GitHub Actions for Playwright Tests

## What Was Added

✅ **GitHub Actions workflow** for automated smoke tests on every PR  
✅ **Auto-commenting** on PRs with test results  
✅ **Artifact uploads** for reports, screenshots, and videos  
✅ **Status badge** in README  

## 🔐 Setup Required (One-Time)

Add these secrets to GitHub repository:

```bash
gh secret set BASE_URL -b "https://csp.contellect.co.za"
gh secret set TEST_EMAIL -b "saied.mohamed@contellect.com"
gh secret set TEST_PASSWORD -b "your-password"
gh secret set TEST_REALM -b "Mobile_QC_RMS_ECM"
gh secret set TEST_ENV -b "TestEnv"
```

**Or via GitHub UI:**  
`Repository → Settings → Secrets → Actions → New repository secret`

## 📝 How It Works

### Automatic Triggers
- ✅ Every pull request to `main` or `develop`
- ✅ Every push to `main` or `develop`

### What Gets Tested
- 🔥 All smoke tests in `tests/smoke/`
- 🧪 Runs on Chromium browser
- 🔄 Retries failed tests once
- ⏱️ 15-minute timeout

### Results
- 💬 PR comment with pass/fail summary
- 📊 HTML report (downloadable artifact)
- 📸 Screenshots on failures
- 🎬 Videos on failures

## 🎯 Manual Trigger

```bash
# Via GitHub UI
Actions → Playwright Smoke Tests → Run workflow

# Via GitHub CLI
gh workflow run playwright-smoke-tests.yml
```

## 📦 Files Created

```
.github/
├── workflows/
│   ├── playwright-smoke-tests.yml    # Main workflow
│   └── README.md                      # Detailed workflow docs
├── GITHUB_ACTIONS_SETUP.md            # Complete setup guide
└── QUICK_START_CI.md                  # This file
```

## 🔍 View Results

### In PR:
- Look for automated comment with test results table

### In Actions Tab:
1. Click **Actions** tab
2. Select workflow run
3. View logs and download artifacts

### Download Report:
1. Go to workflow run
2. Scroll to **Artifacts** section
3. Download `playwright-report`
4. Extract and open `index.html`

## ⚡ Status Badge

Add to any markdown file:

```markdown
![Smoke Tests](https://github.com/Sa3eed125/Playwright_RMS_Angular-/actions/workflows/playwright-smoke-tests.yml/badge.svg)
```

Result: ![Smoke Tests](https://github.com/Sa3eed125/Playwright_RMS_Angular-/actions/workflows/playwright-smoke-tests.yml/badge.svg)

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests not running | Check secrets are configured |
| Authentication fails | Verify TEST_EMAIL and TEST_PASSWORD |
| Timeout errors | Check BASE_URL is accessible |
| No PR comment | Ensure workflow has write permissions |

## 📚 Documentation

- **Full Setup Guide:** [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)
- **Workflow Details:** [.github/workflows/README.md](.github/workflows/README.md)
- **Project README:** [README.md](README.md)

## ✅ Next Steps

1. Configure GitHub secrets (required)
2. Commit and push workflow files
3. Create a test PR to see it in action
4. Review the automated PR comment
5. Download and check the HTML report

---

**Ready to merge?** Once secrets are configured, the workflow will run automatically! 🎉
