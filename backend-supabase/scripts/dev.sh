#!/bin/bash

# PercyTech Monorepo Development Script
# This script manages development workflows across all packages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command_exists pnpm; then
        print_error "pnpm is not installed"
        exit 1
    fi
    
    if ! command_exists git; then
        print_error "Git is not installed"
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Function to install dependencies
install_deps() {
    print_status "Installing dependencies..."
    cd "$ROOT_DIR"
    pnpm install
    print_success "Dependencies installed"
}

# Function to start development servers
start_dev() {
    local target="${1:-all}"
    
    case $target in
        "backend")
            print_status "Starting backend development server..."
            cd "$ROOT_DIR/backend"
            pnpm run start:dev
            ;;
        "admin")
            print_status "Starting admin development server..."
            pnpm run dev:admin
            ;;
        "texting")
            print_status "Starting texting development server..."
            pnpm run dev:texting
            ;;
        "web")
            print_status "Starting web development server..."
            pnpm run dev:web
            ;;
        "all")
            print_status "Starting all development servers..."
            pnpm run dev:all
            ;;
        *)
            print_error "Unknown target: $target"
            print_status "Available targets: backend, admin, texting, web, all"
            exit 1
            ;;
    esac
}

# Function to run tests
run_tests() {
    local target="${1:-all}"
    
    case $target in
        "backend")
            print_status "Running backend tests..."
            cd "$ROOT_DIR/backend"
            pnpm run test
            ;;
        "unit")
            print_status "Running unit tests..."
            pnpm run test:unit
            ;;
        "coverage")
            print_status "Running tests with coverage..."
            pnpm run test:coverage
            ;;
        "all")
            print_status "Running all tests..."
            pnpm run test
            ;;
        *)
            print_error "Unknown test target: $target"
            print_status "Available test targets: backend, unit, coverage, all"
            exit 1
            ;;
    esac
}

# Function to run linting
run_lint() {
    local target="${1:-all}"
    
    case $target in
        "backend")
            print_status "Running backend linting..."
            cd "$ROOT_DIR/backend"
            pnpm run lint
            ;;
        "fix")
            print_status "Running linting with auto-fix..."
            pnpm run lint
            ;;
        "all")
            print_status "Running all linting..."
            pnpm run lint
            ;;
        *)
            print_error "Unknown lint target: $target"
            print_status "Available lint targets: backend, fix, all"
            exit 1
            ;;
    esac
}

# Function to run type checking
run_typecheck() {
    local target="${1:-all}"
    
    case $target in
        "backend")
            print_status "Running backend type checking..."
            cd "$ROOT_DIR/backend"
            pnpm run typecheck
            ;;
        "all")
            print_status "Running all type checking..."
            pnpm run typecheck
            ;;
        *)
            print_error "Unknown typecheck target: $target"
            print_status "Available typecheck targets: backend, all"
            exit 1
            ;;
    esac
}

# Function to build packages
build_packages() {
    local target="${1:-all}"
    
    case $target in
        "backend")
            print_status "Building backend..."
            cd "$ROOT_DIR/backend"
            pnpm run build
            ;;
        "all")
            print_status "Building all packages..."
            pnpm run build
            ;;
        *)
            print_error "Unknown build target: $target"
            print_status "Available build targets: backend, all"
            exit 1
            ;;
    esac
}

# Function to clean packages
clean_packages() {
    print_status "Cleaning packages..."
    pnpm run clean
    print_success "Packages cleaned"
}

# Function to validate everything
validate_all() {
    print_status "Running full validation..."
    
    print_status "1. Linting..."
    pnpm run lint
    
    print_status "2. Type checking..."
    pnpm run typecheck
    
    print_status "3. Building..."
    pnpm run build
    
    print_status "4. Testing..."
    pnpm run test
    
    print_success "Full validation completed successfully!"
}

# Function to show status
show_status() {
    print_status "Checking development environment status..."
    
    echo
    echo "📦 Package Status:"
    echo "   Backend: $(cd "$ROOT_DIR/backend" && pnpm run build >/dev/null 2>&1 && echo "✅ Ready" || echo "❌ Issues")"
    
    echo
    echo "🔧 Development Commands:"
    echo "   $0 dev [target]     - Start development servers"
    echo "   $0 test [target]    - Run tests"
    echo "   $0 lint [target]    - Run linting"
    echo "   $0 typecheck [target] - Run type checking"
    echo "   $0 build [target]   - Build packages"
    echo "   $0 validate         - Run full validation"
    echo "   $0 clean            - Clean packages"
    echo "   $0 status           - Show this status"
    
    echo
    echo "🎯 Available Targets:"
    echo "   backend, database, all"
}

# Function to show help
show_help() {
    echo "PercyTech Monorepo Development Script"
    echo
    echo "Usage: $0 [COMMAND] [TARGET]"
    echo
    echo "Commands:"
    echo "  dev [target]     Start development servers"
    echo "  test [target]    Run tests"
    echo "  lint [target]    Run linting"
    echo "  typecheck [target] Run type checking"
    echo "  build [target]   Build packages"
    echo "  validate         Run full validation"
    echo "  clean            Clean packages"
    echo "  status           Show development status"
    echo "  help             Show this help message"
    echo
    echo "Targets:"
    echo "  backend          Backend NestJS server"
    echo "  database         Database utilities"
    echo "  all              All packages (default)"
    echo
    echo "Examples:"
    echo "  $0 dev backend   # Start only backend"
    echo "  $0 test database # Test only database utilities"
    echo "  $0 validate      # Run full validation"
}

# Main script logic
main() {
    local command="${1:-help}"
    local target="${2:-all}"
    
    # Change to root directory
    cd "$ROOT_DIR"
    
    case $command in
        "dev")
            check_prerequisites
            start_dev "$target"
            ;;
        "test")
            check_prerequisites
            run_tests "$target"
            ;;
        "lint")
            check_prerequisites
            run_lint "$target"
            ;;
        "typecheck")
            check_prerequisites
            run_typecheck "$target"
            ;;
        "build")
            check_prerequisites
            build_packages "$target"
            ;;
        "validate")
            check_prerequisites
            validate_all
            ;;
        "clean")
            clean_packages
            ;;
        "status")
            show_status
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
