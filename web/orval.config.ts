import { defineConfig } from "orval";

export default defineConfig({
	api: {
		input: {
			target: "http://localhost:5204/openapi/v1.json",
		},
		output: {
			target: "./lib/api/generated/api.ts",
			client: "fetch",
			override: {
				mutator: {
					path: "./lib/api/mutator.ts",
					name: "apiMutator",
				},
			},
		},
	},
});