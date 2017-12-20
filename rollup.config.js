import buble from "rollup-plugin-buble";
import uglify from "rollup-plugin-uglify";

const packageJson = require("./package.json");

export default {
  input: "src/index.js",
  context: "this",
  output: [
    {
      format: "cjs",
      file: packageJson.main
    }
  ],
  plugins: [
    buble(),
    uglify()
  ]
};
