# Security Guidelines

This document outlines security best practices for the Wild Rydes tutorial repository and deployment.

## ⚠️ Never Commit These to the Repository

The following items **must never** be committed to version control:

### Secrets and Credentials
- **AWS Access Keys** (Access Key ID, Secret Access Key)
- **AWS Session Tokens**
- **JWT Tokens** (even expired ones)
- **Client Secrets** (Cognito app client secrets)
- **API Keys** (any third-party API keys)
- **Database Connection Strings** (with credentials)
- **Private Endpoints** (internal AWS service URLs with account IDs)

### Configuration Values
- **Real User Pool IDs** (e.g., `us-east-2_rqyDv3A0e`)
- **Real App Client IDs** (e.g., `1c091538uomauk7frs0281svs4`)
- **Real API Gateway Invoke URLs** (e.g., `https://8jb2ylnalf.execute-api.us-east-2.amazonaws.com/dev`)
- **AWS Account IDs**
- **Resource ARNs** (with account IDs)
- **CloudWatch Log Group Names** (if they contain sensitive info)

### Other Sensitive Data
- **Screenshots** containing AWS Console with real IDs/URLs
- **Log files** with tokens or user data
- **Environment files** (`.env`, `.env.local`)
- **Private keys** or certificates
- **Passwords** (even test passwords)

## ✅ Safe to Commit

These items are **safe** to commit:

- **Placeholder values** (e.g., `YOUR_USER_POOL_ID`, `YOUR_API_INVOKE_URL`)
- **Example configuration files** (`config.example.js`)
- **Code** (HTML, CSS, JavaScript)
- **Documentation** (README, guides)
- **Public assets** (images, fonts)

## Configuration File Management

### Local Development

1. **Copy the example file:**
   ```bash
   cp js/config.example.js js/config.js
   ```

2. **Edit `js/config.js`** with your real values (never commit this file)

3. **Verify `.gitignore`** includes:
   ```
   js/config.js
   ```

### Production Deployment (Amplify)

**Option A: Environment Variables (Recommended)**

1. Set environment variables in Amplify Console:
   - `USER_POOL_ID`
   - `APP_CLIENT_ID`
   - `REGION`
   - `API_INVOKE_URL`

2. Use a build script to generate `config.js` from environment variables (see README.md)

**Option B: Amplify Console File Editor**

1. After deployment, edit `js/config.js` directly in Amplify Console
2. This file is not in Git, so it won't be overwritten by deployments
3. **Warning:** This file will be lost if you delete/recreate the Amplify app

## .gitignore Checklist

Ensure your `.gitignore` includes:

```
# Configuration files
js/config.js

# Environment files
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo
```

## Pre-Commit Checklist

Before committing, verify:

- [ ] No real AWS resource IDs in any files
- [ ] No tokens or secrets in code
- [ ] `js/config.js` is in `.gitignore` and not staged
- [ ] Screenshots don't contain real IDs
- [ ] Log files are excluded
- [ ] Environment files are excluded

## If You Accidentally Commit Secrets

**Immediate Actions:**

1. **Rotate/Delete the exposed secret:**
   - If it's an AWS access key: Delete it in IAM Console and create a new one
   - If it's a Cognito client secret: Regenerate it
   - If it's an API key: Regenerate it

2. **Remove from Git history:**
   ```bash
   # Remove file from history (use with caution)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch js/config.js" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (warns collaborators)
   git push origin --force --all
   ```

3. **Notify collaborators** if the repository is shared

4. **Consider making the repository private** temporarily

**Note:** If the repository is already public, assume the secret is compromised and rotate it immediately.

## Security Best Practices

### For Tutorial/Development

- Use **separate AWS accounts** for tutorials vs. production
- Use **IAM users with limited permissions** (not root account)
- **Delete resources** after completing the tutorial
- Use **AWS Free Tier** when possible

### For Production

- Use **AWS Secrets Manager** or **Parameter Store** for secrets
- Use **IAM roles** instead of access keys when possible
- Enable **MFA** on AWS accounts
- Use **least privilege** IAM policies
- Enable **CloudTrail** for audit logging
- Use **VPC endpoints** for private API access (if needed)
- Enable **WAF** on API Gateway for DDoS protection
- Use **Cognito User Pools** with strong password policies
- Enable **Cognito Advanced Security** features

## Reporting Security Issues

If you discover a security vulnerability in this tutorial code:

1. **Do not** open a public issue
2. Contact the repository maintainer privately
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact

## Additional Resources

- [AWS Security Best Practices](https://aws.amazon.com/security/security-resources/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

## Questions?

If you're unsure whether something is safe to commit:
- **When in doubt, don't commit it**
- Use placeholder values instead
- Ask in an issue (without revealing the actual secret)

