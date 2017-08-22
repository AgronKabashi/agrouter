import buble from "rollup-plugin-buble";

const packageJson = require("./package.json");

export default {
  entry: "src/index.js",
  context: "this",
  format: "cjs",
  dest: packageJson.main,
  plugins: [
    buble()
  ]
};
