/**
 * AEM MapTo - Component Registration for SPA Editor
 * Decorator pattern for mapping AEM content model types to React components
 * Inspired by @adobe/aem-react-editable-components but with enhancements
 */

import React from 'react';
import { AEMComponentProps, EditConfig } from './types';

// Registry to store all mapped components
const componentRegistry: Map<string, React.ComponentType<any>> = new Map();

/**
 * MapTo Decorator Configuration
 * Controls how a component integrates with AEM SPA Editor
 */
export interface MapToConfig {
  resourceType: string;
  editConfig?: EditConfig;
  wrappedComponent?: boolean;
}

/**
 * MapTo HOC - Maps AEM components to React components
 * Handles author mode detection, edit overlay management, and model binding
 *
 * @example
 * const Text = ({ text }: { text: string }) => <p>{text}</p>;
 * export default MapTo('my-app/components/text')(Text);
 */
export function MapTo(resourceType: string, editConfig?: EditConfig) {
  return function withMapTo<P extends AEMComponentProps>(
    WrappedComponent: React.ComponentType<P>
  ): React.ComponentType<P> {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    const MappedComponent: React.FC<P> = (props) => {
      const isInEditor = typeof window !== 'undefined' && !!(window as any).adobeQa;

      // Create editable container when in author mode
      if (isInEditor && editConfig?.emptyLabel) {
        return (
          <div
            data-path={props.cqPath}
            data-cq-component-type={resourceType}
            className="aem-editable-component"
            data-empty-label={editConfig.emptyLabel}
          >
            <WrappedComponent {...props} isInEditor={isInEditor} editConfig={editConfig} />
          </div>
        );
      }

      return <WrappedComponent {...props} isInEditor={isInEditor} editConfig={editConfig} />;
    };

    MappedComponent.displayName = `MapTo(${displayName})`;

    // Register component for later lookup
    componentRegistry.set(resourceType, MappedComponent);

    // Attach metadata for inspection
    (MappedComponent as any).resourceType = resourceType;
    (MappedComponent as any).editConfig = editConfig;

    return MappedComponent;
  };
}

/**
 * Retrieves a registered component by its resource type
 * @param resourceType - The AEM component resource type
 * @returns The mapped React component or undefined
 */
export function getComponentByType(resourceType: string): React.ComponentType<any> | undefined {
  return componentRegistry.get(resourceType);
}

/**
 * Returns all registered component mappings
 */
export function getAllComponentMappings(): Record<string, React.ComponentType<any>> {
  const mappings: Record<string, React.ComponentType<any>> = {};
  componentRegistry.forEach((component, resourceType) => {
    mappings[resourceType] = component;
  });
  return mappings;
}

/**
 * Clears all registered component mappings
 * Useful for testing
 */
export function clearComponentRegistry(): void {
  componentRegistry.clear();
}

/**
 * Component wrapper that enables edit mode functionality
 * Provides visual feedback in AEM author mode
 */
export interface EditableComponentWrapperProps {
  resourceType: string;
  cqPath?: string;
  isInEditor?: boolean;
  emptyLabel?: string;
  children: React.ReactNode;
}

export const EditableComponentWrapper: React.FC<EditableComponentWrapperProps> = ({
  resourceType,
  cqPath,
  isInEditor,
  emptyLabel,
  children,
}) => {
  const isEmpty = React.useMemo(() => {
    // Check if children contains meaningful content
    return !children || (typeof children === 'string' && children.trim() === '');
  }, [children]);

  if (isInEditor && isEmpty && emptyLabel) {
    return (
      <div
        data-path={cqPath}
        data-cq-component-type={resourceType}
        className="aem-editable-component aem-component-empty"
        data-empty-label={emptyLabel}
      >
        <div className="aem-component-empty-placeholder">{emptyLabel}</div>
      </div>
    );
  }

  return (
    <div
      data-path={cqPath}
      data-cq-component-type={resourceType}
      className="aem-editable-component"
    >
      {children}
    </div>
  );
};

EditableComponentWrapper.displayName = 'EditableComponentWrapper';
