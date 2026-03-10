/**
 * Page Model Provider
 * Manages page model state for SPA navigation and component rendering
 * Integrates with AEM SPA Editor for dynamic page composition
 */

import { PageModel, AEMComponent } from './types';

export interface PageModelProviderConfig {
  basePath?: string;
  modelExtension?: string;
  rewritePath?: (path: string) => string;
}

type PageModelListener = (model: PageModel) => void;

/**
 * Page Model Provider
 * Singleton service for managing current page model state
 */
export class PageModelProvider {
  private static instance: PageModelProvider;
  private currentModel: PageModel | null = null;
  private currentPath: string = '';
  private listeners: Set<PageModelListener> = new Set();
  private config: PageModelProviderConfig;

  private constructor(config: PageModelProviderConfig = {}) {
    this.config = {
      modelExtension: '.json',
      ...config,
    };
  }

  /**
   * Get or create singleton instance
   */
  static getInstance(config?: PageModelProviderConfig): PageModelProvider {
    if (!PageModelProvider.instance) {
      PageModelProvider.instance = new PageModelProvider(config);
    }
    return PageModelProvider.instance;
  }

  /**
   * Load page model from AEM
   */
  async loadPageModel(path: string): Promise<PageModel> {
    this.currentPath = path;

    try {
      const modelPath = this.buildModelPath(path);
      const response = await fetch(modelPath);

      if (!response.ok) {
        throw new Error(`Failed to load page model: ${response.statusText}`);
      }

      const model: PageModel = await response.json();
      this.setCurrentModel(model);

      return model;
    } catch (error) {
      console.error('Error loading page model:', error);
      throw error;
    }
  }

  /**
   * Set current page model and notify listeners
   */
  setCurrentModel(model: PageModel): void {
    this.currentModel = model;
    this.notifyListeners();
  }

  /**
   * Get current page model
   */
  getCurrentModel(): PageModel | null {
    return this.currentModel;
  }

  /**
   * Get current page path
   */
  getCurrentPath(): string {
    return this.currentPath;
  }

  /**
   * Get component from current model by key
   */
  getComponent(key: string): AEMComponent | undefined {
    if (!this.currentModel) {
      return undefined;
    }

    // Direct access
    if (this.currentModel[key]) {
      return this.currentModel[key];
    }

    // Try nested access
    const keys = key.split('.');
    let current: any = this.currentModel;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return undefined;
      }
    }

    return current as AEMComponent;
  }

  /**
   * Subscribe to model changes
   */
  subscribe(listener: PageModelListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of model change
   */
  private notifyListeners(): void {
    if (this.currentModel) {
      this.listeners.forEach((listener) => listener(this.currentModel!));
    }
  }

  /**
   * Build model path from page path
   */
  private buildModelPath(path: string): string {
    const cleanPath = path.replace(/\/$/, '');
    return `${cleanPath}.model${this.config.modelExtension}`;
  }

  /**
   * Clear current model
   */
  clear(): void {
    this.currentModel = null;
    this.currentPath = '';
  }

  /**
   * Reset provider
   */
  reset(): void {
    this.clear();
    this.listeners.clear();
  }
}

/**
 * Get or create Page Model Provider instance
 */
export function getPageModelProvider(config?: PageModelProviderConfig): PageModelProvider {
  return PageModelProvider.getInstance(config);
}

/**
 * React hook for page model
 * Returns current model and provides reload function
 */
export function usePageModel() {
  const provider = PageModelProvider.getInstance();
  const [model, setModel] = React.useState<PageModel | null>(provider.getCurrentModel());

  React.useEffect(() => {
    const unsubscribe = provider.subscribe((updatedModel) => {
      setModel(updatedModel);
    });

    return () => unsubscribe();
  }, []);

  return {
    model,
    path: provider.getCurrentPath(),
    loadPageModel: (path: string) => provider.loadPageModel(path),
  };
}

/**
 * Component to traverse items tree and render children
 * Useful for rendering container items
 */
export interface ItemsTreeProps {
  items?: Record<string, AEMComponent>;
  itemsOrder?: string[];
  renderItem: (key: string, item: AEMComponent) => React.ReactNode;
}

export const ItemsTree: React.FC<ItemsTreeProps> = ({ items, itemsOrder, renderItem }) => {
  if (!items) {
    return null;
  }

  // Use itemsOrder if available, otherwise use object keys
  const order = itemsOrder || Object.keys(items);

  return (
    <>
      {order.map((key) => {
        const item = items[key];
        if (!item) {
          return null;
        }
        return <React.Fragment key={key}>{renderItem(key, item)}</React.Fragment>;
      })}
    </>
  );
};

ItemsTree.displayName = 'ItemsTree';

// Import React for the hook
import React from 'react';
