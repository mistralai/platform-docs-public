export function slugify(str) {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function titleString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Filters a list of cookbooks based on use case, integration, tag filters, and a search term.
 *
 * @param {Array<Object>} cookbooks - The list of cookbooks to filter.
 * @param {Array<string>} useCaseFilter - The use case filters to apply.
 * @param {Array<string>} integrationFilter - The integration filters to apply.
 * @param {Array<string>} [tagFilter=[]] - The tag filters to apply.
 * @param {string} [searchTerm=""] - The search term to filter cookbooks by.
 * @returns {Array<Object>} The filtered list of cookbooks.
 */
// utils.js
export const filterCookbooks = (
  cookbooks,
  useCaseFilter,
  integrationFilter,
  tagFilter = [],
  searchTerm = ""
) => {
  console.log("useCaseFilter:", useCaseFilter);
  console.log("integrationFilter:", integrationFilter);
  console.log("tagFilter:", tagFilter);
  console.log("searchTerm:", searchTerm);

  const useCaseFilterLower = useCaseFilter?.map((el) => el.toLowerCase());
  const integrationFilterLower = integrationFilter?.map((el) => el.toLowerCase());
  const searchTermLower = searchTerm.toLowerCase();

  return cookbooks
    ?.map((cookbook) => {
      const searchTerms = (
        cookbook.title +
        (cookbook.description || "") +
        (cookbook.labels?.useCases ? cookbook.labels.useCases.join(" ") : "") +
        (cookbook.labels?.integrations ? cookbook.labels.integrations.join(" ") : "")
      ).toLowerCase();

      const mappedTags = [
        ...(cookbook.labels?.useCases
          ? cookbook.labels.useCases.map((tag) => tag.toString().toLowerCase())
          : []),
        ...(cookbook.labels?.integrations
          ? cookbook.labels.integrations.map((tag) => tag.toString().toLowerCase())
          : [])
      ];

      return {
        ...cookbook,
        searchTerms,
        mappedTags,
      };
    })
    .filter(
      ({ mappedTags, searchTerms }) => {
        const matchesUseCase = !useCaseFilterLower.length || useCaseFilterLower.some((el) => mappedTags.includes(el));
        const matchesIntegration = !integrationFilterLower.length || integrationFilterLower.some((el) => mappedTags.includes(el));
        const matchesSearchTerm = searchTerms.includes(searchTermLower);

        return matchesUseCase && matchesIntegration && matchesSearchTerm;
      }
    );
};

export const extractUniqueLabels = (cookbooks) => {
  console.log('Extracting unique labels from cookbooks:', cookbooks);
  const integrations = new Set();
  const useCases = new Set();

  cookbooks.forEach((cookbook) => {
    if (cookbook.labels) {
      console.log('Processing cookbook labels:', cookbook.labels);
      cookbook.labels.integrations?.forEach((integration) => {
        console.log('Adding integration:', integration);
        integrations.add(integration);
      });
      cookbook.labels.useCases?.forEach((useCase) => {
        console.log('Adding use case:', useCase);
        useCases.add(useCase);
      });
    }
  });

  console.log('Raw integrations set:', integrations);
  console.log('Raw use cases set:', useCases);

  const capitalize = (str) => {
    const capitalizedStr = str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    console.log(`Capitalizing: ${str} -> ${capitalizedStr}`);
    return capitalizedStr;
  };

  const sortedIntegrations = Array.from(integrations).sort((a, b) => a.localeCompare(b));
  const sortedUseCases = Array.from(useCases).sort((a, b) => a.localeCompare(b));

  console.log('Sorted integrations:', sortedIntegrations);
  console.log('Sorted use cases:', sortedUseCases);

  const result = {
    integrations: sortedIntegrations.map((integration) => ({
      value: integration,
      label: capitalize(integration)
    })),
    useCases: sortedUseCases.map((useCase) => ({
      value: useCase,
      label: capitalize(useCase)
    })),
  };

  console.log('Final result:', result);
  return result;
};


function decodeHTMLEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

function replaceBoldTagsWithMarkdown(text) {
  return text.replace(/<b>(.*?)<\/b>/g, '**$1**');
}

/*
export function processMarkdownAttachments(markdownContent, basePath) {
  console.log('Original Markdown Content:', markdownContent);

  // Decode HTML entities first
  let processedMarkdown = decodeHTMLEntities(markdownContent);
  console.log('After Decoding HTML Entities:', processedMarkdown);

  // Replace <b> tags with Markdown bold syntax
  processedMarkdown = processedMarkdown.replace(/<b>(.*?)<\/b>/g, '**$1**');
  console.log('After Replacing Bold Tags:', processedMarkdown);

  // Handle images
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  processedMarkdown = processedMarkdown.replace(imageRegex, (match, alt, src) => {
    if (src.startsWith('http://') || src.startsWith('https://')) {
      images.push({ alt, src });
      return match;
    }

    const normalizedSrc = src.replace(/^\.\//, '');
    const imagePath = `${basePath}/${normalizedSrc}`;
    const rawGitHubUrl = `https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/${imagePath}`;

    images.push({ alt, src: rawGitHubUrl });
    return `![${alt}](${rawGitHubUrl})`;
  });

  // Handle YouTube embeds - first pass to extract video IDs
  const youtubeRegex = /\[YouTube\]\((https:\/\/www\.youtube\.com\/watch\?v=([^&)]+))\)/g;
  const youtubeVideos = [];
  processedMarkdown = processedMarkdown.replace(youtubeRegex, (match, url, videoId) => {
    youtubeVideos.push({ videoId });
    return `<!-- YouTubeEmbed:${videoId} -->`;
  });

  return { processedMarkdown, images, youtubeVideos };
}*/
function cleanTitle(title) {
  if (!title) return null;
  let cleaned = title.trim();
  cleaned = decodeHTMLEntities(cleaned); // Decode HTML entities
  cleaned = cleaned.replace(/<[^>]*>/g, ''); // Remove HTML tags
  cleaned = cleaned.replace(/[\*_]{1,2}(.*?)[\*_]{1,2}/g, '$1'); // Remove markdown formatting
  cleaned = cleaned.replace(/\s*align="[^"]*"/g, ''); // Remove align attributes
  cleaned = cleaned.replace(/[\[\]]/g, ''); // Remove brackets
  return cleaned;
}
// platform-docs/libs/utils.js
export function processIpynbAttachments(jsonData, basePath = '') {
  jsonData.cells.forEach((cell) => {
    if (cell.cell_type === "markdown") {
      const outputs = cell.outputs ? cell.outputs : [];
      let newOutputs = [...outputs];
      let newSource = [...cell.source];

      // Handle attachments
      if (cell.attachments) {
        Object.entries(cell.attachments).forEach(([filename, data]) => {
          const mimeType = Object.keys(data)[0];
          const base64Data = data[mimeType];

          newOutputs.push({
            data: {
              [mimeType]: `${base64Data}`,
            },
            metadata: {},
            output_type: "display_data",
          });
        });
      }

      // Handle base64 encoded images in source
      newSource = newSource.map(line => {
        const base64Match = line.match(/!\[([^\]]*)\]\(data:(.*?);base64,(.*?)\)/);
        if (base64Match) {
          const [, alt, mimeType, base64Data] = base64Match;
          newOutputs.push({
            data: {
              [mimeType]: base64Data,
            },
            metadata: {},
            output_type: "display_data",
          });
          return line.replace(/!\[.*?\]\(data:(.*?);base64,(.*?)\)/, '');
        }

        // Handle regular image URLs
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        return line.replace(imageRegex, (match, alt, src) => {
          if (src.startsWith('http://') || src.startsWith('https://')) {
            return match; // Leave absolute URLs as-is
          }

          // Convert relative paths to raw GitHub URLs
          const normalizedSrc = src.replace(/^\.\//, '');
          const imagePath = `${basePath}/${normalizedSrc}`;
          const rawGitHubUrl = `https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/${imagePath}`;
          return `![${alt}](${rawGitHubUrl})`;
        });
      }).filter(line => !line.match(/attachment:[^ ]*\.(png|jpg|jpeg|gif|svg|bmp|ico|tif|tiff)\b/i));

      // Handle markdown links
      newSource = newSource.map(line => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        return line.replace(linkRegex, (match, text, href) => {
          if (href.startsWith('http://') || href.startsWith('https://')) {
            return match; // Leave absolute URLs as-is
          }

          // Convert relative paths to absolute paths
          const normalizedHref = href.replace(/^\.\//, '');
          const absoluteHref = `/cookbooks/${basePath}/${normalizedHref}`.replace(/\/+/g, '/');
          return `[${text}](${absoluteHref})`;
        });
      });

      // Handle YouTube embeds
      newSource = newSource.map(line => {
        const youtubeMatch = line.match(/<!-- YouTubeEmbed:([^ ]+) -->/);
        if (youtubeMatch) {
          const videoId = youtubeMatch[1];
          return `\`\`\`html
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 1em 0;">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}"
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
  </iframe>
</div>
\`\`\``;
        }
        return line;
      });

      cell.source = newSource;
      cell.outputs = newOutputs;
    }
  });

  return jsonData;
}
// utils.js
export async function fetchAndProcessNotebook(path) {
  try {
    if (!path) {
      throw new Error("No path provided");
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fetchUrl = `${baseUrl}/${path}`;
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch JSON file: ${response.status} ${response.statusText}`);
    }

    const jsonData = await response.json();

    // Extract the base path from the path prop
    const basePath = path.substring(0, path.lastIndexOf('/'));

    // Process the notebook data
    return processIpynbAttachments(jsonData, basePath);
  } catch (error) {
    console.error("Error loading notebook:", error);
    return null;
  }
}
export async function getNotebookTitle(path) {
  if (!path) return null;

  try {
    const response = await fetch(`${window.location.origin}/${path}`);
    if (!response.ok) {
      console.error(`Failed to fetch file at ${path}`);
      return null;
    }

    const content = await response.text();

    // Handle markdown files (case-insensitive)
    if (path.match(/\.md$/i)) {
      return extractTitleFromMarkdown(content);
    }
    // Handle notebook files (case-insensitive)
    else if (path.match(/\.ipynb$/i)) {
      const notebookData = JSON.parse(content);
      return extractTitleFromNotebook(notebookData);
    }

    return null;
  } catch (error) {
    console.error(`Error fetching title for ${path}:`, error);
    return null;
  }
}

function extractTitleFromMarkdown(markdownContent) {
  // Check for any markdown header (h1, h2, h3, etc.)
  const headerMatch = markdownContent.match(/^(#+\s+.+)/m);
  if (headerMatch) {
    return cleanTitle(headerMatch[1].replace(/^#+\s+/, ''));
  }

  // Check for any HTML header (h1, h2, h3, etc.)
  const htmlHeaderMatch = markdownContent.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
  if (htmlHeaderMatch) {
    return cleanTitle(htmlHeaderMatch[1]);
  }

  // If no header found, return the first line as fallback
  const firstLine = markdownContent.split('\n')[0].trim();
  return firstLine ? cleanTitle(firstLine) : null;
}

export function extractTitleFromNotebook(notebookData) {
  if (!notebookData?.cells) return null;

  // First try to find a title in markdown cells
  for (const cell of notebookData.cells) {
    if (cell.cell_type === "markdown") {
      for (const line of cell.source) {
        // Check for markdown H1
        const h1Match = line.match(/^#\s+(.+)/);
        if (h1Match) {
          return cleanTitle(h1Match[1]);
        }
        // Check for markdown H2
        const h2Match = line.match(/^##\s+(.+)/);
        if (h2Match) {
          return cleanTitle(h2Match[1]);
        }
        // Check for HTML H1
        const htmlH1Match = line.match(/<h1[^>]*>(.*?)<\/h1>/i);
        if (htmlH1Match) {
          return cleanTitle(htmlH1Match[1]);
        }
        // Check for HTML H2
        const htmlH2Match = line.match(/<h2[^>]*>(.*?)<\/h2>/i);
        if (htmlH2Match) {
          return cleanTitle(htmlH2Match[1]);
        }
      }
    }
  }

  // If no title found in markdown, try to get it from the notebook metadata
  if (notebookData.metadata?.title) {
    return cleanTitle(notebookData.metadata.title);
  }

  return null;
}