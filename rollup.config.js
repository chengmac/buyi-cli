const copy = require("rollup-plugin-copy");

module.exports = {
  input: {
    "react-cli": "src/react-cli.js",
    init: "src/init.js",
  },
  output: {
    dir: "bin",
    format: "cjs",
  },
  plugins: [
    copy({
      targets: [
        {
          src: "src/templates/*",
          dest: "bin/templates",
        },
      ],
    }),
  ],
};
