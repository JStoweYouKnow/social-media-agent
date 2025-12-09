#!/bin/bash

# Post Planner Mobile - Quick Start Script
# This script clears cache and starts the app

echo "🚀 Starting Post Planner Mobile App..."
echo ""

# Change to mobile-app directory
cd "$(dirname "$0")"

# Clear Expo cache
echo "📦 Clearing Expo cache..."
rm -rf .expo

# Start Expo with cleared cache
echo "✨ Starting Expo..."
echo ""
echo "Options:"
echo "  Press 'i' - Open in iOS Simulator"
echo "  Press 'a' - Open in Android Emulator"
echo "  Scan QR - Use Expo Go app on your phone"
echo ""

npx expo start --clear
