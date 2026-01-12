# GitHub Actions Setup Guide

This guide will help you set up GitHub Actions for your Playwright test automation.

## ✅ What's Already Done

The following workflow file has been created:
- `.github/workflows/playwright-smoke-tests.yml` - Runs smoke tests on every pull request

## 🔧 Required Setup Steps

### Step 1: Configure GitHub Secrets

GitHub Actions needs access to your test environment credentials. These are stored as encrypted secrets.

#### Option A: Via GitHub Web Interface

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `BASE_URL` | Your application URL | `https://csp.contellect.co.za` |
| `TEST_EMAIL` | Test account email | `saied.mohamed@contellect.com` |
| `TEST_PASSWORD` | Test account password | `your-secure-password` |
| `TEST_REALM` | Test realm/tenant | `Mobile_QC_RMS_ECM` |
| `TEST_ENV` | Environment name (optional) | `TestEnv` |

#### Option B: Via GitHub CLI (Faster)

If you have GitHub CLI installed ([`gh` CLI](https://cli.github.com/)):

```bash
# Navigate to your repository directory
cd c:\Playwright_RMS_Angular

# Set each secret (you'll be prompted for values)
gh secret set BASE_URL
gh secret set TEST_EMAIL
gh secret set TEST_PASSWORD
gh secret set TEST_REALM
gh secret set TEST_ENV

# Or set them directly
gh secret set BASE_URL -b "https://csp.contellect.co.za"
gh secret set TEST_EMAIL -b "saied.mohamed@contellect.com"
gh secret set TEST_PASSWORD -b "your-password"
gh secret set TEST_REALM -b "Mobile_QC_RMS_ECM"
gh secret set TEST_ENV -b "TestEnv"
```

### Step 2: Commit and Push the Workflow

```bash
# Stage the workflow files
git add .github/workflows/

# Commit the changes
git commit -m "Add GitHub Actions workflow for smoke tests"

# Push to your feature branch
git push origin feature/environment-variables-and-test-improvements
```

### Step 3: Test the Workflow

The workflow will automatically run when you:
- Create or update a pull request
- Push to `main` or `develop` branches

You can also manually trigger it:
1. Go to **Actions** tab in GitHub
2. Select **Playwright Smoke Tests**
3. Click **Run workflow**
4. Select your branch and click **Run workflow**

## 📊 What Happens After Setup

Once configured, for every pull request:

1. ✅ GitHub Actions automatically runs smoke tests
2. 📝 A comment is posted on the PR with test results:
   ```
   ### 🔥 Smoke Test Results
   
   | Status | Count |
   |--------|-------|
   | ✅ Passed | 2 |
   | ❌ Failed | 0 |
   | 📊 Total | 2 |
   
   ✨ All smoke tests passed!
   ```
3. 📦 Test artifacts are uploaded (reports, screenshots, videos)
4. 🔍 You can download and review detailed HTML reports

## 🎯 Viewing Test Results

### In GitHub Actions UI

1. Go to **Actions** tab
2. Click on a workflow run
3. View the job logs and test output
4. Download artifacts (reports, screenshots, videos)

### Test Artifacts Available

- `smoke-test-results` - JSON test results
- `playwright-report` - HTML report (open `index.html` in browser)
- `failure-screenshots` - Screenshots when tests fail
- `failure-videos` - Video recordings of failures

## 🔍 Troubleshooting

### Issue: Workflow not running

**Solution:** Make sure the workflow file is in the `main` branch, or check branch protection rules.

### Issue: Tests failing with authentication errors

**Solution:** Verify GitHub secrets are correctly set with the right values.

### Issue: BASE_URL not accessible

**Solution:** Ensure the application URL is publicly accessible or configure GitHub Actions to use a VPN/private runner.

### Issue: Secrets not being used

**Solution:** Secrets are only available for workflows triggered by the repository owner or collaborators, not from forked repositories.

## 🚀 Next Steps

### Optional Enhancements

1. **Add more test workflows:**
   - E2E tests workflow
   - API tests workflow
   - Performance tests

2. **Add status badges to README:**
   ```markdown
   ![Smoke Tests](https://github.com/Sa3eed125/Playwright_RMS_Angular-/actions/workflows/playwright-smoke-tests.yml/badge.svg)
   ```

3. **Set up Slack/Teams notifications:**
   - Add notification steps to workflow for test failures

4. **Configure branch protection:**
   - Require smoke tests to pass before merging PRs

5. **Add code coverage reporting:**
   - Integrate coverage tools and upload reports

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## ✅ Verification Checklist

- [ ] GitHub secrets configured
- [ ] Workflow file committed to repository
- [ ] Workflow file pushed to GitHub
- [ ] Test workflow runs successfully (check Actions tab)
- [ ] PR comment with results appears
- [ ] Test artifacts are downloadable

---

**Need Help?** Check the [.github/workflows/README.md](.github/workflows/README.md) for more details.
