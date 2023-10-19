import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/main.ts","src/index.ts"],
	format: ["cjs", "esm"],
	dts: true,
	target: 'node16',
	shims:true,
	splitting: false,
	treeshake:true,
	clean: true,
	bundle:true,
});