import buble from "rollup-plugin-buble";

export default {
  entry: "src/index.js",
  context: "this",
  targets: [
    {
      format: "es",
      dest: "build/agrouter.es.js"
    },
    {
      format: "cjs",
      dest: "build/agrouter.min.js"
    }
  ],
  plugins: [
    buble()
  ]
};
