# Development Guide

This document outlines the development setup, tools, and best practices for the Typy Electron project.

## 🚀 Quick Start

```bash
npm install
npm start
```

## 📁 Project Structure

```
Typy/
├── src/                    # Source code
│   ├── main/              # Main process files
│   │   ├── main.js        # Electron main process
│   │   └── preload.js     # Preload script
│   ├── renderer/          # Renderer process files
│   │   ├── index.html     # Main window HTML
│   │   ├── about.html     # About popup HTML
│   │   └── editor.js      # Editor functionality
│   └── assets/            # Static assets
│       ├── icon.svg       # SVG icon
│       ├── icon.ico       # Windows icon
│       └── sample.md      # Sample markdown
├── scripts/               # Build/utility scripts
│   └── svg-to-ico.ps1     # Icon conversion script
├── docs/                  # Documentation
│   └── DEVELOPMENT.md     # Development guide
├── .github/               # GitHub Actions files
│   └── workflows/         # CI/CD workflows
│       ├── build.yml      # Build and test workflow
│       └── release.yml    # Release workflow
├── eslint.config.js       # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .prettierignore        # Prettier ignore rules
├── .gitattributes         # Line ending configuration
├── .husky/                # Git hooks (pre-commit)
├── CHANGELOG.md           # Version history and changes
└── dist/                  # Build output
```

## 🛠️ Development Tools

### Available Scripts

```bash
# Linting
npm run lint          # Check for linting issues
npm run lint:fix      # Fix linting issues automatically

# Formatting
npm run format        # Format all code with Prettier
npm run format:check  # Check if code is properly formatted

# Combined checks
npm run check         # Run both lint and format checks
```

### Code Quality Tools

#### **ESLint** - JavaScript/Node.js Linting

- **Purpose**: Catches bugs, enforces consistent code style
- **Configuration**: `eslint.config.js` (modern flat config format)
- **Features**: Electron-specific configurations, Prettier integration

#### **Prettier** - Code Formatting

- **Purpose**: Automatic code formatting for consistent style
- **Configuration**: `.prettierrc`
- **Features**: Works seamlessly with ESLint, configurable rules

#### **Husky** - Git Hooks

- **Purpose**: Automatically run quality checks before commits
- **Setup**: Installed automatically with `npm install`
- **Pre-commit**: Runs `npm run check` to ensure code quality

### Configuration Files

- **`eslint.config.js`**: Modern ESLint flat configuration
- **`.prettierrc`**: Prettier settings (double quotes, semicolons, 2-space indentation)
- **`.prettierignore`**: Files to exclude from formatting
- **`.gitattributes`**: Line ending configuration for cross-platform compatibility

## 🔧 Development Workflow

### During Development

1. **Before Committing**: Run `npm run check` to ensure code quality
2. **Auto-fix Issues**: Use `npm run lint:fix` to automatically fix most problems
3. **Format Code**: Use `npm run format` to format all files
4. **Check Formatting**: Use `npm run format:check` to verify formatting

### IDE Integration

Most modern editors support ESLint and Prettier:

- **VS Code**: Install ESLint and Prettier extensions
- **WebStorm**: Built-in support for both tools
- **Vim/Neovim**: Use ALE or similar plugins

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

#### **Build and Test** (`.github/workflows/build.yml`)

- **Triggers**: Push to master branch, Pull requests to master
- **Purpose**: Quality assurance and build testing
- **Process**: Setup → Install → Quality checks → Package → Upload artifacts

#### **Automated Releases** (`.github/workflows/release.yml`)

- **Triggers**: Push of version tags (v\* pattern)
- **Purpose**: Automated release creation
- **Process**: Setup → Build → Create zip → Create GitHub release

### Build Artifacts

- **Platform**: Windows only
- **Output**: `dist/Typy-win32-x64/` directory
- **Zip File**: `dist/Typy-win32-x64.zip` (created during releases)
- **Retention**: 7 days

## 📦 Release Process

### Creating a Release

1. **Update CHANGELOG.md**:
   - Move items from `[Unreleased]` to a new version section
   - Add the release date and version number
   - Clear the `[Unreleased]` section

2. **Commit and push changes**:

   ```bash
   git add CHANGELOG.md
   git commit -m "Update changelog for v1.1.0"
   git push origin master
   ```

3. **Create and push version tag**:

   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

4. **The release workflow automatically**:
   - Builds the Electron app with electron-packager
   - Creates a zip file
   - Creates a GitHub release with structured notes template

5. **Update GitHub release notes**:
   - Edit the release description with specific details
   - Add information under template sections (New Features, Improvements, Bug Fixes)

## 📋 Best Practices

### Code Style

- Use double quotes for strings
- Always use semicolons
- Use 2-space indentation
- Keep lines under 80 characters
- Use meaningful variable names

### Linting Rules

- Unused variables must be prefixed with `_`
- Console statements are warnings (not errors)
- Prefer `const` over `let` when possible
- No `var` declarations

### Electron-Specific

- Main process files have access to Node.js globals
- Renderer process files have access to browser globals
- IPC communication is properly typed
- Security best practices are enforced

## 🐛 Troubleshooting

### Common Issues

**ESLint Ignore Warning**

- Solution: The new flat config format uses the `ignores` property in `eslint.config.js`

**Prettier Conflicts**

- Solution: ESLint and Prettier are configured to work together

**Unused Variable Errors**

- Solution: Prefix unused variables with `_` (e.g., `_event`)

### Updating Dependencies

```bash
npm update eslint prettier eslint-config-prettier eslint-plugin-prettier
```

## 📚 Additional Resources

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Electron Security Best Practices](https://www.electronjs.org/docs/tutorial/security)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)
