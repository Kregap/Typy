const js = require("@eslint/js");
const nodePlugin = require("eslint-plugin-node");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "*.min.js",
      "*.min.css",
      "package-lock.json",
      ".git/**"
    ]
  },
  js.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        // Electron main process globals
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        // Browser globals for renderer process
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        // Electron-specific globals
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        global: "readonly"
      }
    },
    plugins: {
      node: nodePlugin,
      prettier: prettier
    },
    rules: {
      // General JavaScript rules
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
      "no-undef": "error",

      // Node.js specific rules
      "node/no-missing-import": "off", // Allow require() in Electron
      "node/no-unsupported-features/es-syntax": "off", // Allow ES modules

      // Prettier integration
      "prettier/prettier": "error",

      // Code style (handled by Prettier)
      "no-trailing-spaces": "error",
      "eol-last": "error"
    }
  },
  {
    files: ["src/main/**/*.js"],
    languageOptions: {
      globals: {
        // Electron main process specific globals
        app: "readonly",
        BrowserWindow: "readonly",
        ipcMain: "readonly",
        dialog: "readonly",
        shell: "readonly"
      }
    }
  },
  {
    files: ["src/renderer/**/*.js"],
    languageOptions: {
      globals: {
        // Renderer process specific globals
        marked: "readonly",
        electronAPI: "readonly",
        // Additional globals used in editor.js
        window: "readonly",
        document: "readonly",
        setTimeout: "readonly"
      }
    }
  }
];
