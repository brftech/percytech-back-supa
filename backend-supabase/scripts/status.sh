#!/bin/bash

# PercyTech Monorepo Status Dashboard
# Shows comprehensive status of all packages and services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Function to print colored output
print_header() {
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                    PercyTech Monorepo Status                ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
}

print_section() {
    echo -e "${CYAN}📋 $1${NC}"
    echo "──────────────────────────────────────────────────────────────────"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✅]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️]${NC} $1"
}

print_error() {
    echo -e "${RED}[❌]${NC} $1"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "✅ Port $port is active"
    else
        echo "❌ Port $port is not listening"
    fi
}

# Function to check package health
check_package_health() {
    local package_name=$1
    local package_path=$2
    
    echo "   📦 $package_name:"
    
    # Check if package exists
    if [ ! -d "$package_path" ]; then
        echo "      ❌ Package directory not found"
        return 1
    fi
    
    # Check package.json
    if [ ! -f "$package_path/package.json" ]; then
        echo "      ❌ package.json not found"
        return 1
    fi
    
    # Check node_modules
    if [ ! -d "$package_path/node_modules" ]; then
        echo "      ⚠️  node_modules not found (run 'pnpm install')"
        return 1
    fi
    
    # Try to build package
    cd "$package_path"
    if pnpm run build >/dev/null 2>&1; then
        echo "      ✅ Build successful"
    else
        echo "      ❌ Build failed"
        return 1
    fi
    
    echo "      ✅ Package healthy"
    return 0
}

# Function to check service status
check_service_status() {
    local service_name=$1
    local port=$2
    local health_endpoint=$3
    
    echo "   🔧 $service_name:"
    
    # Check if port is listening
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "      ✅ Port $port is active"
        
        # Try health check if endpoint provided
        if [ -n "$health_endpoint" ]; then
            if curl -s "http://localhost:$port$health_endpoint" >/dev/null 2>&1; then
                echo "      ✅ Health check passed"
            else
                echo "      ⚠️  Health check failed"
            fi
        fi
    else
        echo "      ❌ Port $port is not listening"
    fi
}

# Function to show git status
show_git_status() {
    print_section "Git Repository Status"
    
    cd "$ROOT_DIR"
    
    # Current branch
    local current_branch=$(git branch --show-current)
    echo "   🌿 Current Branch: $current_branch"
    
    # Status
    local git_status=$(git status --porcelain)
    if [ -z "$git_status" ]; then
        echo "      ✅ Working directory clean"
    else
        echo "      ⚠️  Working directory has changes:"
        echo "$git_status" | sed 's/^/         /'
    fi
    
    # Recent commits
    echo "      📝 Recent commits:"
    git log --oneline -5 | sed 's/^/         /'
}

# Function to show package dependencies
show_dependencies() {
    print_section "Package Dependencies"
    
    cd "$ROOT_DIR"
    
    # Check pnpm workspace
    if [ -f "pnpm-workspace.yaml" ]; then
        echo "   📋 Workspace packages:"
        grep "^- '" pnpm-workspace.yaml | sed 's/^- /      📦 /'
    fi
    
    # Check for dependency issues
    echo "   🔍 Checking for dependency issues..."
    if pnpm list --depth=0 >/dev/null 2>&1; then
        echo "      ✅ Dependencies resolved"
    else
        echo "      ❌ Dependency resolution issues found"
        echo "      💡 Run 'pnpm install' to resolve"
    fi
}

# Function to show development environment
show_dev_environment() {
    print_section "Development Environment"
    
    # Node.js version
    local node_version=$(node --version 2>/dev/null || echo "Not installed")
    echo "   🟢 Node.js: $node_version"
    
    # pnpm version
    local pnpm_version=$(pnpm --version 2>/dev/null || echo "Not installed")
    echo "   📦 pnpm: $pnpm_version"
    
    # Git version
    local git_version=$(git --version 2>/dev/null || echo "Not installed")
    echo "   🌿 Git: $git_version"
    
    # Available ports
    echo "   🔌 Port Status:"
    check_port 3000  # Frontend
    check_port 3001  # Backend
    check_port 3002  # Alternative backend
}

