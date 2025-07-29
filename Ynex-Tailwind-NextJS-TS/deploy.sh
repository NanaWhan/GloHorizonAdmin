#!/bin/bash

echo "🚀 Starting deployment process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ -d "out" ]; then
    echo "✅ Build successful! Static files are in the 'out' directory."
    echo "📁 You can now deploy the contents of the 'out' folder to any static hosting service."
    echo ""
    echo "Quick deploy options:"
    echo "1. Vercel: vercel --prod"
    echo "2. Netlify: netlify deploy --prod --dir=out"
    echo "3. GitHub Pages: Upload 'out' folder contents"
    echo "4. AWS S3: Upload 'out' folder contents to S3 bucket"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi 