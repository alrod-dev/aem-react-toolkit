/**
 * Sling Models Utilities
 * Helpers for working with AEM Sling models in JSON format
 */

import { AEMComponent, PageModel } from '../core/types';

/**
 * AEM model metadata prefix
 */
const AEM_METADATA_PREFIX = ':';

/**
 * Extract model metadata
 */
export function extractMetadata(model: Record<string, any>): Record<string, any> {
  const metadata: Record<string, any> = {};

  Object.entries(model).forEach(([key, value]) => {
    if (key.startsWith(AEM_METADATA_PREFIX)) {
      metadata[key] = value;
    }
  });

  return metadata;
}

/**
 * Extract component properties (non-metadata)
 */
export function extractProperties(model: Record<string, any>): Record<string, any> {
  const props: Record<string, any> = {};

  Object.entries(model).forEach(([key, value]) => {
    if (!key.startsWith(AEM_METADATA_PREFIX)) {
      props[key] = value;
    }
  });

  return props;
}

/**
 * Get component type
 */
export function getComponentType(model: AEMComponent): string | undefined {
  return model[':type'];
}

/**
 * Get component path
 */
export function getComponentPath(model: AEMComponent): string | undefined {
  return model[':path'];
}

/**
 * Check if model has children items
 */
export function hasChildren(model: Record<string, any>): boolean {
  return ':items' in model && model[':items'] && Object.keys(model[':items']).length > 0;
}

/**
 * Get children items
 */
export function getChildren(model: Record<string, any>): Record<string, AEMComponent> {
  return model[':items'] || {};
}

/**
 * Get children order
 */
export function getChildrenOrder(model: Record<string, any>): string[] {
  return model[':itemsOrder'] || Object.keys(model[':items'] || {});
}

/**
 * Iterate children in order
 */
export function forEachChild(
  model: Record<string, any>,
  callback: (child: AEMComponent, key: string, index: number) => void
): void {
  const children = getChildren(model);
  const order = getChildrenOrder(model);

  order.forEach((key, index) => {
    const child = children[key];
    if (child) {
      callback(child, key, index);
    }
  });
}

/**
 * Map children to React components
 */
export function mapChildren<T>(
  model: Record<string, any>,
  mapper: (child: AEMComponent, key: string) => T
): T[] {
  const children = getChildren(model);
  const order = getChildrenOrder(model);
  const result: T[] = [];

  order.forEach((key) => {
    const child = children[key];
    if (child) {
      result.push(mapper(child, key));
    }
  });

  return result;
}

/**
 * Find child by type
 */
export function findChildByType(
  model: Record<string, any>,
  type: string
): AEMComponent | undefined {
  const children = getChildren(model);
  return Object.values(children).find((child) => getComponentType(child as AEMComponent) === type);
}

/**
 * Filter children by type
 */
export function filterChildrenByType(
  model: Record<string, any>,
  type: string
): AEMComponent[] {
  const children = getChildren(model);
  return Object.values(children).filter(
    (child) => getComponentType(child as AEMComponent) === type
  );
}

/**
 * Flatten nested structure
 */
export function flattenModel(
  model: Record<string, any>,
  depth: number = 0,
  maxDepth: number = 10
): AEMComponent[] {
  if (depth > maxDepth) {
    return [];
  }

  const result: AEMComponent[] = [];
  const children = getChildren(model);

  Object.values(children).forEach((child) => {
    result.push(child as AEMComponent);
    // Recursively flatten nested children
    result.push(...flattenModel(child as Record<string, any>, depth + 1, maxDepth));
  });

  return result;
}

/**
 * Get model property with fallback
 */
export function getProperty<T = any>(
  model: Record<string, any>,
  key: string,
  defaultValue?: T
): T {
  const value = model[key];
  return value !== undefined ? (value as T) : (defaultValue as T);
}

/**
 * Check if property is set
 */
export function hasProperty(model: Record<string, any>, key: string): boolean {
  return key in model && model[key] !== null && model[key] !== undefined;
}

/**
 * Get all properties as map (excluding metadata)
 */
export function toPropertyMap(model: AEMComponent): Map<string, any> {
  const map = new Map<string, any>();

  Object.entries(model).forEach(([key, value]) => {
    if (!key.startsWith(AEM_METADATA_PREFIX)) {
      map.set(key, value);
    }
  });

  return map;
}

/**
 * Create component model object
 */
export function createComponentModel(
  type: string,
  properties: Record<string, any>,
  path?: string
): AEMComponent {
  return {
    ':type': type,
    ':path': path,
    ...properties,
  };
}

/**
 * Validate model has required properties
 */
export function validateModel(
  model: Record<string, any>,
  requiredProps: string[]
): { valid: boolean; missing: string[] } {
  const missing = requiredProps.filter((prop) => !hasProperty(model, prop));
  return {
    valid: missing.length === 0,
    missing,
  };
}
