/**
 * Text Component
 * Renders rich text content from AEM RTE with proper HTML handling
 */

import React from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Text.css';

export interface TextProps extends AEMComponentProps {
  text?: string;
  textIsRich?: boolean;
  className?: string;
}

const TextComponent: React.FC<TextProps> = ({
  text,
  textIsRich = false,
  className = '',
  isInEditor,
  editConfig,
  ...rest
}) => {
  if (!text) {
    if (isInEditor && editConfig?.emptyLabel) {
      return (
        <div className={`aem-text aem-text--empty ${className}`} {...rest}>
          <p className="aem-text__placeholder">{editConfig.emptyLabel}</p>
        </div>
      );
    }
    return null;
  }

  // For rich text, we need to sanitize HTML
  // In production, use DOMPurify or similar
  const sanitizeHtml = (html: string): string => {
    // Basic sanitization - remove script tags
    return html.replace(/<script[^>]*>.*?<\/script>/gi, '');
  };

  const content = textIsRich ? sanitizeHtml(text) : text;

  return (
    <div className={`aem-text ${className}`} {...rest}>
      {textIsRich ? (
        <div
          className="aem-text__content aem-text__content--rich"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="aem-text__content">{content}</p>
      )}
    </div>
  );
};

TextComponent.displayName = 'Text';

// Export mapped component
export const Text = MapTo('aem-react-toolkit/components/text')(TextComponent);

export default Text;
