# 🚀 Vercel Deployment Guide

This guide explains how to deploy the Mistral Platform Docs to Vercel using GitHub Actions.

## 🔑 Required Secrets

Before deploying, ensure these GitHub Secrets are set up in your repository:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `VERCEL_ORG_ID` | Vercel Organization ID | ✅ Yes |
| `VERCEL_PROJECT_ID` | Vercel Project ID | ✅ Yes |
| `VERCEL_TOKEN` | Vercel API Token | ✅ Yes |
| `MISTRAL_API_KEY` | Mistral AI API Key | ✅ Yes |
| `NEXT_PUBLIC_BASE_URL` | Production domain URL | ✅ Yes |

## 📋 Workflows

### 1. Production Deployment (`deploy_to_vercel.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**Features:**
- ✅ Automatic production deployment
- ✅ Build caching for faster deployments
- ✅ Environment variable management
- ✅ Cleanup after deployment
- ✅ Concurrency control (prevents duplicate deployments)

### 2. Preview Deployment (`deploy_preview.yml`)

**Triggers:**
- Pull request opened
- Pull request synchronized (new commits)
- Pull request reopened

**Features:**
- ✅ Automatic preview deployment for each PR
- ✅ PR comment with preview URL
- ✅ Auto-updates preview on new commits
- ✅ Temporary deployments (deleted when PR closes)
- ✅ Concurrency control per PR

## 🎯 Deployment Process

### Production Deployment

1. **Push to main branch**
   ```bash
   git push origin main
   ```

2. **GitHub Actions triggers** the `deploy_to_vercel.yml` workflow

3. **Workflow steps:**
   - Checkout code with submodules
   - Set up pnpm and Node.js
   - Install dependencies (cached)
   - Build Next.js application
   - Deploy to Vercel production

4. **Deployment complete** 🎉

### Preview Deployment

1. **Create or update a pull request**

2. **GitHub Actions triggers** the `deploy_preview.yml` workflow

3. **Workflow steps:**
   - Checkout code with submodules
   - Set up pnpm and Node.js
   - Install dependencies (cached)
   - Build Next.js application
   - Deploy to Vercel preview
   - Comment on PR with preview URL

4. **Preview ready** 🚀

## 🛠 Configuration

### Vercel Configuration

Edit `vercel.json` to customize deployment settings:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "MISTRAL_API_KEY": "@mistral_api_key",
    "NEXT_PUBLIC_BASE_URL": "@next_public_base_url"
  },
  "public": true
}
```

### Environment Variables

Set these in your Vercel project settings:

| Variable | Description | Default |
|----------|-------------|---------|
| `MISTRAL_API_KEY` | Mistral AI API key | None |
| `NEXT_PUBLIC_BASE_URL` | Production domain | None |

## 🔧 Troubleshooting

### Common Issues

**1. Deployment fails with "Invalid token"**
- Ensure `VERCEL_TOKEN` is correctly set in GitHub Secrets
- Verify the token has proper permissions in Vercel

**2. Build fails with missing dependencies**
- Run `pnpm install` locally to verify
- Check `pnpm-lock.yaml` for consistency

**3. Preview URL not posted to PR**
- Ensure GitHub Actions has write permissions
- Check the workflow logs for errors

**4. Deployment stuck or timing out**
- Check GitHub Actions logs for specific errors
- Verify Vercel project exists and ID is correct

## 📊 Monitoring

- **GitHub Actions**: Monitor workflow runs
- **Vercel Dashboard**: View deployment status and logs
- **Preview Comments**: Check PR for preview URLs

## 🎉 Best Practices

1. **Use descriptive commit messages** for easier deployment tracking
2. **Test locally** before pushing to main
3. **Use pull requests** for all changes to trigger preview deployments
4. **Monitor deployments** in both GitHub and Vercel
5. **Rotate secrets** regularly for security

## 🔒 Security

- Never commit secrets to code
- Use GitHub Secrets for all sensitive information
- Rotate tokens regularly
- Limit token permissions to what's necessary

---

**Need help?** Check the [Vercel documentation](https://vercel.com/docs) or [GitHub Actions documentation](https://docs.github.com/en/actions) for more details.