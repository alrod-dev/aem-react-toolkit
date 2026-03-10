/**
 * Title Component
 * Flexible heading component with configurable heading level
 */

import React from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Title.css';

export interface TitleProps extends AEMComponentProps {
  text?: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

const TitleComponent: React.FC<TitleProps> = ({
  text,
  type = 'h2',
  className = '',
  isInEditor,
  editConfig,
  ...rest
}) => {
  if (!text) {
    if (isInEditor && editConfig?.emptyLabel) {
      return (
        <div className={`aem-title aem-title--empty ${className}`} {...rest}>
          <p className="aem-title__placeholder">{editConfig.emptyLabel}</p>
        </div>
      );
    }
    return null;
  }

  const Tag = type;

  return (
    <Tag className={`aem-title aem-title--${type} ${className}`} {...rest}>
      {text}
    </Tag>
  );
};

TitleComponent.displayName = 'Title';

export const Title = MapTo('aem-react-toolkit/components/title')(TitleComponent);

export default Title;
