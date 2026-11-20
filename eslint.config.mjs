import eslint from "@eslint/js";
import astro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist/", ".astro/", ".vercel/"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["scripts/**", "tests/**"],
    languageOptions: { globals: { console: "readonly", process: "readonly", fetch: "readonly", URL: "readonly" } },
  },
);
