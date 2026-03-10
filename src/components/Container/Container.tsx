/**
 * Container Component
 * Layout container with responsive grid
 */

import React from 'react';
import { Container as ContainerType } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import { ResponsiveGrid } from '../../core/ResponsiveGrid';
import './Container.css';

export interface ContainerProps extends ContainerType {
  children?: React.ReactNode;
  className?: string;
  isInEditor?: boolean;
}

const ContainerComponent: React.FC<ContainerProps> = ({
  ':items': items,
  ':itemsOrder': itemsOrder,
  gridColumns = 12,
  layout = 'row',
  className = '',
  isInEditor,
  children,
  ...rest
}) => {
  return (
    <div
      className={`aem-container aem-container--${layout} ${className}`}
      {...rest}
    >
      <ResponsiveGrid
        items={items}
        itemsOrder={itemsOrder}
        config={{ columns: gridColumns }}
        isInEditor={isInEditor}
      >
        {children}
      </ResponsiveGrid>
    </div>
  );
};

ContainerComponent.displayName = 'Container';

export const Container = MapTo('aem-react-toolkit/components/container')(ContainerComponent);

export default Container;
