/**
 * Breadcrumb Component
 * Breadcrumb navigation showing page hierarchy
 */

import React from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Breadcrumb.css';

export interface BreadcrumbItem {
  title: string;
  path: string;
  isActive?: boolean;
}

export interface BreadcrumbProps extends AEMComponentProps {
  items?: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className = '',
  ...rest
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      className={`aem-breadcrumb ${className}`}
      aria-label="Breadcrumb"
      {...rest}
    >
      <ol className="aem-breadcrumb__list">
        {items.map((item, index) => (
          <li key={item.path} className="aem-breadcrumb__item">
            {!item.isActive ? (
              <>
                <a href={item.path} className="aem-breadcrumb__link">
                  {item.title}
                </a>
                {index < items.length - 1 && (
                  <span className="aem-breadcrumb__separator">{separator}</span>
                )}
              </>
            ) : (
              <>
                <span className="aem-breadcrumb__current">{item.title}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

BreadcrumbComponent.displayName = 'Breadcrumb';

export const Breadcrumb = MapTo('aem-react-toolkit/components/breadcrumb')(BreadcrumbComponent);

export default Breadcrumb;
