module.exports.noRestrictedSyntaxRules = {
    'no-restricted-syntax': [
      'error',
      {
        selector: "TSNonNullExpression>CallExpression[callee.property.name='getAttribute']",
        message: "Please check for null or use  `|| ''` instead of `!` when calling `getAttribute`",
      },
      {
        selector: 'MemberExpression[object.name=/^e/][property.name=/^(key(?:Code)?|which|(meta|ctrl|alt)Key)$/]',
        message: 'Please use `data-hotkey` instead of manual shortcut logic',
      },
      {
        selector: "NewExpression[callee.name='URL'][arguments.length=1]",
        message: 'Please pass in `window.location.origin` as the 2nd argument to `new URL()`',
      },
      {
        selector: "CallExpression[callee.name='unsafeHTML']",
        message: 'Use unsafeHTML sparingly. Please add an eslint-disable comment if you want to use this',
      },
    ],
  }
  
  module.exports.noRestrictedImportsRule = {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@github/jtml',
            message: 'Use the shimmed version of jtml instead. See @github-ui/jtml-shimmed',
          },
        ],
        patterns: [
          {
            group: ['**/behaviors/**', '**/github/**', '**/marketing/**'],
            message:
              'Please do not import legacy modules into React code as they are not guaranteed to work in SSR. See https://thehub.github.com/epd/engineering/dev-practicals/frontend/react/ssr/ssr-tools/#how-to-fix-no-restricted-imports-errors',
          },
          {
            group: ['*.server'],
            message:
              'Please do not import server modules directly. These will be swapped in during compilation of the alloy bundle. See https://thehub.github.com/epd/engineering/dev-practicals/frontend/react/ssr/ssr-tools/#server-aliases',
          },
          {
            group: [
              '**/hyperlist-web/**',
              '**/inbox/**',
              '**/blackbird-monolith/**',
              '**/repositories/**',
              '**/orgs-insights/**',
              '**/pull-requests/**',
              '**/react-code-view/**',
              '**/repo-creation/**',
              '**/secret-scanning/**',
              '**/settings/notifications/**',
              '**/settings/rules/**',
              '**/virtual-network-settings/**',
            ],
            message: 'Please do not import react apps modules in react-shared',
          },
          {
            group: ['**/ui/packages/**'],
            message:
              'Please do not import packages directly. Instead install the package in your workspace as a dependency and import from `@github/<package-name>`',
          },
          {
            group: ['**/use-hydrated-effect'],
            message:
              'Prefer `useClientValue` from `@github-ui/use-client-value` or `useLayoutEffect` from React. This hook exists to support an optimization to avoid unnecessary re-paints after hydration and should not be used to measure DOM elements or other browser-only values.',
          },
          {
            group: ['**/use-render-phase'],
            importNames: ['useRenderPhase'],
            message:
              "Please use `useClientValue` instead. You can think of `useRenderPhase` as 'environment sniffing' vs `useClientValue`'s 'feature detection' approach.",
          },
        ],
      },
    ],
  }
  
  module.exports.baseConfig = {
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
      'compat',
      'delegated-events',
      'filenames',
      'i18n-text',
      'escompat',
      'import',
      'github',
      'custom-elements',
      'jsx-a11y',
      'ssr-friendly',
      'testing-library',
      'relay',
      '@github-ui/github-monorepo',
      '@github-ui/github-components',
    ],
    extends: [
      'plugin:github/internal',
      'plugin:github/recommended',
      'plugin:github/browser',
      'plugin:escompat/typescript',
      'plugin:github/typescript',
      'plugin:import/typescript',
      'plugin:custom-elements/recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:primer-react/recommended',
      'plugin:jsx-a11y/recommended',
    ],
    parserOptions: {
      project: ['tsconfig.json'],
    },
    ignorePatterns: ['*__generated__*'],
    rules: {
      'import/no-unresolved': ['error', {ignore: ['^plugin:.*']}],
      'custom-elements/extends-correct-class': 'off',
      'custom-elements/one-element-per-file': 'off',
      'custom-elements/define-tag-after-class-definition': 'off',
      'custom-elements/expose-class-on-global': 'off',
      'custom-elements/tag-name-matches-class': ['error', {suffix: ['Element']}],
      'custom-elements/file-name-matches-element': 'off',
      'compat/compat': ['error'],
      'delegated-events/global-on': ['error'],
      'delegated-events/no-high-freq': ['error'],
      'escompat/no-dynamic-imports': 'off',
      'escompat/no-nullish-coalescing': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {varsIgnorePattern: '^[A-Z][a-zA-Z]+(Controller|Element)$'}],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'valid-typeof': ['error', {requireStringLiterals: true}],
      'github/no-inner-html': 'off',
      '@github-ui/github-monorepo/restrict-package-deep-imports': 'error',
      '@github-ui/github-components/require-component-stories': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MemberExpression[object.name=/^e/][property.name=/^(key(?:Code)?|which|(meta|ctrl|alt)Key)$/]',
          message:
            'Please use `data-hotkey` instead of manual shortcut logic. See https://thehub.github.com/engineering/development-and-ops/frontend-and-ui/keyboard-shortcuts',
        },
        {
          selector: "NewExpression[callee.name='URL'][arguments.length=1]",
          message: 'Please pass in `window.location.origin` as the 2nd argument to `new URL()`',
        },
        {
          selector: "CallExpression[callee.name='unsafeHTML']",
          message: 'Use unsafeHTML sparingly. Please add an eslint-disable comment if you want to use this',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@github/selector-observer',
              message:
                'Use a Catalyst component instead of observing an element. See https://thehub.github.com/epd/engineering/dev-practicals/frontend/client-side-behaviors-with-catalyst/',
            },
            {
              name: 'delegated-events',
              message:
                "Use a Catalyst component instead of listening to an element's events. See https://thehub.github.com/epd/engineering/dev-practicals/frontend/client-side-behaviors-with-catalyst/",
            },
            {
              name: '@github/jtml',
              message: 'Use the shimmed version of jtml instead. See @github-ui/jtml-shimmed',
            },
          ],
          patterns: [
            {
              group: ['*.server'],
              message:
                'Please do not import server modules directly. These will be swapped in during compilation. See https://thehub.github.com/epd/engineering/dev-practicals/frontend/react/ssr/',
            },
          ],
        },
      ],
      'primer-react/no-deprecated-colors': ['error', {skipImportCheck: true}],
      'primer-react/no-system-props': ['error', {includeUtilityComponents: true}],
      'react/no-danger': ['error'],
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'react/jsx-no-constructed-context-values': ['error'],
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: 'useHydratedEffect',
        },
      ],
    },
    settings: {
      polyfills: ['Request', 'window.customElements', 'window.requestIdleCallback'],
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'app/assets/modules'],
        },
        typescript: true,
      },
      react: {
        version: 'detect',
      },
    },
    overrides: [
      {
        files: ['*.ts?(x)'],
        rules: {
          '@typescript-eslint/no-unnecessary-type-assertion': 'error',
          '@typescript-eslint/no-confusing-non-null-assertion': 'error',
          '@typescript-eslint/no-extra-non-null-assertion': 'error',
          '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
          '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
  
          // recommended by typescript-eslint as the typechecker handles these out of the box
          // https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting/#eslint-plugin-import
          'import/named': 'off',
          'import/namespace': 'off',
          'import/default': 'off',
          'import/no-named-as-default-member': 'off',
  
          // muting an expensive rule that scans jsdoc comments looking for @deprecated notes
          'import/no-deprecated': 'off',
        },
      },
      {
        files: ['*.json'],
        rules: {
          'filenames/match-regex': 'off',
        },
        parserOptions: {
          project: null,
        },
      },
      {
        files: ['package.json'],
        extends: ['plugin:@github-ui/github-monorepo/package-json'],
        parserOptions: {
          project: null,
        },
      },
      {
        files: ['*.d.ts'],
        rules: {
          '@typescript-eslint/no-unused-vars': 'off',
          'no-var': 'off',
        },
      },
      {
        files: ['**/__tests__/**/*.tsx', '**/__tests__/**/*.ts'],
        extends: ['plugin:testing-library/react'],
        rules: {
          'i18n-text/no-en': 'off',
          'github/unescaped-html-literal': 'off',
          'filenames/match-regex': [2, '^[a-zA-Z-]+\\.test$'],
          'react/jsx-no-constructed-context-values': 'off',
          '@typescript-eslint/no-non-null-assertion': ['off'],
        },
      },
      {
        files: ['**/components/**/*.tsx'],
        rules: {
          '@github-ui/github-components/require-component-stories': 'error',
        },
      },
      {
        files: ['**/__tests__/**/*.tsx', '**/*.stories.tsx'],
        rules: {
          '@github-ui/github-components/require-component-stories': 'off',
        },
      },
      {
        files: ['*.config.js', '*.config.mjs', 'test/linting/*.js', 'janky-reporter.mjs', 'janky-formatter.js'],
        extends: ['plugin:github/internal', 'plugin:escompat/typescript'],
        parser: 'espree',
        env: {
          node: true,
          browser: false,
        },
        globals: {
          process: true,
          __dirname: true,
        },
        rules: {
          '@typescript-eslint/no-var-requires': 'off',
          'escompat/no-object-rest-spread': 'off',
          'escompat/no-optional-catch': 'off',
          'i18n-text/no-en': 'off',
          'import/no-commonjs': 'off',
          'import/no-nodejs-modules': 'off',
          'no-console': 'off',
        },
      },
      {
        files: ['eslintrc.js', '.eslintrc.js'],
        parserOptions: {
          project: null,
        },
        env: {
          node: true,
          browser: false,
        },
        rules: {
          'filenames/match-regex': ['off'],
          'import/no-commonjs': ['off'],
        },
      },
    ],
  }
  