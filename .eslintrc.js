module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["sonarjs", "functional"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:sonarjs/recommended",
    "plugin:functional/recommended",
  ],
  rules: {
    "import/semi": ["error", "never"],
    "no-unused-vars": 0,
    "arrow-parens": [1, "as-needed"],
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/member-delimiter-style": [0, "none"],
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/no-unused-vars": [
      2,
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false,
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": 1,
    "@typescript-eslint/no-namespace": [2, { allowDeclarations: true }],
    "functional/functional-parameters": 0,
    "functional/no-return-void": 0,
    "functional/no-conditional-statement": [
      2,
      { allowReturningBranches: true },
    ],
    "functional/no-expression-statement": 0,
    "functional/no-mixed-type": 0,
    "functional/immutable-data": [
      2,
      { ignoreAccessorPattern: ["**.mutable", "**.current", "**.value"] },
    ],
    "functional/prefer-readonly-type": 2,
    "sonarjs/no-duplicate-string": 0,
    "object-property-newline": "warn",
  },
};
