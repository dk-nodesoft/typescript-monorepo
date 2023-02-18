/**
 * Custom config base for projects using typescript / javascript.
 * @see https://github.com/belgattitude/nextjs-monorepo-example/tree/main/packages/eslint-configs
 */

module.exports = {
  env: {
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      globalReturn: false
    },
    ecmaVersion: 2020,
    project: ['tsconfig.json'],
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  plugins: ['promise'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:promise/recommended'
  ],
  rules: {
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          markers: ['/'],
          exceptions: ['-', '+']
        },
        block: {
          markers: ['!'],
          exceptions: ['*'],
          balanced: true
        }
      }
    ],
    'linebreak-style': ['error', 'unix'],
    'no-empty-function': 'off',
    'no-return-await': 'error',
    'max-classes-per-file': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'warn',

    // import
    'import/default': 'off',
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off', // Default export is incorreged use named exports
    'import/no-unresolved': 'off', // Typescript reports this
    'import/namespace': 'off', // This does not make any sence (sorry)
    'import/no-cycle': 'warn',

    // @typescript-eslint
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/ban-tslint-comment': ['error'],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        minimumDescriptionLength: 10,
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': false
      }
    ],
    '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: false }],
    '@typescript-eslint/no-empty-function': ['error', { allow: ['private-constructors'] }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid'
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: ['function'],
        format: ['camelCase']
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'class',
        format: ['PascalCase']
      },
      {
        selector: 'classProperty',
        format: ['camelCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'enum',
        format: ['PascalCase', 'UPPER_CASE']
      },
      {
        selector: 'enumMember',
        format: ['PascalCase', 'UPPER_CASE', 'camelCase', 'snake_case']
      },

      {
        selector: 'objectLiteralProperty',
        format: [
          'camelCase',
          // Some external libraries use snake_case for params
          'snake_case',
          // Env variables are generally uppercase
          'UPPER_CASE',
          // DB / Graphql might use PascalCase for relationships
          'PascalCase'
        ],
        leadingUnderscore: 'allowSingleOrDouble',
        trailingUnderscore: 'allowSingleOrDouble',
        filter: {
          regex: '[0-9]+',
          match: false
        }
      },
      {
        selector: ['typeAlias', 'interface'],
        format: ['PascalCase']
      },
      {
        selector: ['typeProperty'],
        format: ['camelCase'],
        // For graphql __typename
        leadingUnderscore: 'allowSingleOrDouble'
      },
      {
        selector: ['typeParameter'],
        format: ['PascalCase']
      }
    ]
  },

  overrides: [
    {
      files: ['*.tsx', '*.jsx'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
          },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            leadingUnderscore: 'allow'
          },
          {
            selector: ['function'],
            format: ['camelCase', 'PascalCase']
          },
          {
            selector: 'parameter',
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'allow'
          },
          {
            selector: 'class',
            format: ['PascalCase']
          },
          {
            selector: 'classProperty',
            format: ['camelCase'],
            leadingUnderscore: 'allow'
          },
          {
            selector: 'enum',
            format: ['PascalCase', 'UPPER_CASE']
          },
          {
            selector: 'enumMember',
            format: ['PascalCase', 'UPPER_CASE', 'camelCase', 'snake_case']
          },

          {
            selector: 'objectLiteralProperty',
            format: [
              'camelCase',
              // Some external libraries use snake_case for params
              'snake_case',
              // Env variables are generally uppercase
              'UPPER_CASE',
              // DB / Graphql might use PascalCase for relationships
              'PascalCase'
            ],
            leadingUnderscore: 'allowSingleOrDouble',
            trailingUnderscore: 'allowSingleOrDouble',
            filter: {
              regex: '[0-9]+',
              match: false
            }
          },
          {
            selector: ['typeAlias', 'interface'],
            format: ['PascalCase']
          },
          {
            selector: ['typeProperty'],
            format: ['camelCase', 'PascalCase'],
            // For graphql __typename
            leadingUnderscore: 'allowSingleOrDouble'
          },
          {
            selector: ['typeParameter'],
            format: ['PascalCase']
          }
        ]
      }
    },

    {
      // commonjs or assumed
      files: ['*.js', '*.cjs'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020
      },
      rules: {
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/consistent-type-exports': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'import/order': 'off'
      }
    }
  ]
};
