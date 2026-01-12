# GitHub Actions Workflows

## 🔥 Smoke Tests Workflow

Runs automatically on every pull request to `main` or `develop`.

### Setup (Required)

Configure these secrets in GitHub:

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | Value |
|--------|-------|
| `BASE_URL` | `https://csp.contellect.co.za` |
| `TEST_EMAIL` | Your test email |
| `TEST_PASSWORD` | Your test password |
| `TEST_REALM` | `Mobile_QC_RMS_ECM` |

Or use GitHub CLI:
```bash
gh secret set BASE_URL -b "https://csp.contellect.co.za"
gh secret set TEST_EMAIL -b "your-email"
gh secret set TEST_PASSWORD -b "your-password"
gh secret set TEST_REALM -b "Mobile_QC_RMS_ECM"
```

### Features

- ✅ Auto-runs on every PR
- 💬 Posts results as PR comment
- 📊 Uploads HTML reports
- 📸 Saves screenshots on failure

### View Results

- **PR Comment**: See pass/fail summary
- **Actions Tab**: Download reports and screenshots
