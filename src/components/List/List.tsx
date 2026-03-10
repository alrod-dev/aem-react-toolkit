/**
 * List Component
 * Dynamic list supporting children pages, fixed items, and search
 */

import React from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './List.css';

export interface ListItem {
  path: string;
  title: string;
  description?: string;
}

export interface ListProps extends AEMComponentProps {
  items?: ListItem[];
  listType?: 'unordered' | 'ordered';
  maxItems?: number;
  linkItems?: boolean;
  className?: string;
}

const ListComponent: React.FC<ListProps> = ({
  items,
  listType = 'unordered',
  maxItems,
  linkItems = false,
  className = '',
  isInEditor,
  ...rest
}) => {
  if (!items || items.length === 0) {
    if (isInEditor) {
      return (
        <div className={`aem-list aem-list--empty ${className}`} {...rest}>
          <p>No list items configured</p>
        </div>
      );
    }
    return null;
  }

  const displayItems = maxItems ? items.slice(0, maxItems) : items;
  const Tag = listType === 'ordered' ? 'ol' : 'ul';

  return (
    <Tag className={`aem-list aem-list--${listType} ${className}`} {...rest}>
      {displayItems.map((item, index) => (
        <li key={item.path || index} className="aem-list__item">
          {linkItems && item.path ? (
            <a href={item.path} className="aem-list__link">
              {item.title}
            </a>
          ) : (
            <span>{item.title}</span>
          )}
          {item.description && (
            <p className="aem-list__description">{item.description}</p>
          )}
        </li>
      ))}
    </Tag>
  );
};

ListComponent.displayName = 'List';

export const List = MapTo('aem-react-toolkit/components/list')(ListComponent);

export default List;
