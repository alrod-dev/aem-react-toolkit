/**
 * Accordion Component
 * Expandable content sections
 */

import React, { useState } from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Accordion.css';

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
  id?: string;
  expanded?: boolean;
}

export interface AccordionProps extends AEMComponentProps {
  items?: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

const AccordionComponent: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
  isInEditor,
  ...rest
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(() => {
    const expanded = new Set<number>();
    items?.forEach((item, index) => {
      if (item.expanded) {
        expanded.add(index);
      }
    });
    return expanded;
  });

  if (!items || items.length === 0) {
    if (isInEditor) {
      return (
        <div className={`aem-accordion aem-accordion--empty ${className}`} {...rest}>
          <div className="aem-accordion__placeholder">No accordion items configured</div>
        </div>
      );
    }
    return null;
  }

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);

    if (!allowMultiple) {
      newExpanded.clear();
    }

    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }

    setExpandedItems(newExpanded);
  };

  return (
    <div className={`aem-accordion ${className}`} {...rest}>
      {items.map((item, index) => (
        <div key={item.id || index} className="aem-accordion__item">
          <button
            className={`aem-accordion__trigger ${
              expandedItems.has(index) ? 'aem-accordion__trigger--expanded' : ''
            }`}
            onClick={() => toggleItem(index)}
            aria-expanded={expandedItems.has(index)}
            aria-controls={`panel-${item.id || index}`}
          >
            <span className="aem-accordion__title">{item.title}</span>
            <span className="aem-accordion__icon">+</span>
          </button>

          {expandedItems.has(index) && (
            <div
              className="aem-accordion__panel"
              id={`panel-${item.id || index}`}
              role="region"
            >
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

AccordionComponent.displayName = 'Accordion';

export const Accordion = MapTo('aem-react-toolkit/components/accordion')(AccordionComponent);

export default Accordion;
