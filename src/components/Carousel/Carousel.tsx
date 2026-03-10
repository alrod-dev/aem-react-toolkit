/**
 * Carousel Component
 * Image/content carousel with touch support and keyboard navigation
 */

import React, { useState, useRef, useCallback } from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Carousel.css';

export interface CarouselItem {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

export interface CarouselProps extends AEMComponentProps {
  items?: CarouselItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showIndicators?: boolean;
  showControls?: boolean;
  className?: string;
}

const CarouselComponent: React.FC<CarouselProps> = ({
  items,
  autoplay = false,
  autoplayInterval = 5000,
  showIndicators = true,
  showControls = true,
  className = '',
  isInEditor,
  ...rest
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout>();

  if (!items || items.length === 0) {
    if (isInEditor) {
      return (
        <div className={`aem-carousel aem-carousel--empty ${className}`} {...rest}>
          <div className="aem-carousel__placeholder">No carousel items</div>
        </div>
      );
    }
    return null;
  }

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items!.length);
  }, [items]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items!.length) % items!.length);
  }, [items]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    if (touchStart - touchEnd > 50) {
      next();
    } else if (touchEnd - touchStart > 50) {
      prev();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prev();
    } else if (e.key === 'ArrowRight') {
      next();
    }
  };

  React.useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(next, autoplayInterval);
      return () => clearInterval(autoplayRef.current);
    }
  }, [autoplay, autoplayInterval, next]);

  const currentItem = items[currentIndex];

  return (
    <div
      className={`aem-carousel ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Carousel"
      {...rest}
    >
      <div className="aem-carousel__viewport">
        <div className="aem-carousel__slide">
          <img
            src={currentItem.src}
            alt={currentItem.alt || `Slide ${currentIndex + 1}`}
            className="aem-carousel__image"
          />
          {(currentItem.title || currentItem.description) && (
            <div className="aem-carousel__caption">
              {currentItem.title && (
                <h3 className="aem-carousel__caption-title">{currentItem.title}</h3>
              )}
              {currentItem.description && (
                <p className="aem-carousel__caption-description">{currentItem.description}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showControls && (
        <>
          <button
            className="aem-carousel__control aem-carousel__control--prev"
            onClick={prev}
            aria-label="Previous slide"
          >
            &#10094;
          </button>
          <button
            className="aem-carousel__control aem-carousel__control--next"
            onClick={next}
            aria-label="Next slide"
          >
            &#10095;
          </button>
        </>
      )}

      {showIndicators && (
        <div className="aem-carousel__indicators">
          {items.map((_, index) => (
            <button
              key={index}
              className={`aem-carousel__indicator ${
                index === currentIndex ? 'aem-carousel__indicator--active' : ''
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

CarouselComponent.displayName = 'Carousel';

export const Carousel = MapTo('aem-react-toolkit/components/carousel')(CarouselComponent);

export default Carousel;
