#!/bin/bash

# Consulting Pro - Deployment Script
echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment complete!"
echo "📱 Your website should be available at: https://yourusername.github.io/consulting"
echo ""
echo "💡 Don't forget to:"
echo "   1. Update the homepage URL in package.json with your actual GitHub username"
echo "   2. Configure GitHub Pages in your repository settings"
echo "   3. Set up a custom domain if desired"
