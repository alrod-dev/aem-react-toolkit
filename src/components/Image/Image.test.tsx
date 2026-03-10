/**
 * Image Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImageComponent from './Image';

describe('Image Component', () => {
  it('renders image with src and alt', () => {
    render(
      <ImageComponent
        src="/images/test.jpg"
        alt="Test image"
        data-testid="test-img"
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('src', '/images/test.jpg');
  });

  it('applies lazy loading by default', () => {
    render(<ImageComponent src="/images/test.jpg" alt="Test" />);
    const img = screen.getByAltText('Test');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('disables lazy loading when lazy prop is false', () => {
    render(<ImageComponent src="/images/test.jpg" alt="Test" lazy={false} />);
    const img = screen.getByAltText('Test');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('sets aspect ratio padding when width and height provided', () => {
    const { container } = render(
      <ImageComponent src="/images/test.jpg" alt="Test" width={800} height={600} />
    );

    const wrapper = container.querySelector('.aem-image__wrapper');
    expect(wrapper).toHaveStyle('padding-bottom: 75%');
  });

  it('shows empty placeholder in editor mode without src', () => {
    const { container } = render(<ImageComponent isInEditor={true} />);
    expect(container.querySelector('.aem-image--empty')).toBeInTheDocument();
    expect(screen.getByText('Click to configure image')).toBeInTheDocument();
  });

  it('returns null when no src in non-editor mode', () => {
    const { container } = render(<ImageComponent />);
    expect(container.firstChild).toBeNull();
  });

  it('renders caption from alt text', () => {
    const { container } = render(
      <ImageComponent src="/images/test.jpg" alt="Test caption" />
    );
    expect(screen.getByText('Test caption')).toBeInTheDocument();
    expect(container.querySelector('.aem-image__caption')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ImageComponent src="/images/test.jpg" alt="Test" className="custom-class" />
    );
    expect(container.querySelector('.aem-image.custom-class')).toBeInTheDocument();
  });
});
