/**
 * Text Component Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import TextComponent from './Text';

describe('Text Component', () => {
  beforeEach(() => {
    // Reset any mocks
  });

  it('renders plain text content', () => {
    render(<TextComponent text="Hello, World!" textIsRich={false} />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('renders rich text content as HTML', () => {
    const richText = '<p>Hello <strong>World</strong></p>';
    const { container } = render(<TextComponent text={richText} textIsRich={true} />);

    const richContent = container.querySelector('.aem-text__content--rich');
    expect(richContent?.innerHTML).toContain('<strong>World</strong>');
  });

  it('returns null when text is not provided', () => {
    const { container } = render(<TextComponent />);
    expect(container.firstChild).toBeNull();
  });

  it('shows empty placeholder in editor mode', () => {
    const { container } = render(
      <TextComponent isInEditor={true} editConfig={{ emptyLabel: 'Add text' }} />
    );

    expect(screen.getByText('Add text')).toBeInTheDocument();
    expect(container.querySelector('.aem-text--empty')).toBeInTheDocument();
  });

  it('sanitizes script tags from rich text', () => {
    const maliciousText =
      '<p>Hello</p><script>alert("xss")</script><p>World</p>';
    const { container } = render(
      <TextComponent text={maliciousText} textIsRich={true} />
    );

    const html = container.querySelector('.aem-text__content--rich')?.innerHTML;
    expect(html).not.toContain('script');
    expect(html).toContain('Hello');
    expect(html).toContain('World');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TextComponent text="Test" className="custom-class" />
    );

    expect(container.querySelector('.aem-text.custom-class')).toBeInTheDocument();
  });
});
