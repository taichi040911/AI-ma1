// ESLint flat config (ESLint v9+)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.expo/**",
      "**/coverage/**",
      "**/*.d.ts"
    ]
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  },

  {
    files: ["apps/mobile/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: ["../*", "../../*"]
        }
      ]
    }
  },

  {
    files: ["apps/admin/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: ["../*", "../../*"]
        }
      ]
    }
  },

  {
    files: ["apps/api/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-process-exit": "error"
    }
  },

  {
    files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-console": "off"
    }
  }
];
