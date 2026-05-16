import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: ["**/prototype/**", ".next/**", "node_modules/**", "next-env.d.ts"] },
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      // hydration / 从 localStorage 读初始值的 useEffect 必须 setState，关掉这条 v7 新规则避免误报
      "react-hooks/set-state-in-effect": "off",
    },
  }
);
