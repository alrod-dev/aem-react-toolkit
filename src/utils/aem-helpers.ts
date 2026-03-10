/**
 * AEM Helper Utilities
 * Common AEM-specific utilities for path resolution, link rewriting, and RTE processing
 */

/**
 * Resolve AEM path to content path
 * Removes content/dam prefixes and handles locale-specific paths
 */
export function resolvePath(path: string): string {
  if (!path) return '';

  // Remove /content/sites/ or /content/dam/ prefix
  let resolved = path
    .replace(/^\/content\/sites\//, '/')
    .replace(/^\/content\/dam\//, '/');

  // Remove language code if present (e.g., /en/ -> /)
  resolved = resolved.replace(/^\/[a-z]{2}\//, '/');

  return resolved || '/';
}

/**
 * Rewrite AEM links to handle publication/locale
 * Converts AEM content paths to publish-friendly URLs
 */
export function rewriteLink(link: string, options?: { includeExtension?: boolean }): string {
  if (!link) return '#';

  // Handle external links
  if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:')) {
    return link;
  }

  // Resolve the path
  let rewritten = resolvePath(link);

  // Add .html extension if not present and not a directory
  if (options?.includeExtension && !rewritten.endsWith('.html') && !rewritten.endsWith('/')) {
    rewritten += '.html';
  }

  return rewritten;
}

/**
 * Extract plain text from AEM RTE HTML output
 */
export function extractPlainText(html: string): string {
  if (!html) return '';

  return (
    html
      // Remove script and style tags
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Trim whitespace
      .trim()
  );
}

/**
 * Process AEM RTE output
 * Sanitizes and formats rich text for rendering
 */
export function processRTEOutput(html: string): string {
  if (!html) return '';

  // Remove dangerous scripts
  let processed = html.replace(/<script[^>]*>.*?<\/script>/gi, '');

  // Remove event handlers
  processed = processed.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');

  return processed;
}

/**
 * Get AEM locale from path
 */
export function getLocaleFromPath(path: string): string | null {
  const match = path.match(/\/([a-z]{2}(?:[_-][A-Z]{2})?)\//);
  return match ? match[1] : null;
}

/**
 * Build AEM asset URL with desired width
 */
export function buildAssetUrl(
  assetPath: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp';
  }
): string {
  if (!assetPath) return '';

  let url = assetPath;

  // Add query parameters for asset delivery service
  const params: string[] = [];

  if (options?.width) {
    params.push(`w=${options.width}`);
  }
  if (options?.height) {
    params.push(`h=${options.height}`);
  }
  if (options?.quality) {
    params.push(`q=${options.quality}`);
  }
  if (options?.format) {
    params.push(`fm=${options.format}`);
  }

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  return url;
}

/**
 * Check if path is external
 */
export function isExternalLink(link: string): boolean {
  if (!link) return false;
  return /^(https?:|mailto:|tel:)/.test(link) || link.startsWith('//');
}

/**
 * Sanitize component property for display
 */
export function sanitizeProperty(value: any, type?: string): any {
  if (value === null || value === undefined) {
    return '';
  }

  switch (type) {
    case 'boolean':
      return value === true || value === 'true';
    case 'number':
      return Number(value);
    case 'date':
      return new Date(value).toISOString();
    default:
      return String(value);
  }
}

/**
 * Parse Sling model JSON response
 */
export function parseSlingModel<T = any>(data: any): T {
  if (!data) return {} as T;

  // Remove AEM metadata fields that start with ':'
  const model: any = {};

  Object.entries(data).forEach(([key, value]) => {
    // Keep AEM metadata for internal use
    if (key.startsWith(':')) {
      model[key] = value;
    } else {
      model[key] = value;
    }
  });

  return model as T;
}

/**
 * Create component property mapping for Sling models
 */
export function createPropertyMap(
  properties: Record<string, any>,
  mapping: Record<string, string>
): Record<string, any> {
  const mapped: Record<string, any> = {};

  Object.entries(mapping).forEach(([reactProp, aemProp]) => {
    if (aemProp in properties) {
      mapped[reactProp] = properties[aemProp];
    }
  });

  return mapped;
}
