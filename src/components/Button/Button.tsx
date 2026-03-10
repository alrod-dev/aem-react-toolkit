/**
 * Button Component
 * CTA button with link handling and styling
 */

import React from 'react';
import { AEMComponentProps, AEMLinkRef } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Button.css';

export interface ButtonProps extends AEMComponentProps {
  text?: string;
  link?: AEMLinkRef | string;
  style?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  text,
  link,
  style = 'primary',
  size = 'medium',
  className = '',
  onClick,
  isInEditor,
  editConfig,
  ...rest
}) => {
  if (!text) {
    if (isInEditor && editConfig?.emptyLabel) {
      return (
        <div className={`aem-button aem-button--empty ${className}`} {...rest}>
          <div className="aem-button__placeholder">{editConfig.emptyLabel}</div>
        </div>
      );
    }
    return null;
  }

  const getLinkProps = (): React.AnchorHTMLAttributes<HTMLAnchorElement> => {
    if (!link) {
      return {};
    }

    if (typeof link === 'string') {
      return { href: link };
    }

    return {
      href: link.href || link.path || '#',
      title: link.title,
      target: link.target || '_self',
    };
  };

  const linkProps = getLinkProps();
  const buttonClass = `aem-button aem-button--${style} aem-button--${size}`;

  const commonProps = {
    className: `${buttonClass} ${className}`,
    ...rest,
  };

  if (link) {
    return (
      <a {...commonProps} {...linkProps}>
        {text}
      </a>
    );
  }

  return (
    <button {...commonProps} onClick={onClick}>
      {text}
    </button>
  );
};

ButtonComponent.displayName = 'Button';

export const Button = MapTo('aem-react-toolkit/components/button')(ButtonComponent);

export default Button;
