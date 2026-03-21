import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: "jsdom",
			globals: true,
			pool: "threads", // or use 'forks' with alias
			alias: {
				"@exodus/bytes/encoding-lite.js": "@exodus/bytes/encoding-lite.js",
			},
			// Option A: Use dynamicImportedModules to handle ESM
			server: {
				deps: {
					inline: ["html-encoding-sniffer", "@exodus/bytes"],
				},
			},
		},
	}),
);
