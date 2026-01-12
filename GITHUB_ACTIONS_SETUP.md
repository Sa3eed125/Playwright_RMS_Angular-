# GitHub Actions Setup

## ⚙️ Setup Steps

### 1. Configure GitHub Secrets

Go to: **Repository Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret | Value |
|--------|-------|
| `BASE_URL` | `https://csp.contellect.co.za` |
| `TEST_EMAIL` | Your test email |
| `TEST_PASSWORD` | Your test password |
| `TEST_REALM` | `Mobile_QC_RMS_ECM` |

**Using GitHub CLI:**
```bash
gh secret set BASE_URL -b "https://csp.contellect.co.za"
gh secret set TEST_EMAIL -b "your-email"
gh secret set TEST_PASSWORD -b "your-password"
gh secret set TEST_REALM -b "Mobile_QC_RMS_ECM"
```

### 2. How It Works

- ✅ Runs automatically on every PR
- 💬 Posts test results as PR comment
- 📊 Uploads HTML report (downloadable)
- 📸 Saves screenshots on failure

### 3. View Results

**In PR:**
- Check the automated comment for pass/fail

**In Actions Tab:**
- Download reports and screenshots

That's it! 🎉
