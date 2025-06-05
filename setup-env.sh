#!/bin/bash

echo "🔥 Firebase Environment Setup for UpTogether"
echo "=============================================="

# Create .env.development file
echo "Creating .env.development..."
cat > .env.development << 'EOF'
# Firebase Development Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-dev-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-dev.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-dev
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-dev.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# App Configuration
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_APP_VERSION=1.0.0
EOF

# Create .env.production file
echo "Creating .env.production..."
cat > .env.production << 'EOF'
# Firebase Production Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-prod-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-prod.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-prod
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-prod.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# App Configuration
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_APP_VERSION=1.0.0
EOF

# Create .env file (defaults to development)
echo "Creating .env (development defaults)..."
cp .env.development .env

echo ""
echo "✅ Environment files created!"
echo ""
echo "📝 Next steps:"
echo "1. Go to Firebase Console: https://console.firebase.google.com"
echo "2. Create your project or select existing one"
echo "3. Get your config from Project Settings → General → Your apps"
echo "4. Replace the placeholder values in .env.development and .env.production"
echo "5. Update src/firebase/config.ts to use environment variables"
echo ""
echo "🔧 To switch environments:"
echo "  Development: cp .env.development .env"
echo "  Production:  cp .env.production .env"
echo ""
echo "⚠️  Remember to add .env* files to .gitignore to keep secrets safe!"

# Update .gitignore if it exists
if [ -f .gitignore ]; then
    echo "Updating .gitignore..."
    echo "" >> .gitignore
    echo "# Environment variables" >> .gitignore
    echo ".env" >> .gitignore
    echo ".env.local" >> .gitignore
    echo ".env.development" >> .gitignore
    echo ".env.production" >> .gitignore
    echo "✅ .gitignore updated"
else
    echo "⚠️  No .gitignore found. Please add .env files to your .gitignore manually"
fi

echo ""
echo "🚀 Setup complete! Check firebase-setup-guide.md for detailed instructions." 