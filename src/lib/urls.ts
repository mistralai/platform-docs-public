export const getHrefSlugs = (href: string) => {
  // for /getting-started/introduction, return ['getting-started', 'introduction'] (not including the first /)
  // for /capabilities/ return ['capabilities'] (not including the first / and the last /)
  // if href is getting-started, return ['getting-started']

  let correctedHref = href;
  if (correctedHref.endsWith('/')) {
    correctedHref = correctedHref.slice(0, -1);
  }
  if (correctedHref.startsWith('/')) {
    correctedHref = correctedHref.slice(1);
  }
  return correctedHref.split('/');
};

export const isExternalUrl = (url: string) => {
  return url.startsWith('http');
};
