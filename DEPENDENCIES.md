# Project Dependencies

This document lists all dependencies used in the Playwright RMS Angular automation framework.

## Production Dependencies

Currently, this project has no runtime production dependencies as it is a test automation framework.

## Development Dependencies

### Testing Framework
- **@playwright/test** `^1.57.0`
  - End-to-end testing framework for modern web applications
  - Provides cross-browser automation capabilities
  - Includes built-in test runner, assertions, and reporters
  - Official website: https://playwright.dev/

### Type Definitions
- **@types/node** `^20.10.0`
  - TypeScript type definitions for Node.js
  - Enables TypeScript IntelliSense for Node.js APIs
  - Required for TypeScript compilation

### Configuration Management
- **dotenv** `^17.2.3`
  - Loads environment variables from `.env` files
  - Used for managing environment-specific configurations
  - Keeps sensitive data out of source code
  - GitHub: https://github.com/motdotla/dotenv

### Language Support
- **typescript** `^5.3.0`
  - TypeScript language compiler
  - Provides static typing for JavaScript
  - Enhances code quality and maintainability
  - Official website: https://www.typescriptlang.org/

## System Requirements

### Node.js
- **Version:** 18.x or higher (LTS recommended)
- **Package Manager:** npm 9.x or higher

### Browsers (Installed via Playwright)
- Chromium (latest stable)
- Firefox (latest stable)
- WebKit (latest stable)

## Installation

Install all dependencies using npm:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

Install Playwright browsers with system dependencies:

```bash
npx playwright install --with-deps
```

## Dependency Management

### Updating Dependencies

Check for outdated packages:
```bash
npm outdated
```

Update all dependencies to their latest versions:
```bash
npm update
```

Update a specific package:
```bash
npm update <package-name>
```

### Security Audits

Run security audit:
```bash
npm audit
```

Fix security vulnerabilities:
```bash
npm audit fix
```

### Lock File

The project uses `package-lock.json` to ensure consistent dependency versions across environments. This file should be committed to version control.

## CI/CD Dependencies

### GitHub Actions
- **actions/checkout@v4** - Checkout repository code
- **actions/setup-node@v4** - Setup Node.js environment
- **actions/upload-artifact@v4** - Upload test artifacts
- **actions/download-artifact@v4** - Download test artifacts
- **actions/github-script@v7** - Run GitHub API scripts

## Custom Dependencies

### Custom Reporter
- **custom-reporter.ts** - Custom HTML reporter implementation
  - Generates enhanced test reports with modern UI
  - Located in project root
  - Implements Playwright Reporter interface

## Version Compatibility Matrix

| Dependency | Minimum Version | Tested Version | Node.js Required |
|------------|----------------|----------------|------------------|
| @playwright/test | 1.40.0 | 1.57.0 | 18.x+ |
| typescript | 5.0.0 | 5.3.0 | 18.x+ |
| @types/node | 20.0.0 | 20.10.0 | 18.x+ |
| dotenv | 16.0.0 | 17.2.3 | 18.x+ |

## Notes

- All dependencies use semantic versioning (semver)
- Caret (^) notation allows minor and patch updates
- Dependencies are locked via `package-lock.json`
- Regular updates recommended for security patches
- Always test after dependency updates

## Support & Documentation

- Playwright Documentation: https://playwright.dev/docs/intro
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Node.js Documentation: https://nodejs.org/docs/
