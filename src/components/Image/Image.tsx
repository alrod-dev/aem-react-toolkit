/**
 * Image Component
 * AEM DAM-integrated image with responsive sizing and lazy loading
 */

import React, { useMemo } from 'react';
import { AEMComponentProps, AEMImageRef } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Image.css';

export interface ImageProps extends AEMComponentProps {
  src?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  srcset?: string;
  sizes?: string;
  className?: string;
}

const ImageComponent: React.FC<ImageProps> = ({
  src,
  alt = '',
  title,
  width,
  height,
  lazy = true,
  srcset,
  sizes,
  className = '',
  isInEditor,
  ...rest
}) => {
  const aspectRatio = useMemo(() => {
    if (width && height) {
      return (height / width) * 100;
    }
    return undefined;
  }, [width, height]);

  if (!src) {
    if (isInEditor) {
      return (
        <div className={`aem-image aem-image--empty ${className}`} {...rest}>
          <div className="aem-image__placeholder">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M42 6H6c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h36c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4zm-4 24l-7-9-5 7-7-9H8v16h30v-5z"
                fill="currentColor"
              />
            </svg>
            <p>Click to configure image</p>
          </div>
        </div>
      );
    }
    return null;
  }

  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    src,
    alt,
    title,
    loading: lazy ? 'lazy' : 'eager',
    className: 'aem-image__img',
  };

  if (width && !height) {
    imgProps.width = width;
  } else if (height && !width) {
    imgProps.height = height;
  } else if (width && height) {
    imgProps.width = width;
    imgProps.height = height;
  }

  if (srcset) {
    imgProps.srcSet = srcset;
  }
  if (sizes) {
    imgProps.sizes = sizes;
  }

  return (
    <figure className={`aem-image ${className}`} {...rest}>
      <div
        className="aem-image__wrapper"
        style={
          aspectRatio
            ? {
                paddingBottom: `${aspectRatio}%`,
              }
            : {}
        }
      >
        <img {...imgProps} />
      </div>
      {alt && <figcaption className="aem-image__caption">{alt}</figcaption>}
    </figure>
  );
};

ImageComponent.displayName = 'Image';

export const Image = MapTo('aem-react-toolkit/components/image')(ImageComponent);

export default Image;
