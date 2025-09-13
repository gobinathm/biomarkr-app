# GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Setup

1. **Enable GitHub Pages**: Go to your repository settings → Pages → Source: GitHub Actions

2. **Automatic Deployment**: The site will automatically deploy on every push to the `main` branch

3. **Manual Deployment**: You can also manually trigger deployment from the Actions tab

## Configuration Files

- `.github/workflows/deploy.yml`: GitHub Actions workflow for building and deploying
- `vite.config.ts`: Configured with correct base path for GitHub Pages
- `public/.nojekyll`: Disables Jekyll processing to serve Vite files correctly
- `src/main.tsx`: BrowserRouter configured with correct basename

## Live Site

Once deployed, your site will be available at:
```
https://gobinathm.github.io/biomarkr-app/
```

## Local Testing

To test the production build locally with the correct base path:

```bash
npm run build
npm run preview
```

## Troubleshooting

- If routes don't work, ensure the basename is correctly set in BrowserRouter
- If assets fail to load, verify the base path in vite.config.ts
- Check the Actions tab for build/deployment errors