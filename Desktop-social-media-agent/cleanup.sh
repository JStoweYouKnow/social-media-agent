#!/bin/bash
# cleanup.sh - Remove unnecessary and redundant files

set -e  # Exit on error

echo "🧹 Post Planner Cleanup Script"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to prompt user
confirm() {
    read -p "$(echo -e ${YELLOW}$1${NC}) (y/n): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Count and display backup files
backup_count=$(find src -name "App.js.backup*" -o -name "App.js.bak" -o -name "App.js.pre_remove" -o -name "App.js.working-*" 2>/dev/null | wc -l | tr -d ' ')

if [ "$backup_count" -gt 0 ]; then
    echo "📦 Found $backup_count backup files:"
    find src -name "App.js.backup*" -o -name "App.js.bak" -o -name "App.js.pre_remove" -o -name "App.js.working-*" 2>/dev/null | while read file; do
        size=$(du -h "$file" 2>/dev/null | cut -f1)
        echo "  - $file ($size)"
    done
    echo ""
    
    if confirm "❓ Delete all backup files?"; then
        echo "🗑️  Deleting backup files..."
        find src -name "App.js.backup*" -exec rm -f {} \;
        find src -name "App.js.bak" -exec rm -f {} \;
        find src -name "App.js.pre_remove" -exec rm -f {} \;
        find src -name "App.js.working-*" -exec rm -f {} \;
        echo "✅ Backup files deleted"
    else
        echo "⏭️  Skipped backup file deletion"
    fi
else
    echo "✅ No backup files found"
fi

echo ""

# Clean up log files
if [ -f "api.log" ] || [ -f "nohup.out" ]; then
    echo "📝 Found log files:"
    [ -f "api.log" ] && echo "  - api.log ($(du -h api.log 2>/dev/null | cut -f1))"
    [ -f "nohup.out" ] && echo "  - nohup.out ($(du -h nohup.out 2>/dev/null | cut -f1))"
    echo ""
    
    if confirm "❓ Clear log files?"; then
        echo "🗑️  Clearing log files..."
        rm -f api.log nohup.out
        echo "✅ Log files cleared"
    else
        echo "⏭️  Skipped log file cleanup"
    fi
else
    echo "✅ No log files to clean"
fi

echo ""

# Clean npm cache
if confirm "❓ Clear npm cache?"; then
    echo "🧹 Clearing npm cache..."
    rm -rf node_modules/.cache 2>/dev/null || true
    echo "✅ npm cache cleared"
else
    echo "⏭️  Skipped npm cache cleanup"
fi

echo ""

# Clean build artifacts
if [ -d "build" ]; then
    if confirm "❓ Remove build directory?"; then
        echo "🗑️  Removing build directory..."
        rm -rf build
        echo "✅ Build directory removed"
    else
        echo "⏭️  Skipped build cleanup"
    fi
else
    echo "✅ No build directory found"
fi

echo ""
echo "=============================="
echo "✨ Cleanup Summary"
echo "=============================="

# Calculate saved space
total_size_before=$(du -sh . 2>/dev/null | cut -f1)
echo "📊 Current workspace size: $total_size_before"

if [ "$backup_count" -gt 0 ]; then
    echo "🗑️  Removed $backup_count backup files"
fi

echo ""
echo "💡 Next Steps:"
echo "   1. Review APP_REVIEW_REDUNDANCIES.md for code improvements"
echo "   2. Consider refactoring duplicate state management"
echo "   3. Remove console.log statements for production"
echo ""
echo "✅ Cleanup complete!"
