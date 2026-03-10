/**
 * Experience Fragment Renderer
 * Component for rendering AEM Experience Fragments in React SPA
 * Handles both static and dynamic experience fragment loading
 */

import React, { useEffect, useState } from 'react';
import { ExperienceFragmentRef } from './types';

export interface ExperienceFragmentRendererProps {
  fragmentPath: string;
  variation?: string;
  selectors?: string[];
  placeholder?: React.ReactNode;
  onLoad?: (html: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  isInEditor?: boolean;
}

/**
 * Hook to load Experience Fragment HTML
 */
export function useExperienceFragment(
  fragmentPath: string,
  options?: {
    variation?: string;
    selectors?: string[];
  }
): {
  html: string | null;
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
} {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFragment = React.useCallback(async () => {
    if (!fragmentPath) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = buildExperienceFragmentUrl(fragmentPath, options);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to load Experience Fragment: ${response.statusText}`);
      }

      const content = await response.text();
      setHtml(content);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Error loading Experience Fragment:', error);
    } finally {
      setLoading(false);
    }
  }, [fragmentPath, options]);

  useEffect(() => {
    fetchFragment();
  }, [fetchFragment]);

  return {
    html,
    loading,
    error,
    reload: fetchFragment,
  };
}

/**
 * Build Experience Fragment URL with proper selectors
 */
export function buildExperienceFragmentUrl(
  fragmentPath: string,
  options?: {
    variation?: string;
    selectors?: string[];
  }
): string {
  let url = fragmentPath;

  // Add variation if specified
  if (options?.variation) {
    url = url.replace(/\/$/, '') + `/${options.variation}`;
  }

  // Add selectors (e.g., .cq_model for JSON, .html for HTML)
  if (options?.selectors && options.selectors.length > 0) {
    const selectorString = options.selectors.join('.');
    url = `${url.replace(/\/$/, '')}.${selectorString}`;
  } else {
    // Default: fetch as HTML component
    url = `${url.replace(/\/$/, '')}.html`;
  }

  return url;
}

/**
 * Experience Fragment Renderer Component
 * Renders Experience Fragments as HTML content
 */
export const ExperienceFragmentRenderer: React.FC<ExperienceFragmentRendererProps> = ({
  fragmentPath,
  variation,
  selectors,
  placeholder = <div>Loading...</div>,
  onLoad,
  onError,
  className,
  isInEditor = false,
}) => {
  const { html, loading, error } = useExperienceFragment(fragmentPath, {
    variation,
    selectors,
  });

  useEffect(() => {
    if (html && onLoad) {
      onLoad(html);
    }
  }, [html, onLoad]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  if (loading) {
    return <div className="aem-xf-renderer aem-xf-renderer--loading">{placeholder}</div>;
  }

  if (error) {
    if (isInEditor) {
      return (
        <div className="aem-xf-renderer aem-xf-renderer--error">
          <div style={{ padding: '20px', color: 'red', border: '1px solid red' }}>
            Error loading Experience Fragment: {error.message}
          </div>
        </div>
      );
    }
    return null;
  }

  if (!html) {
    return (
      <div className="aem-xf-renderer aem-xf-renderer--empty">
        {isInEditor && <p>No content available</p>}
      </div>
    );
  }

  return (
    <div
      className={`aem-xf-renderer ${className || ''}`}
      data-xf-path={fragmentPath}
      data-xf-variation={variation}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

ExperienceFragmentRenderer.displayName = 'ExperienceFragmentRenderer';

/**
 * Advanced Experience Fragment wrapper with wrapper element support
 * For Experience Fragments that wrap content (e.g., header, footer)
 */
export interface ExperienceFragmentWrapperProps extends ExperienceFragmentRendererProps {
  as?: keyof JSX.IntrinsicElements;
  wrapperClassName?: string;
}

export const ExperienceFragmentWrapper: React.FC<ExperienceFragmentWrapperProps> = ({
  as: Component = 'div',
  wrapperClassName,
  ...props
}) => {
  return (
    <Component className={wrapperClassName}>
      <ExperienceFragmentRenderer {...props} />
    </Component>
  );
};

ExperienceFragmentWrapper.displayName = 'ExperienceFragmentWrapper';

/**
 * Hook to manage multiple Experience Fragments
 */
export function useExperienceFragments(
  fragments: Record<string, string>
): Record<
  string,
  {
    html: string | null;
    loading: boolean;
    error: Error | null;
  }
> {
  const results: Record<
    string,
    {
      html: string | null;
      loading: boolean;
      error: Error | null;
    }
  > = {};

  for (const [key, path] of Object.entries(fragments)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fragment = useExperienceFragment(path);
    results[key] = {
      html: fragment.html,
      loading: fragment.loading,
      error: fragment.error,
    };
  }

  return results;
}