# Function to show package status
show_package_status() {
    print_section "Package Health Status"
    
    # Backend
    if check_package_health "Backend" "$ROOT_DIR/backend"; then
        backend_healthy=true
    else
        backend_healthy=false
    fi
    
    # Admin app
    if check_package_health "Admin App" "$ROOT_DIR/apps/admin"; then
        admin_healthy=true
    else
        admin_healthy=false
    fi
    
    # Texting app
    if check_package_health "Texting App" "$ROOT_DIR/apps/texting"; then
        texting_healthy=true
    else
        texting_healthy=false
    fi
    
    # Web app
    if check_package_health "Web App" "$ROOT_DIR/apps/web"; then
        web_healthy=true
    else
        web_healthy=false
    fi
    
    # Shared packages
    echo "   📚 Shared Packages:"
    for package in auth config database layouts tokens types ui utils-contact; do
        if [ -d "$ROOT_DIR/packages/$package" ]; then
            if check_package_health "$package" "$ROOT_DIR/packages/$package"; then
                echo "      ✅ $package"
            else
                echo "      ❌ $package"
            fi
        fi
    done
}

# Function to show service status
show_service_status() {
    print_section "Service Status"
    
    # Backend API
    check_service_status "Backend API" 3001 "/api"
    
    # Frontend apps
    check_service_status "Admin Frontend" 3000 "/"
    check_service_status "Texting Frontend" 3000 "/"
    check_service_status "Web Frontend" 3000 "/"
}

# Function to show recommendations
show_recommendations() {
    print_section "Recommendations"
    
    cd "$ROOT_DIR"
    
    # Check if backend is running
    if ! lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "   🚀 Start backend: pnpm run dev:backend"
    fi
    
    # Check if frontend is running
    if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "   🌐 Start frontend: pnpm run dev:admin (or other apps)"
    fi
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo "   💾 Commit your changes: git add . && git commit -m 'message'"
    fi
    
    # Check for dependency issues
    if ! pnpm list --depth=0 >/dev/null 2>&1; then
        echo "   📦 Install dependencies: pnpm install"
    fi
    
    # Check for build issues
    if [ "$backend_healthy" = false ] || [ "$admin_healthy" = false ] || [ "$texting_healthy" = false ] || [ "$web_healthy" = false ]; then
        echo "   🔧 Fix build issues: pnpm run build"
    fi
}

# Function to show quick commands
show_quick_commands() {
    print_section "Quick Commands"
    
    echo "   🚀 Development:"
    echo "      pnpm run dev:all          # Start all services"
    echo "      pnpm run dev:backend      # Start backend only"
    echo "      pnpm run dev:admin        # Start admin app only"
    echo
    echo "   🧪 Testing:"
    echo "      pnpm run test             # Run all tests"
    echo "      pnpm run test:backend     # Run backend tests"
    echo "      pnpm run test:coverage    # Run tests with coverage"
    echo
    echo "   🔍 Quality:"
    echo "      pnpm run lint             # Run linting"
    echo "      pnpm run typecheck        # Run type checking"
    echo "      pnpm run validate         # Run full validation"
    echo
    echo "   🧹 Maintenance:"
    echo "      pnpm run clean            # Clean all packages"
    echo "      pnpm run cleanup          # Clean and rebuild"
    echo "      pnpm install              # Install dependencies"
}

# Main function
main() {
    print_header
    
    # Store health status for recommendations
    backend_healthy=false
    admin_healthy=false
    texting_healthy=false
    web_healthy=false
    
    show_dev_environment
    echo
    
    show_package_status
    echo
    
    show_service_status
    echo
    
    show_dependencies
    echo
    
    show_git_status
    echo
    
    show_recommendations
    echo
    
    show_quick_commands
    echo
    
    echo -e "${GREEN}🎉 Status check complete!${NC}"
}

# Run main function
main "$@"
