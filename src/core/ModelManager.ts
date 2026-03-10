/**
 * AEM Model Manager Integration
 * Fetches and manages page/component models from AEM SPA Editor
 * Provides hooks for model updates and navigation
 */

export interface ModelManagerConfig {
  modelURL?: string;
  modelSelector?: string;
  modelExtension?: string;
  rootPath?: string;
  rewriteResourcePath?: (path: string) => string;
}

export interface PageModelData {
  [key: string]: any;
  ':type'?: string;
  ':path'?: string;
  ':items'?: Record<string, any>;
  ':itemsOrder'?: string[];
}

/**
 * Listener callback for model changes
 */
type ModelChangeListener = (data: PageModelData) => void;

/**
 * AEM Model Manager
 * Singleton service that manages communication with AEM SPA Editor
 */
export class AEMModelManager {
  private static instance: AEMModelManager;
  private listeners: Map<string, Set<ModelChangeListener>> = new Map();
  private models: Map<string, PageModelData> = new Map();
  private config: ModelManagerConfig;

  private constructor(config: ModelManagerConfig = {}) {
    this.config = {
      modelSelector: 'model',
      modelExtension: '.json',
      ...config,
    };
    this.initializeAdobePageModel();
  }

  /**
   * Get or create singleton instance
   */
  static getInstance(config?: ModelManagerConfig): AEMModelManager {
    if (!AEMModelManager.instance) {
      AEMModelManager.instance = new AEMModelManager(config);
    }
    return AEMModelManager.instance;
  }

  /**
   * Initialize Adobe Page Model integration
   */
  private initializeAdobePageModel(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Hook into Adobe Page Model updates
    if ((window as any).adobePageModel) {
      (window as any).adobePageModel.addListener((data: PageModelData) => {
        const path = data?.[':path'] || '/';
        this.models.set(path, data);
        this.notifyListeners(path, data);
      });
    }
  }

  /**
   * Fetch model for a specific page path
   * @param path - Page path (e.g., '/content/mysite/en/home')
   */
  async fetchModel(path: string): Promise<PageModelData> {
    // Check cache first
    if (this.models.has(path)) {
      return this.models.get(path)!;
    }

    try {
      const modelPath = this.buildModelPath(path);
      const response = await fetch(modelPath);

      if (!response.ok) {
        throw new Error(`Failed to fetch model for ${path}: ${response.statusText}`);
      }

      const data: PageModelData = await response.json();
      this.models.set(path, data);
      this.notifyListeners(path, data);

      return data;
    } catch (error) {
      console.error('Error fetching AEM model:', error);
      throw error;
    }
  }

  /**
   * Build the model URL from page path
   */
  private buildModelPath(path: string): string {
    if (this.config.modelURL) {
      return this.config.modelURL;
    }

    // Standard AEM SPA Editor model path pattern
    const selector = this.config.modelSelector || 'model';
    const extension = this.config.modelExtension || '.json';

    // Remove trailing slashes
    const cleanPath = path.replace(/\/$/, '');

    return `${cleanPath}.${selector}${extension}`;
  }

  /**
   * Get cached model for a path
   */
  getModel(path: string): PageModelData | undefined {
    return this.models.get(path);
  }

  /**
   * Listen for model changes on a specific path
   */
  subscribe(path: string, listener: ModelChangeListener): () => void {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    this.listeners.get(path)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(path)?.delete(listener);
    };
  }

  /**
   * Notify all listeners of model change
   */
  private notifyListeners(path: string, data: PageModelData): void {
    const listeners = this.listeners.get(path);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  /**
   * Clear all cached models and listeners
   * Useful for testing
   */
  reset(): void {
    this.models.clear();
    this.listeners.clear();
  }

  /**
   * Get all cached models
   */
  getAllModels(): Record<string, PageModelData> {
    const result: Record<string, PageModelData> = {};
    this.models.forEach((data, path) => {
      result[path] = data;
    });
    return result;
  }

  /**
   * Resolve a path reference (handles relative paths)
   */
  resolvePath(basePath: string, referencePath: string): string {
    if (referencePath.startsWith('/')) {
      return referencePath;
    }

    // Simple relative path resolution
    const baseParts = basePath.split('/').filter((p) => p);
    const refParts = referencePath.split('/').filter((p) => p);

    for (const part of refParts) {
      if (part === '..') {
        baseParts.pop();
      } else if (part !== '.') {
        baseParts.push(part);
      }
    }

    return '/' + baseParts.join('/');
  }
}

/**
 * Create or get singleton instance with config
 */
export function createModelManager(config?: ModelManagerConfig): AEMModelManager {
  return AEMModelManager.getInstance(config);
}

/**
 * Get current singleton instance
 */
export function getModelManager(): AEMModelManager {
  return AEMModelManager.getInstance();
}
