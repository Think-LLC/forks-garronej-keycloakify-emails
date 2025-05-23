import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import { buildEmailTheme } from "keycloakify-emails";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      themeName: ["vanilla", "chocolate"],
      accountThemeImplementation: "none",
      postBuild: async (buildContext) => {
        const { config: loadConfig } = await import("./jsx-email.config.js");

        const config = await loadConfig;

        await buildEmailTheme({
          templatesSrcDirPath: import.meta.dirname + "/src/email/templates",
          i18nSourceFile: import.meta.dirname + "/src/email/i18n.ts",
          themeNames: buildContext.themeNames,
          keycloakifyBuildDirPath: buildContext.keycloakifyBuildDirPath,
          locales: ["en", "pl"],
          esbuild: config.esbuild,
          cwd: import.meta.dirname,
        });
      },
    }),
  ],
});
