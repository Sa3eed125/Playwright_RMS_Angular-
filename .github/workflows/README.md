# GitHub Actions Workflows

This directory contains CI/CD workflows for automated testing using GitHub Actions.

## Workflows

### 🔥 Playwright Smoke Tests (`playwright-smoke-tests.yml`)

Runs smoke tests on every pull request and push to main/develop branches.

**Triggers:**
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`
- Manual workflow dispatch

**Features:**
- ✅ Runs smoke tests with Playwright
- 📊 Uploads test results, HTML reports, and failure artifacts
- 💬 Comments on PRs with test results summary
- 🔄 Automatic retries for flaky tests
- ⏱️ 15-minute timeout to prevent hanging builds

**Required GitHub Secrets:**

To run the tests successfully, you need to configure the following secrets in your GitHub repository settings:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `BASE_URL` | Application URL to test against | `https://csp.contellect.co.za` |
| `TEST_EMAIL` | Test user email | `test@example.com` |
| `TEST_PASSWORD` | Test user password | `your-password` |
| `TEST_REALM` | Test realm/tenant | `Mobile_QC_RMS_ECM` |
| `TEST_ENV` | Test environment name (optional) | `TestEnv` |

### Setting Up Secrets

**Via GitHub UI:**
```
Repository → Settings → Secrets and variables → Actions → New repository secret
```

**Via GitHub CLI:**
```bash
gh secret set BASE_URL -b "https://csp.contellect.co.za"
gh secret set TEST_EMAIL -b "your-email@example.com"
gh secret set TEST_PASSWORD -b "your-password"
gh secret set TEST_REALM -b "Mobile_QC_RMS_ECM"
gh secret set TEST_ENV -b "TestEnv"
```

## Viewing Test Results

After a workflow run completes:

1. **Test Results**: Go to the workflow run → Artifacts → Download `smoke-test-results`
2. **HTML Report**: Download `playwright-report` artifact and open `index.html`
3. **Failure Screenshots**: Available in `failure-screenshots` artifact (only on failures)
4. **PR Comments**: Automatic summary posted as a comment on pull requests

## Manual Workflow Trigger

You can manually trigger the workflow:

1. Go to **Actions** tab
2. Select **Playwright Smoke Tests**
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Troubleshooting

### Tests failing in CI but passing locally?

- Check that GitHub secrets are correctly configured
- Verify the BASE_URL is accessible from GitHub Actions runners
- Review timeout settings in `playwright.config.ts`
- Check the uploaded screenshots and videos for visual debugging

### Workflow not triggering?

- Ensure the workflow file is in the `main` branch
- Check branch protection rules
- Verify the workflow has proper permissions

### Need more information?

- Check workflow logs for detailed output
- Download and review the HTML report artifact
- Look at screenshots and videos from failed tests
