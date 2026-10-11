import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import { solidStart } from "@solidjs/start/config";

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const resolveUriPath = require
  .resolve("@jridgewell/resolve-uri")
  .replace("resolve-uri.umd.js", "resolve-uri.mjs");

export default defineConfig({
  plugins: [
    tailwindcss(),
    solidStart(),
    nitro(),
  ],
  resolve: {
    alias: [
      {
        find: "@jridgewell/resolve-uri",
        replacement: resolveUriPath,
      },
    ],
  },
});



