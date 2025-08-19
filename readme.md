# Typy

A minimal Markdown editor for Windows built with Electron.

[![CI](https://github.com/kregap/typy/actions/workflows/build.yml/badge.svg)](https://github.com/kregap/typy/actions/workflows/build.yml)

## Quick Start

```bash
npm install
npm start
```

## Demo

See Typy in action with these demo videos:

### Demo 1 - Basic Usage

https://github.com/user-attachments/assets/54a9bf71-180c-4c71-9fbf-3259a37c4f1b

### Demo 2 - Advanced Features

https://github.com/user-attachments/assets/a1c683cb-3dd0-4806-80bd-c475f3ffad0a

## Project Structure

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

## Development

This project uses modern development tools:

- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit quality checks
- **Electron** - Cross-platform desktop app framework

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

### Pre-commit Hooks

This project uses Husky to automatically run quality checks before each commit:

- **Pre-commit**: Runs `npm run check` to ensure code quality
- **Automatic Setup**: Hooks are installed automatically when you run `npm install`

If you need to bypass the pre-commit hook (not recommended), use:

```bash
git commit --no-verify -m "your message"
```

### Line Endings

This project uses consistent line endings across all platforms:

- **Configuration**: `.gitattributes` file ensures proper line ending handling
- **Prettier**: Configured with `"endOfLine": "auto"` to respect platform defaults
- **CI**: Automatically normalizes line endings during build

This prevents issues with CRLF/LF differences between Windows, macOS, and Linux.

For detailed development setup, tools, and best practices, see [DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Packaging

### How to package Typy as a standalone Windows app

1. Open a terminal in the project directory.
2. Run the following command:

   ```powershell
   npx electron-packager . Typy --platform=win32 --arch=x64 --out=dist --overwrite
   ```

3. The packaged app will be in the `dist/Typy-win32-x64` folder. Run or distribute `Typy.exe` from there.

**Notes:**

- Make sure you have run `npm install` before packaging.
- You can create a zip from the build with `powershell Compress-Archive -Path dist\Typy-win32-x64\* -DestinationPath dist\Typy-win32-x64.zip -Force`.
- You can customize the icon and other options using electron-packager flags. See the [electron-packager documentation](https://github.com/electron/electron-packager) for more details.
