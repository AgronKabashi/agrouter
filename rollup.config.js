import buble from "rollup-plugin-buble";

const packageJson = require("./package.json");

export default {
  input: "src/index.js",
  context: "this",
  output: {
    format: "cjs",
    file: packageJson.main
  },
  plugins: [
    buble()
  ]
};
