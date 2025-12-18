# Vercel Deployment Guide for Mistral AI Platform Docs

This guide will walk you through deploying the Mistral AI Platform Docs to Vercel using your Mistral API key.

## Prerequisites

1. **Vercel Account**: Sign up at [https://vercel.com](https://vercel.com)
2. **Vercel CLI**: Installed globally (`npm install -g vercel`)
3. **Mistral API Key**: Required for Ask LeChat functionality
4. **Node.js**: Version 18+ (recommended)
5. **pnpm**: Version 9+ (recommended)

## Step 1: Configure Environment Variables

### Option A: Using `make config` (Interactive)

```bash
cd /Users/samirtabib/platform-docs-public
make config
```

Follow the prompts to enter your Mistral API key and other configuration options.

### Option B: Manual Configuration

Create a `.env.local` file in the project root:

```bash
cd /Users/samirtabib/platform-docs-public
touch .env.local
```

Add the following content (replace with your actual Mistral API key):

```env
# Mistral AI API Key - Required for Ask LeChat functionality
MISTRAL_API_KEY="your_mistral_api_key_here"

# Base URL for the application
NEXT_PUBLIC_BASE_URL="https://your-vercel-app-url.vercel.app"

# Cookbooks directory (optional)
# COOKBOOKS_DIR="./static/cookbooks"
```

## Step 2: Install Dependencies

```bash
cd /Users/samirtabib/platform-docs-public
pnpm install
```

## Step 3: Build the Application

```bash
pnpm build
```

This will:
- Generate cookbook content
- Export raw MDX files
- Build the search index
- Copy assets
- Generate LeChat routes
- Build the Next.js application

## Step 4: Deploy to Vercel

### Option A: Vercel CLI Deployment

```bash
vercel
```

Follow the interactive prompts:

1. **Link to existing project or create new**: Choose "Create new project"
2. **Project name**: Enter a name for your deployment
3. **Root directory**: Keep default (.)
4. **Build command**: `pnpm build`
5. **Output directory**: Keep default
6. **Development command**: `pnpm dev`
7. **Install command**: `pnpm install`

### Option B: Vercel Dashboard Deployment

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub/GitLab repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`
   - **Output Directory**: Keep default
   - **Environment Variables**: Add your `MISTRAL_API_KEY`

## Step 5: Configure Environment Variables in Vercel

After deployment, add your environment variables:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add the following variables:

```
Name: MISTRAL_API_KEY
Value: your_mistral_api_key_here
```

```
Name: NEXT_PUBLIC_BASE_URL
Value: https://your-vercel-app-url.vercel.app
```

## Step 6: Deploy

```bash
vercel --prod
```

Or push to your connected Git repository to trigger automatic deployment.

## Step 7: Verify Deployment

1. Visit your deployed URL
2. Test the Ask LeChat functionality:
   - Click the "Ask LeChat" button
   - Send a test message
   - Verify navigation works
   - Test search integration

## Troubleshooting

### Common Issues

1. **Build failures**: Ensure all dependencies are installed and the build command runs successfully locally first.

2. **API key issues**: Verify your Mistral API key is correct and has the necessary permissions.

3. **Route generation**: If navigation isn't working, regenerate routes:
   ```bash
   pnpm lechat:routes
   ```

4. **Search index**: If search isn't working, rebuild the search index:
   ```bash
   pnpm search:build
   ```

## Advanced Configuration

### Custom Domains

To add a custom domain:

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### Environment-Specific Configuration

Create environment-specific files:

- `.env.development`: Local development
- `.env.staging`: Staging environment
- `.env.production`: Production environment

### CI/CD Integration

Add the following to your GitHub Actions workflow:

```yaml
- name: Deploy to Vercel
  run: |
    npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Monitoring and Maintenance

1. **Monitor deployments**: Check Vercel dashboard for build logs and errors
2. **Update regularly**: Keep dependencies updated
3. **Test changes**: Always test locally before deploying
4. **Backup**: Regularly backup your environment variables

## Support

For issues with:
- **Vercel deployment**: Check [Vercel documentation](https://vercel.com/docs)
- **Mistral API**: Contact Mistral support
- **Application code**: Review the codebase and tests

## Notes

- The application uses Next.js with MDX for documentation
- Ask LeChat requires the Mistral API key for full functionality
- Search functionality uses MiniSearch for client-side search
- Routes are auto-generated from the documentation structure
