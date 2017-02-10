module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "globals": {
      "process": true,
      "__dirname": true,
      "describe": true,
      "beforeEach": true,
      "afterEach": true,
      "it": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "off",
            2
        ],
        "semi": [
            "off"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "off",
            "single"
        ],

        "no-unused-vars":0,
        "no-console":0
    }
};
