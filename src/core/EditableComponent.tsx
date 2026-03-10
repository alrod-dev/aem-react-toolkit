/**
 * EditableComponent - AEM Author Mode Support
 * Wraps React components with AEM SPA Editor integration
 * Enables in-place editing and author mode overlays
 */

import React, { useCallback, useEffect, useState } from 'react';
import { AEMComponentProps, EditConfig } from './types';

/**
 * Context for AEM Editor Mode
 */
const AEMEditorContext = React.createContext<{
  isInEditor: boolean;
  cqPath?: string;
  onComponentUpdate?: (path: string, updates: Record<string, any>) => void;
} | null>(null);

export const useAEMEditorContext = () => {
  const context = React.useContext(AEMEditorContext);
  if (!context) {
    return { isInEditor: false };
  }
  return context;
};

/**
 * Props for EditableComponent wrapper
 */
export interface EditableComponentWrapperProps extends AEMComponentProps {
  children: React.ReactNode;
  resourceType?: string;
  editConfig?: EditConfig;
}

/**
 * EditableComponent - Makes React components editable in AEM
 * Handles:
 * - Author mode detection
 * - Edit overlay rendering
 * - Model updates
 * - Placeholder text for empty components
 */
export const EditableComponent: React.FC<EditableComponentWrapperProps> = ({
  cqPath,
  cqType,
  editConfig,
  children,
  isInEditor: parentIsInEditor,
  ...rest
}) => {
  const editorContext = useAEMEditorContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const isInEditor = parentIsInEditor !== undefined ? parentIsInEditor : editorContext.isInEditor;

  // Detect if component content is empty
  useEffect(() => {
    const checkIfEmpty = () => {
      if (!children) {
        setIsEmpty(true);
        return;
      }
      if (typeof children === 'string') {
        setIsEmpty(children.trim() === '');
      } else if (React.isValidElement(children)) {
        setIsEmpty(false);
      }
    };

    checkIfEmpty();
  }, [children]);

  // Click handler for edit mode
  const handleComponentClick = useCallback((e: React.MouseEvent) => {
    if (isInEditor) {
      e.stopPropagation();
      setIsEditing(true);
      // Notify AEM SPA Editor of selection
      if ((window as any).adobeQa) {
        (window as any).adobeQa?.publish?.('cq.contenteditable.internal.EditableComponent.EditableComponent.updated', {
          path: cqPath,
          type: cqType,
        });
      }
    }
  }, [isInEditor, cqPath, cqType]);

  const overlayClasses = [
    'aem-editable-component',
    isInEditor && 'aem-editable-component--editor',
    isEmpty && 'aem-editable-component--empty',
    isEditing && 'aem-editable-component--editing',
  ]
    .filter(Boolean)
    .join(' ');

  // In edit mode with empty content, show placeholder
  if (isInEditor && isEmpty && editConfig?.emptyLabel) {
    return (
      <div
        className={overlayClasses}
        data-path={cqPath}
        data-cq-component-type={cqType}
        data-empty-label={editConfig.emptyLabel}
        onClick={handleComponentClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleComponentClick(e as any);
          }
        }}
      >
        <div className="aem-editable-component__placeholder">
          <svg
            className="aem-editable-component__icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 2C4.68 2 2 4.68 2 8s2.68 6 6 6 6-2.68 6-6-2.68-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
              fill="currentColor"
            />
          </svg>
          <span>{editConfig.emptyLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={overlayClasses}
      data-path={cqPath}
      data-cq-component-type={cqType}
      onClick={handleComponentClick}
      {...rest}
    >
      {children}
    </div>
  );
};

EditableComponent.displayName = 'EditableComponent';

/**
 * Provider component for AEM editor context
 */
export interface AEMEditorProviderProps {
  isInEditor?: boolean;
  cqPath?: string;
  onComponentUpdate?: (path: string, updates: Record<string, any>) => void;
  children: React.ReactNode;
}

export const AEMEditorProvider: React.FC<AEMEditorProviderProps> = ({
  isInEditor = false,
  cqPath,
  onComponentUpdate,
  children,
}) => {
  return (
    <AEMEditorContext.Provider value={{ isInEditor, cqPath, onComponentUpdate }}>
      {children}
    </AEMEditorContext.Provider>
  );
};

AEMEditorProvider.displayName = 'AEMEditorProvider';
