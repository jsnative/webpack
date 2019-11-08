module.exports = {
    parser: "babel-eslint",
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: "eslint:recommended",
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        Bus: "readonly",
        Native: "readonly"
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
    },
    rules: {
        "no-redeclare": 0,
        "babel/semi": 0,
        "no-console": 0,
        "no-var": 1,
        "semi": 2,
        "no-dupe-keys": 2,
        "no-extra-semi": 2,
        "max-len": [2, 100],
        "no-const-assign": 2,
        "no-dupe-class-members": 2,
        "no-duplicate-imports": 2,
        "prefer-const": 2,
        "func-style": [2, "expression", { "allowArrowFunctions": true }],
        "quotes": [1, "single", { "allowTemplateLiterals": true, "avoidEscape": true }]
    },
    "plugins": [
        "babel"
    ]
}