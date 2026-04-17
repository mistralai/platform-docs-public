import fs from 'fs';
import path from 'path';

// Parse all hrefs from header.ts
const headerPath = path.resolve('src/schema/content/header.ts');
const headerContent = fs.readFileSync(headerPath, 'utf-8');
const linkRegex = /href:\s*['"`](\/[^'"`]+)['"`]/g;
let match;
const linksToCheck = new Set<string>();

while ((match = linkRegex.exec(headerContent)) !== null) {
  linksToCheck.add(match[1]);
}

// Function to check if a valid Nextjs route exists
function routeExists(routePrefix: string) {
  const cleanRoute = routePrefix.split('#')[0]; // discard anchors
  // Mappings to App Router
  const possiblePaths = [
    `src/app/(docs)${cleanRoute}/page.mdx`,
    `src/app/(docs)${cleanRoute}/page.tsx`,
    `src/app/(api)${cleanRoute}/page.tsx`,
    `src/app${cleanRoute}/page.tsx`
  ];
  
  if (cleanRoute === '/api') return true; // Scalar dynamically handles this
  if (cleanRoute === '/studio-api/conversations') return true; // Handled by conversations/page.mdx
  if (cleanRoute === '/studio-api/batch-processing') return true;
  
  for (const p of possiblePaths) {
    if (fs.existsSync(path.resolve(p))) return true;
  }
  
  // also check if it's a directory with page.mdx inside it implicitly or explicit params
  return false;
}

const brokenLinks = [];
for (const link of linksToCheck) {
  // exceptions
  if (link.startsWith('/resources/status') || link.startsWith('/resources/support')) continue;
  if (!routeExists(link)) {
    brokenLinks.push(link);
  }
}

if (brokenLinks.length > 0) {
  console.log("Broken links found in header.ts:");
  console.log(brokenLinks.join('\n'));
} else {
  console.log("All header menus are valid!");
}

