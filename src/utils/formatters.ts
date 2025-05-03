// Date formatter
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Number formatter
export const formatNumber = (num: number | undefined): string => {
  if (num === undefined) return '';
  return num.toLocaleString();
};

// Text truncator
export const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

// Format external links
export const formatExternalLink = (url: string | undefined): string => {
  if (!url) return "";

  // If the URL doesn't start with http:// or https://, add https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
};

// Returns true if the URL is external (starts with http:// or https:// and is not the same origin)
export const isExternalLink = (url: string): boolean => {
  try {
    const link = new URL(url, window.location.origin);
    return link.origin !== window.location.origin;
  } catch {
    return false;
  }
}; 