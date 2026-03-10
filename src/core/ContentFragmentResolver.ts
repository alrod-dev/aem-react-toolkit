/**
 * Content Fragment Resolver
 * Utilities for fetching and parsing AEM Content Fragments
 * Supports both Content Fragment API and direct model access
 */

import { ContentFragment, ContentFragmentField } from './types';

export interface ContentFragmentFetchOptions {
  path: string;
  depth?: number;
  locale?: string;
  cache?: boolean;
}

export interface ContentFragmentQuery {
  graphqlEndpoint?: string;
  apiKey?: string;
}

/**
 * Fetch Content Fragment from AEM
 * Supports both REST API and GraphQL endpoints
 */
export class ContentFragmentResolver {
  private cache: Map<string, ContentFragment> = new Map();
  private fetchOptions: ContentFragmentQuery;

  constructor(options?: ContentFragmentQuery) {
    this.fetchOptions = {
      graphqlEndpoint: '/api/graphql',
      ...options,
    };
  }

  /**
   * Fetch Content Fragment by path
   * @param path - CF path (e.g., '/content/dam/mysite/en/my-fragment')
   */
  async fetchByPath(path: string, useCache: boolean = true): Promise<ContentFragment> {
    // Check cache
    if (useCache && this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    try {
      const response = await fetch(this.buildCFApiUrl(path));

      if (!response.ok) {
        throw new Error(`Failed to fetch Content Fragment: ${response.statusText}`);
      }

      const data = await response.json();
      const fragment = this.parseContentFragment(data);

      if (useCache) {
        this.cache.set(path, fragment);
      }

      return fragment;
    } catch (error) {
      console.error('Error fetching Content Fragment:', error);
      throw error;
    }
  }

  /**
   * Fetch multiple Content Fragments by tag
   */
  async fetchByTag(tag: string, locale?: string): Promise<ContentFragment[]> {
    try {
      const query = `
        {
          contentFragmentList(
            filter: { tagIds: ["${tag}"] }
          ) {
            items {
              _path
              _metadata {
                stringMetadata {
                  name
                  value
                }
              }
            }
          }
        }
      `;

      const response = await fetch(this.fetchOptions.graphqlEndpoint || '/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`GraphQL query failed: ${response.statusText}`);
      }

      const result = await response.json();
      const items = result.data?.contentFragmentList?.items || [];

      return Promise.all(items.map((item: any) => this.fetchByPath(item._path)));
    } catch (error) {
      console.error('Error fetching fragments by tag:', error);
      throw error;
    }
  }

  /**
   * Parse raw Content Fragment response
   */
  private parseContentFragment(data: any): ContentFragment {
    return {
      id: data.id || data._path || '',
      title: data.title || '',
      description: data.description,
      elements: this.parseElements(data.elements || data.data || {}),
      ':path': data._path,
      ':type': data._metadata?.resourceType,
    };
  }

  /**
   * Parse Content Fragment fields/elements
   */
  private parseElements(elements: Record<string, any>): Record<string, ContentFragmentField> {
    const result: Record<string, ContentFragmentField> = {};

    Object.entries(elements).forEach(([name, element]) => {
      const el = element as any;
      result[name] = {
        name,
        type: el.dataType || el.type || 'SingleLineText',
        value: el.value || el.plaintext || el.html || el,
      };
    });

    return result;
  }

  /**
   * Build Content Fragment API URL
   */
  private buildCFApiUrl(path: string): string {
    // Standard AEM CF API endpoint
    const cleanPath = path.replace(/\.json$/, '');
    return `${cleanPath}.json`;
  }

  /**
   * Get field value with type coercion
   */
  static getFieldValue(field: ContentFragmentField, type?: string): any {
    const fieldType = type || field.type;

    switch (fieldType) {
      case 'Boolean':
        return field.value === true || field.value === 'true';
      case 'Long':
      case 'Decimal':
        return Number(field.value);
      case 'DateTime':
        return new Date(field.value);
      case 'RichText':
        return field.value?.html || field.value;
      default:
        return field.value;
    }
  }

  /**
   * Extract plain text from RTE field
   */
  static extractPlainText(htmlContent: string): string {
    if (!htmlContent) {
      return '';
    }

    // Remove HTML tags
    return htmlContent
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cached fragment
   */
  getCached(path: string): ContentFragment | undefined {
    return this.cache.get(path);
  }
}

/**
 * Singleton instance
 */
let resolverInstance: ContentFragmentResolver;

export function getContentFragmentResolver(
  options?: ContentFragmentQuery
): ContentFragmentResolver {
  if (!resolverInstance) {
    resolverInstance = new ContentFragmentResolver(options);
  }
  return resolverInstance;
}

/**
 * Helper to resolve CF reference in component model
 */
export async function resolveCFReference(cfPath: string): Promise<ContentFragment | null> {
  if (!cfPath) {
    return null;
  }

  try {
    const resolver = getContentFragmentResolver();
    return await resolver.fetchByPath(cfPath);
  } catch (error) {
    console.error('Failed to resolve CF reference:', error);
    return null;
  }
}
