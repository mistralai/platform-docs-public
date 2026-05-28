/** @type {import('next').NextConfig} */
import fs from "node:fs";
import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { getCspHeaderValue } from "./csp";
import { redirects } from "./redirect";
import { rewrites } from "./rewrite";
import {
	admonitionDirective,
	remarkAudioToComponent,
	remarkDirective,
	remarkFrontmatter,
	remarkGfm,
	remarkHeadingId,
	remarkOgFromPath,
} from "./src/lib/frontmatter";
import { remarkDetailsClasses } from "./src/lib/remark-prose-details";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");
const EMPTY_MDX_STUB = path.join(CONTENT_ROOT, "_empty.mdx");

const nextConfig: NextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	reactStrictMode: false,
	typescript: {
		ignoreBuildErrors: false,
	},
	experimental: {
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-accordion",
			"@radix-ui/react-avatar",
			"@radix-ui/react-checkbox",
			"@radix-ui/react-collapsible",
			"@radix-ui/react-context-menu",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-hover-card",
			"@radix-ui/react-label",
			"@radix-ui/react-menubar",
			"@radix-ui/react-navigation-menu",
			"@radix-ui/react-popover",
			"@radix-ui/react-select",
			"@radix-ui/react-separator",
			"@radix-ui/react-slot",
			"@radix-ui/react-switch",
			"@radix-ui/react-tabs",
			"@radix-ui/react-tooltip",
			"framer-motion",
		],
	},
	rewrites: async () => {
		return rewrites;
	},
	async redirects() {
		return redirects;
	},
	webpack(config, { dev, webpack }) {
		// The localized catch-all routes compile large MDX modules into webpack
		// cache entries, which triggers noisy PackFileCacheStrategy big-string
		// warnings during production builds.
		if (!dev) config.cache = false;
		// Dynamic `import()` expressions in app routes expand to a lazy glob over
		// every matching .mdx file. For non-default locales, translated pages may
		// reference partials the pipeline hasn't produced yet. Redirect missing
		// relative .mdx imports to an empty stub so webpack resolves; runtime
		// `resolveContentLocale` ensures the stubbed page is never loaded.
		config.plugins.push(
			new webpack.NormalModuleReplacementPlugin(/\.mdx$/, (resource: any) => {
				const req: string = resource.request;
				if (!req.startsWith(".")) return;
				const issuerDir: string | undefined = resource.context;
				if (!issuerDir || !issuerDir.startsWith(CONTENT_ROOT)) return;
				const full = path.resolve(issuerDir, req);
				if (fs.existsSync(full)) return;
				resource.request = EMPTY_MDX_STUB;
			}),
		);
		return config;
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "geolocation=(), microphone=(), camera=()",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "Content-Security-Policy",
						value: getCspHeaderValue(),
					},
				],
			},
		];
	},
};

const withMDX = createMDX({
	extension: /\.(md|mdx)$/,
	options: {
		jsx: true,
		jsxImportSource: "react",
		remarkPlugins: [
			remarkAudioToComponent,
			remarkDirective,
			remarkFrontmatter,
			[remarkMdxFrontmatter, { name: "_fm" }],
			remarkGfm,
			[remarkOgFromPath, { apiBase: "/api/og" }],
			remarkHeadingId,
			[remarkDetailsClasses],
			admonitionDirective,
		],
	},
});
export default withMDX(nextConfig);
