const jsdoc = require('eslint-plugin-jsdoc');

module.exports = [
  // configuration included in plugin
  //jsdoc.configs['flat/recommended'],
  {
  "languageOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  "plugins": {jsdoc: jsdoc},
  "rules": {
    "no-trailing-spaces": 2,
    "no-mixed-spaces-and-tabs": 2,
    "no-multi-spaces": 2,
    "no-tabs": 2,
    "no-extra-bind": 2,
    "eqeqeq": 2,
    "indent": [
      2,
      4,
      {
        "SwitchCase": 1
      }
    ],
    "semi-spacing": [
      2,
      {
        "before": false,
        "after": true
      }
    ],
    "semi": [
      2,
      "always"
    ],
    "comma-spacing": [
      2,
      {
        "after": true
      }
    ],
    "keyword-spacing": ["error", { "before": true }],
    "key-spacing": ["error", { "afterColon": true, "beforeColon": false }],
    "space-infix-ops": 2,
    "prefer-arrow-callback": 2,
    "jsdoc/require-return": "off",
    "jsdoc/require-returntype": "off",
    "object-curly-spacing": ["error", "never"],
    "no-console": 2,
    "no-dupe-args": 2,
    "no-dupe-keys": 2,
    "no-extra-semi": 2,
    "no-fallthrough": 2,
    "use-isnan": 2,
    "valid-typeof": 2,
    "no-var": 2
  }
},
{
  files: ["build-config/**/*.js"],
  rules: {
    "no-console": "off"
  }
},
{
  files: ["test-*.js", "*.spec.js", "test-helpers.js"],
  rules: {
    "no-console": "off",
    "require-jsdoc": "off"
  }
}
];
