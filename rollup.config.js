import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

export default [
  // ES module build
  {
    input: "src/index.ts",
    output: {
      file: "dist/bundle.mjs",
      format: "esm",
    },
    plugins: [resolve(), commonjs(), typescript(), terser()],
  },
  // CommonJS build
  {
    input: "src/index.ts",
    output: {
      file: "dist/bundle.cjs.js",
      format: "cjs",
    },
    plugins: [resolve(), commonjs(), typescript(), terser()],
  },
  // Browser build (IIFE)
  {
    input: "src/index.ts",
    output: {
      file: "dist/bundle.iife.js",
      format: "iife",
      name: "DropzoneFileParser", // Global variable name for the browser
    },
    plugins: [resolve(), commonjs(), typescript(), terser()],
  },
];