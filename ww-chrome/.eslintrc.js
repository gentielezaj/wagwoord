// https://eslint.org/docs/user-guide/configuring
// File taken from https://github.com/vuejs-templates/webpack/blob/1.3.1/template/.eslintrc.js, thanks.

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 9,
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    webextensions: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: ["error", "always", {
      "omitLastInOneLineBlock": true
    }],
    'no-new': 0,
    indent: 0,
    'keyword-spacing': 0,
    curly: 0,
    'space-before-function-paren': 0,
    eqeqeq: 0,
    quotes: 0,
    'eol-last': 0,
    'no-return-await': 0,
    "no-unneeded-ternary": 0,
    "new-cap": 0,
    "no-trailing-spaces": 0,
    "eslint-plugin-vue": 0
  }
}