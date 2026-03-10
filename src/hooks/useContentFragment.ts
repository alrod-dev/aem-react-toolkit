/**
 * useContentFragment Hook
 * Fetch and manage AEM Content Fragments
 */

import { useEffect, useState } from 'react';
import { ContentFragment } from '../core/types';
import { getContentFragmentResolver } from '../core/ContentFragmentResolver';

/**
 * Hook to fetch Content Fragment by path
 */
export function useContentFragment(path: string | null) {
  const [fragment, setFragment] = useState<ContentFragment | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setFragment(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const resolver = getContentFragmentResolver();

    resolver
      .fetchByPath(path)
      .then((cf) => {
        setFragment(cf);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
  }, [path]);

  const reload = async () => {
    if (!path) return;

    setLoading(true);
    try {
      const resolver = getContentFragmentResolver();
      const cf = await resolver.fetchByPath(path, false); // Don't use cache
      setFragment(cf);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { fragment, loading, error, reload };
}

/**
 * Hook to fetch multiple Content Fragments by tag
 */
export function useContentFragmentsByTag(tag: string) {
  const [fragments, setFragments] = useState<ContentFragment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tag) {
      setFragments([]);
      setLoading(false);
      return;
    }

    const resolver = getContentFragmentResolver();

    resolver
      .fetchByTag(tag)
      .then((cfs) => {
        setFragments(cfs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
  }, [tag]);

  return { fragments, loading, error };
}

/**
 * Hook to get field value with type coercion
 */
export function useContentFragmentField<T = any>(
  path: string | null,
  fieldName: string,
  defaultValue?: T
): T {
  const { fragment } = useContentFragment(path);

  if (!fragment || !fragment.elements || !fragment.elements[fieldName]) {
    return defaultValue as T;
  }

  const field = fragment.elements[fieldName];
  return field.value as T;
}
