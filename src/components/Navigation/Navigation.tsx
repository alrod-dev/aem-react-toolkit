/**
 * Navigation Component
 * Multi-level navigation from page tree
 */

import React, { useState } from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Navigation.css';

export interface NavigationNode {
  title: string;
  path: string;
  children?: NavigationNode[];
  active?: boolean;
}

export interface NavigationProps extends AEMComponentProps {
  items?: NavigationNode[];
  maxDepth?: number;
  className?: string;
}

interface NavItemProps {
  node: NavigationNode;
  depth: number;
  maxDepth?: number;
  onNavigate?: (path: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ node, depth, maxDepth, onNavigate }) => {
  const [expanded, setExpanded] = useState(node.active || false);
  const hasChildren = node.children && node.children.length > 0;
  const shouldRender = !maxDepth || depth < maxDepth;

  if (!shouldRender) {
    return null;
  }

  return (
    <li className={`aem-nav__item ${node.active ? 'aem-nav__item--active' : ''}`}>
      <div className="aem-nav__item-content">
        <a
          href={node.path}
          className="aem-nav__link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.(node.path);
          }}
        >
          {node.title}
        </a>
        {hasChildren && (
          <button
            className={`aem-nav__toggle ${expanded ? 'aem-nav__toggle--expanded' : ''}`}
            onClick={() => setExpanded(!expanded)}
            aria-label={`Toggle ${node.title} submenu`}
          >
            ▾
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <ul className="aem-nav__submenu">
          {node.children?.map((child) => (
            <NavItem
              key={child.path}
              node={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const NavigationComponent: React.FC<NavigationProps> = ({
  items,
  maxDepth,
  className = '',
  isInEditor,
  ...rest
}) => {
  const handleNavigate = (path: string) => {
    // In a real app, this would use React Router
    window.location.href = path;
  };

  if (!items || items.length === 0) {
    if (isInEditor) {
      return (
        <nav className={`aem-nav aem-nav--empty ${className}`} {...rest}>
          <p>No navigation items configured</p>
        </nav>
      );
    }
    return null;
  }

  return (
    <nav className={`aem-nav ${className}`} {...rest}>
      <ul className="aem-nav__menu">
        {items.map((item) => (
          <NavItem
            key={item.path}
            node={item}
            depth={0}
            maxDepth={maxDepth}
            onNavigate={handleNavigate}
          />
        ))}
      </ul>
    </nav>
  );
};

NavigationComponent.displayName = 'Navigation';

export const Navigation = MapTo('aem-react-toolkit/components/navigation')(NavigationComponent);

export default Navigation;
