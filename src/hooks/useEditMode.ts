/**
 * useEditMode Hook
 * Detect AEM author mode vs publish mode
 */

import { useEffect, useState } from 'react';

/**
 * Detect if component is in AEM author/edit mode
 */
export function useEditMode(): boolean {
  const [isInEditor, setIsInEditor] = useState(false);

  useEffect(() => {
    // Check for AEM author mode indicators
    const inEditor =
      typeof window !== 'undefined' &&
      !!(window as any).adobeQa &&
      typeof (window as any).adobeQa === 'object';

    setIsInEditor(inEditor);

    // Listen for changes
    const handleEditorStateChange = () => {
      const updated = !!(window as any).adobeQa;
      setIsInEditor(updated);
    };

    window.addEventListener('aem.editor.loaded', handleEditorStateChange);
    window.addEventListener('aem.editor.unloaded', handleEditorStateChange);

    return () => {
      window.removeEventListener('aem.editor.loaded', handleEditorStateChange);
      window.removeEventListener('aem.editor.unloaded', handleEditorStateChange);
    };
  }, []);

  return isInEditor;
}

/**
 * Get more detailed editor information
 */
export function useEditorInfo() {
  const isInEditor = useEditMode();

  return {
    isInEditor,
    editorVersion: typeof window !== 'undefined' ? (window as any).adobeQa?.version : undefined,
    canEdit: isInEditor,
  };
}
