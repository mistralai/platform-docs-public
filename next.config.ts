/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { getCspHeaderValue } from "./csp";
import { redirects } from "./redirect";
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
		return [
			{
				source: "/getting-started/introduction",
				destination: "/",
			},
			{
				source: "/api",
				destination: "/api/endpoint/chat",
			},
		];
	},
	async redirects() {
		return redirects;
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
			[remarkOgFromPath, { appDocsRoot: "src/app/(docs)", apiBase: "/api/og" }],
			remarkHeadingId,
			[remarkDetailsClasses],
			admonitionDirective,
		],
	},
});
export default withMDX(nextConfig);
