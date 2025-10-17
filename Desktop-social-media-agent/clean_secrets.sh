#!/bin/bash

# Script to remove Canva API secret from git history and push to GitHub

echo "Installing BFG Repo-Cleaner..."
brew install bfg

echo "Creating bfg-replace.txt..."
cat > bfg-replace.txt << 'EOL'
cnvcaRfyrdgvKX59f9808pseRkImHSvIohjuO1tXyWiHMOY8c3171166==REDACTED
EOL

echo "Running BFG to remove secrets..."
bfg --replace-text bfg-replace.txt .

echo "Cleaning git reflog and garbage collecting..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "Force pushing to GitHub..."
git push --force origin main

echo "Done! Check if the push succeeded."
