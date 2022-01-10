import { extension } from "../postcss/stuff.js";

/** @type {import("../..").Heuristic[]} */
export const heuristics = [
	{
		description: "`tailwindcss` is installed",
		async detector({ folderInfo }) {
			return "tailwindcss" in folderInfo.allDependencies;
		},
	},
	{
		description: "`postcss.config.cjs` has `tailwindcss` as a plugin",
		async detector({ readFile }) {
			const { text } = await readFile({ path: "/postcss.config.cjs" });
			return text.includes("tailwindcss");
		},
	},
	{
		description: "`tailwind.config.cjs` exists and `tailwind.config.js` does not exist",
		async detector({ readFile }) {
			const cjs = await readFile({ path: "/tailwind.config.cjs" });
			const js = await readFile({ path: "/tailwind.config.js" });

			return cjs.exists && !js.exists;
		},
	},
	{
		description: `\`@tailwind\` directives are used in \`src/app.${extension}\``,
		async detector({ readFile }) {
			const { text } = await readFile({ path: `/src/app.${extension}` });
			if (!text.includes("@tailwind base")) return false;
			if (!text.includes("@tailwind components")) return false;
			if (!text.includes("@tailwind utilities")) return false;

			return true;
		},
	},
];
