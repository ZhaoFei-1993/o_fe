module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": ["standard"],
  "plugins": [
    "html"
  ],
  "env": {
    "browser": true,
    "node": true
  },
  "globals": {
    "ga": true
  },
  "rules": {
    "space-before-function-paren": [
      2,
      {
        anonymous: 'always',
        named: 'never'
      }
    ],
    "comma-dangle": [0],       // todo: 详细看下dangle
    "no-multi-spaces": [0]      // todo: 看一下如何允许注释的格式化前面的空格
  }

  // backup: {
  //   root: true,
  //   parser: 'babel-eslint',
  //   parserOptions: {
  //     sourceType: 'module'
  //   },
  //   env: {
  //     browser: true,
  //     node: true,
  //     'jest/globals': true
  //   },
  //   extends: [
  //     'standard',
  //     'standard-jsx',
  //     'plugin:import/errors',
  //     'plugin:import/warnings'
  //   ],
  //   plugins: [
  //     'html',
  //     'jest'
  //   ],
  //   settings: {
  //     'import/resolver': {
  //       node: { extensions: ['.js', '.mjs'] }
  //     }
  //   },
  //   rules: {
  //     // Enforce import order
  //     'import/order': 2,
  //
  //     // Imports should come first
  //     'import/first': 2,
  //
  //     // Other import rules
  //     "import/no-mutable-exports": 2,
  //
  //     // Allow unresolved imports
  //     'import/no-unresolved': 0,
  //
  //     // Allow paren-less arrow functions
  //     'arrow-parens': 0,
  //
  //     // Allow async-await
  //     'generator-star-spacing': 0,
  //
  //     // Allow debugger during development
  //     'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  //
  //     // Do not allow console.logs etc...
  //     'no-console': 2,
  //     'space-before-function-paren': [
  //       2,
  //       {
  //         anonymous: 'always',
  //         named: 'never'
  //       }
  //     ],
  //   },
  //
  //   globals: {}
  // }
}
