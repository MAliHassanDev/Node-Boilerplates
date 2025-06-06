// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintNestJs from "@darraghor/eslint-plugin-nestjs-typed";

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  // eslintPluginPrettierRecommended,
   eslintNestJs.configs.flatRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["build/**", "**/*.mjs", "**/*.js", "**/*.config.ts"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/array-type": "off",
      "@darraghor/nestjs-typed/api-method-should-specify-api-response": "off",
    },
  },
 
);
