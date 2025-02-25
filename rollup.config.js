import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "index.ts",
    output: {
      file: "dist/bundle.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), typescript(), terser()],
  },
  {
    input: "index.ts",
    output: {
      file: "dist/bundle.mjs",
      format: "es",
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), typescript(), terser()],
  },
  {
    input: "index.ts",
    output: {
      file: "dist/bundle.iife.js",
      format: "iife",
      name: "DropzoneFileParser",
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), typescript(), terser()],
  },
];