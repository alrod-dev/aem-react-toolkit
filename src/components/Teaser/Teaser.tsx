/**
 * Teaser Component
 * Image + title + description + CTA pattern
 */

import React from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Teaser.css';

export interface TeaserProps extends AEMComponentProps {
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
}

const TeaserComponent: React.FC<TeaserProps> = ({
  imageSrc,
  imageAlt,
  title,
  description,
  linkText,
  linkHref,
  className = '',
  isInEditor,
  ...rest
}) => {
  const hasContent = imageSrc || title || description;

  if (!hasContent) {
    if (isInEditor) {
      return (
        <div className={`aem-teaser aem-teaser--empty ${className}`} {...rest}>
          <div className="aem-teaser__placeholder">Configure teaser component</div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`aem-teaser ${className}`} {...rest}>
      {imageSrc && (
        <div className="aem-teaser__image">
          <img src={imageSrc} alt={imageAlt || title || 'Teaser'} />
        </div>
      )}

      <div className="aem-teaser__content">
        {title && <h3 className="aem-teaser__title">{title}</h3>}
        {description && <p className="aem-teaser__description">{description}</p>}
        {linkText && linkHref && (
          <a href={linkHref} className="aem-teaser__link">
            {linkText}
          </a>
        )}
      </div>
    </div>
  );
};

TeaserComponent.displayName = 'Teaser';

export const Teaser = MapTo('aem-react-toolkit/components/teaser')(TeaserComponent);

export default Teaser;
