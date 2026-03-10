/**
 * useAEMModel Hook
 * Subscribe to AEM model changes and updates
 */

import { useEffect, useState } from 'react';
import { PageModel } from '../core/types';
import { getPageModelProvider } from '../core/PageModel';

/**
 * Hook to get current AEM page model and reload function
 */
export function useAEMModel(path?: string) {
  const provider = getPageModelProvider();
  const [model, setModel] = useState<PageModel | null>(
    path ? null : provider.getCurrentModel()
  );
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (path) {
      setLoading(true);
      provider
        .loadPageModel(path)
        .then((loadedModel) => {
          setModel(loadedModel);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [path]);

  useEffect(() => {
    const unsubscribe = provider.subscribe((updatedModel) => {
      setModel(updatedModel);
    });

    return () => unsubscribe();
  }, []);

  const reloadModel = async () => {
    if (path) {
      try {
        const reloaded = await provider.loadPageModel(path);
        setModel(reloaded);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  };

  return {
    model,
    loading,
    error,
    currentPath: provider.getCurrentPath(),
    reloadModel,
  };
}

/**
 * Hook to get specific component from model
 */
export function useAEMComponent(componentKey: string) {
  const { model } = useAEMModel();
  const [component, setComponent] = useState<any>(null);

  useEffect(() => {
    if (model) {
      const comp = model[componentKey];
      setComponent(comp);
    }
  }, [model, componentKey]);

  return component;
}

/**
 * Hook to get model property with type safety
 */
export function useAEMProperty<T = any>(key: string, defaultValue?: T): T {
  const { model } = useAEMModel();

  if (!model || !(key in model)) {
    return defaultValue as T;
  }

  return model[key] as T;
}
