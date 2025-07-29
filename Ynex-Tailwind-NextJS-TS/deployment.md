# Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=out
```

### 3. GitHub Pages

```bash
# Build the project
npm run build

# The 'out' folder contains static files ready for deployment
```

### 4. AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Upload 'out' folder contents to S3 bucket
# Configure CloudFront for CDN
```

## Environment Variables

Create a `.env.production` file with:

```
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Build Commands

- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Start Production**: `npm run start`

## Static Export

The app is configured for static export (`output: "export"` in next.config.js).
The build output is in the `out/` directory.

## Performance Optimizations

- Images are optimized with imgix loader
- CSS is minified and purged
- JavaScript is minified with SWC
- Static assets are cached for 1 year

## Security Headers

Security headers are configured in deployment files:

- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
