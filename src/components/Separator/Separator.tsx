/**
 * Separator Component
 * Visual content separator
 */

import React from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Separator.css';

export interface SeparatorProps extends AEMComponentProps {
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  className?: string;
}

const SeparatorComponent: React.FC<SeparatorProps> = ({
  style = 'solid',
  color = '#e0e0e0',
  className = '',
  ...rest
}) => {
  return (
    <div
      className={`aem-separator aem-separator--${style} ${className}`}
      style={{ borderTopColor: color }}
      role="presentation"
      {...rest}
    />
  );
};

SeparatorComponent.displayName = 'Separator';

export const Separator = MapTo('aem-react-toolkit/components/separator')(SeparatorComponent);

export default Separator;
