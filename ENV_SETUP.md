# Environment Variables Setup

This project uses environment variables to manage sensitive credentials and configuration.

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file with your actual credentials:**
   ```dotenv
   # Application URL
   BASE_URL=https://csp.contellect.co.za

   # Test Credentials
   TEST_EMAIL=your.email@example.com
   TEST_PASSWORD=your_password
   TEST_REALM=your_realm

   # Test Environment
   TEST_ENV=TestEnv
   ```

3. **Never commit `.env` file to Git** - It's already in `.gitignore`

## Available Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `BASE_URL` | Application base URL | Yes | `https://csp.contellect.co.za` |
| `TEST_EMAIL` | Test user email | Yes | `user@example.com` |
| `TEST_PASSWORD` | Test user password | Yes | `your_password` |
| `TEST_REALM` | Authentication realm | Yes | `Mobile_QC_RMS_ECM` |
| `TEST_ENV` | Environment name | No | `TestEnv` (default) |

## Usage in Tests

The environment variables are automatically loaded via `dotenv` in test files:

```typescript
import dotenv from 'dotenv';
dotenv.config();
```

They are accessed through the `loginData` object from `config/environments.ts`:

```typescript
import { loginData } from '../../config/environments';

// Usage
await loginPage.login(loginData.email, loginData.password, loginData.realm);
```

## CI/CD Configuration

### GitHub Actions
Environment variables are set in the workflow file (`.github/workflows/playwright.yml`):
```yaml
env:
  TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
  TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
  TEST_REALM: ${{ secrets.TEST_REALM }}
  BASE_URL: ${{ secrets.BASE_URL }}
```

**Setup GitHub Secrets:**
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each variable (TEST_EMAIL, TEST_PASSWORD, TEST_REALM, BASE_URL)

### CircleCI
Environment variables are set in the job configuration (`.circleci/config.yml`):
```yaml
environment:
  TEST_EMAIL: saied.mohamed@contellect.com
  TEST_PASSWORD: "123"
  TEST_REALM: Mobile_QC_RMS_ECM
  BASE_URL: https://csp.contellect.co.za
```

**Or set in CircleCI Project Settings:**
1. Go to CircleCI project **Project Settings** → **Environment Variables**
2. Click **Add Environment Variable**
3. Add each variable

## Security Best Practices

✅ **DO:**
- Keep `.env` file in `.gitignore`
- Use environment variables for sensitive data
- Rotate credentials regularly
- Use different credentials for different environments

❌ **DON'T:**
- Commit `.env` file to Git
- Share credentials in plain text
- Use production credentials in tests
- Hardcode sensitive data in source files

## Troubleshooting

**Issue:** Tests fail with "Cannot read property of undefined"
- **Solution:** Make sure `.env` file exists and contains all required variables

**Issue:** Environment variables not loaded in CI
- **Solution:** Check that variables are set in GitHub Secrets or CircleCI environment variables

**Issue:** Wrong credentials being used
- **Solution:** Verify `.env` file is in the project root and `dotenv.config()` is called before importing configurations
