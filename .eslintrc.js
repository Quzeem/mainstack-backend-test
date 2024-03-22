module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  ignorePatterns: ['.eslintrc.js'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/method-signature-style': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
  },
};
