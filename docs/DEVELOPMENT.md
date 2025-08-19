# Development Guide

This document outlines the development setup, tools, and best practices for the Typy Electron project.

## 🛠️ Development Tools

### Linting & Formatting

The project uses industry-standard tools to maintain code quality and consistency:

#### **ESLint** - JavaScript/Node.js Linting

- **Purpose**: Catches bugs, enforces consistent code style, identifies unused variables and imports
- **Configuration**: `eslint.config.js` in root directory (modern flat config format)
- **Features**:
  - Electron-specific configurations for main and renderer processes
  - Prettier integration to avoid conflicts
  - Custom rules for unused variables and code quality
  - Proper globals configuration for Electron APIs

#### **Prettier** - Code Formatting

- **Purpose**: Automatic code formatting for consistent style across the project
- **Configuration**: `.prettierrc`
- **Features**:
  - Works seamlessly with ESLint
  - Consistent formatting across all JavaScript files
  - Configurable formatting rules

## 📁 Project Structure

The project follows a clean, organized structure:

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
├── eslint.config.js       # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .prettierignore        # Prettier ignore rules
├── .gitattributes         # Line ending configuration
├── .husky/                # Git hooks (pre-commit)
└── dist/                  # Build output
```

## 📁 Configuration Files

### `eslint.config.js`

Modern ESLint flat configuration with:

- Electron-specific globals for main and renderer processes
- Prettier integration to avoid formatting conflicts
- Custom rules for code quality
- File-specific configurations for different parts of the app

### `.prettierrc`

Prettier configuration with:

- Double quotes for strings
- Semicolons enabled
- 2-space indentation
- 80-character line width
- No trailing commas
- Auto line ending detection

### `.prettierignore`

Specifies files to exclude from formatting:

- `node_modules/`
- `dist/` and `build/` directories
- Minified files (`*.min.js`, `*.min.css`)
- Package lock files
- `.git/`, `.github/`, `.husky/` directories

### `package.json` Updates

Added development scripts:

- `lint`: Check for linting issues
- `lint:fix`: Fix linting issues automatically
- `format`: Format all code with Prettier
- `format:check`: Check if code is properly formatted
- `check`: Run both lint and format checks
- `prepare`: Automatically installs Husky git hooks

## 🚀 Available Scripts

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

## 🔧 Git Hooks & Quality Assurance

### Pre-commit Hooks

This project uses **Husky** to automatically run quality checks before each commit:

- **Automatic Setup**: Hooks are installed when you run `npm install`
- **Pre-commit**: Runs `npm run check` to ensure code quality
- **Bypass**: Use `git commit --no-verify` if needed (not recommended)

### Line Ending Configuration

Consistent line endings across all platforms:

- **`.gitattributes`**: Ensures proper line ending handling
- **Prettier**: Configured with `"endOfLine": "auto"`
- **CI**: Automatically normalizes line endings during build
- **Cross-platform**: Works on Windows, macOS, and Linux

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

The project uses a streamlined CI/CD pipeline (`.github/workflows/build.yml`):

1. **Checkout**: Downloads source code
2. **Setup Node.js**: Installs Node.js with caching
3. **Install Dependencies**: Installs npm packages
4. **Normalize Line Endings**: Ensures consistent line endings
5. **Quality Checks**: Runs linting and formatting checks
6. **Package Application**: Creates Windows distributable
7. **Upload Artifacts**: Saves build for download

### Build Artifacts

- **Platform**: Windows only (optimized for target platform)
- **Output**: `dist/Typy-win32-x64/` directory
- **Artifact**: Available for download from GitHub Actions
- **Retention**: 7 days

## 🎯 Why These Tools Are Worth It

### **1. Catches Bugs Early**

- ESLint identifies potential issues before they become problems
- Finds unused variables, imports, and common mistakes
- Prevents runtime errors through static analysis

### **2. Consistent Code Style**

- Prettier ensures uniform formatting across your team
- No more debates about code formatting
- Professional, readable codebase

### **3. Better Code Quality**

- Enforces best practices and modern JavaScript patterns
- Maintains high code standards
- Improves maintainability

### **4. Team Collaboration**

- Everyone writes code in the same style
- Reduces merge conflicts
- Easier code reviews

### **5. Professional Standards**

- Industry-standard tools used by major projects
- Demonstrates commitment to code quality
- Makes the project more attractive to contributors

## 🔧 How to Use

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

### Pre-commit Hooks

Consider adding these checks to your Git hooks for automatic validation:

```bash
# In .git/hooks/pre-commit
npm run check
```

### GitHub Actions

The project includes automated CI/CD workflows that run on every PR and push to master:

#### **Quality Checks** (`.github/workflows/ci.yml`)

- Runs linting and formatting checks
- Ensures code quality standards are met
- Fails PRs that don't meet quality requirements

#### **Build and Test** (`.github/workflows/build.yml`)

- Runs quality checks first
- Builds the Electron app on multiple platforms
- Creates build artifacts for Windows
- Tests the application startup

#### **Status Badge**

Add this to your README to show CI status:

```markdown
[![CI](https://github.com/yourusername/typy/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/typy/actions/workflows/ci.yml)
```

**Note**: Replace `yourusername` with your actual GitHub username.

#### **Recommended Branch Protection Rules**

For maximum code quality, consider setting up branch protection rules in GitHub:

1. **Require status checks to pass before merging**
   - Enable "Require status checks to pass before merging"
   - Select the CI workflow as a required status check

2. **Require branches to be up to date**
   - Enable "Require branches to be up to date before merging"

3. **Require pull request reviews**
   - Enable "Require pull request reviews before merging"
   - Set minimum number of approving reviews (recommended: 1)

4. **Dismiss stale reviews**
   - Enable "Dismiss stale pull request approvals when new commits are pushed"

## 📋 Best Practices

### Code Style

- Use single quotes for strings
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

```
The ".eslintignore" file is no longer supported
```

- Solution: The new flat config format uses the `ignores` property in `eslint.config.js`

**Prettier Conflicts**

- Solution: ESLint and Prettier are configured to work together
- Use `eslint-config-prettier` to disable conflicting rules

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

---

This setup ensures your Electron project maintains professional code quality standards and provides a smooth development experience for all contributors.
