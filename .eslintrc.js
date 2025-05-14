module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
