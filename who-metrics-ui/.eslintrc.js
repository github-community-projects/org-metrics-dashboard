// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const glob = require("glob");
// eslint-disable-next-line import/no-nodejs-modules, @typescript-eslint/no-var-requires
const { readFileSync } = require("fs");
// eslint-disable-next-line import/no-nodejs-modules, @typescript-eslint/no-var-requires
const { dirname, join } = require("path");

const noRestrictedSyntaxRules = {
  "no-restricted-syntax": [
    "error",
    {
      selector:
        "TSNonNullExpression>CallExpression[callee.property.name='getAttribute']",
      message:
        "Please check for null or use  `|| ''` instead of `!` when calling `getAttribute`",
    },
    {
      selector:
        "MemberExpression[object.name=/^e/][property.name=/^(key(?:Code)?|which|(meta|ctrl|alt)Key)$/]",
      message: "Please use `data-hotkey` instead of manual shortcut logic",
    },
    {
      selector: "NewExpression[callee.name='URL'][arguments.length=1]",
      message:
        "Please pass in `window.location.origin` as the 2nd argument to `new URL()`",
    },
    {
      selector: "CallExpression[callee.name='unsafeHTML']",
      message:
        "Use unsafeHTML sparingly. Please add an eslint-disable comment if you want to use this",
    },
  ],
};

const baseConfig = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "compat",
    "delegated-events",
    "filenames",
    "i18n-text",
    "escompat",
    "import",
    "github",
  ],
  extends: [
    "plugin:github/internal",
    "plugin:github/recommended",
    "plugin:github/browser",
    "plugin:escompat/typescript",
    "plugin:github/typescript",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:primer-react/recommended",
    "next",
  ],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["*__generated__*"],
  rules: {
    "compat/compat": ["error"],
    "delegated-events/global-on": ["error"],
    "delegated-events/no-high-freq": ["error"],
    "escompat/no-dynamic-imports": "off",
    "escompat/no-nullish-coalescing": "off",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "valid-typeof": ["error", { requireStringLiterals: true }],
    "github/no-inner-html": "off",
    "no-restricted-imports": ["error"],
    "primer-react/no-deprecated-colors": ["error", { skipImportCheck: true }],
    "primer-react/no-system-props": [
      "error",
      { includeUtilityComponents: true },
    ],
    "react/no-danger": ["error"],
    "react/self-closing-comp": [
      "error",
      {
        component: true,
        html: true,
      },
    ],
    "react/jsx-no-constructed-context-values": ["error"],
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "useHydratedEffect",
      },
    ],
  },
  settings: {
    polyfills: [
      "Request",
      "window.customElements",
      "window.requestIdleCallback",
    ],
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".tsx"],
        moduleDirectory: ["who-metrics-ui/src", "who-metrics-ui/node_modules"],
      },
      typescript: true,
    },
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.ts?(x)"],
      rules: {
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/no-confusing-non-null-assertion": "error",
        "@typescript-eslint/no-extra-non-null-assertion": "error",
        "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",

        // recommended by typescript-eslint as the typechecker handles these out of the box
        // https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting/#eslint-plugin-import
        "import/named": "off",
        "import/namespace": "off",
        "import/default": "off",
        "import/no-named-as-default-member": "off",

        // muting an expensive rule that scans jsdoc comments looking for @deprecated notes
        "import/no-deprecated": "off",
      },
    },
    {
      files: ["*.json"],
      rules: {
        "filenames/match-regex": "off",
      },
      parserOptions: {
        project: null,
      },
    },
    {
      files: ["*.d.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "no-var": "off",
      },
    },
    {
      files: ["eslintrc.js", ".eslintrc.js"],
      parserOptions: {
        project: null,
      },
      env: {
        node: true,
        browser: false,
      },
      rules: {
        "filenames/match-regex": ["off"],
        "import/no-commonjs": ["off"],
      },
    },
  ],
};

const findDevPackages = () => {
  const uiPackagesGlob = join(__dirname, "packages/*/package.json");
  const packages = glob.sync(uiPackagesGlob, {
    ignore: "node_modules/**",
    absolute: true,
  });

  return packages.reduce((acc, package) => {
    const pkg = JSON.parse(readFileSync(package));

    if (pkg.dev) acc.push(`${dirname(package)}/**/*.{mjs,js,ts,tsx}`);

    return acc;
  }, []);
};

module.exports = {
  ...baseConfig,
  root: true,
  rules: {
    ...baseConfig.rules,
    "eslint-comments/no-use": [
      "error",
      { allow: ["eslint-disable", "eslint-disable-next-line"] },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/__tests__/**/*.{ts,tsx}",
          "**/__browser-tests__/**/*.ts",
          "**/test-utils/**/*.{ts,tsx}",
          "**/*.stories.*",
          "**/jest.config.js",
          ...findDevPackages(),
        ],
      },
    ],
  },
  overrides: [
    ...baseConfig.overrides,
    {
      files: ["*.tsx"],
      excludedFiles: ["**/__tests__/**"],
      rules: {
        "i18n-text/no-en": "off",
        "filenames/match-regex": [2, "^[A-Z][a-zA-Z]+(.[a-z0-9-]+)?$"],
      },
    },
    {
      files: ["*.ts"],
      rules: noRestrictedSyntaxRules,
    },
  ],
};
