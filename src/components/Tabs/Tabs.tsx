/**
 * Tabs Component
 * Tabbed content container with keyboard navigation
 */

import React, { useState } from 'react';
import { AEMComponentProps } from '../../core/types';
import { MapTo } from '../../core/MapTo';
import './Tabs.css';

export interface TabItem {
  label: string;
  content: React.ReactNode;
  id?: string;
}

export interface TabsProps extends AEMComponentProps {
  tabs?: TabItem[];
  defaultTabIndex?: number;
  className?: string;
}

const TabsComponent: React.FC<TabsProps> = ({
  tabs,
  defaultTabIndex = 0,
  className = '',
  isInEditor,
  ...rest
}) => {
  const [activeTab, setActiveTab] = useState(defaultTabIndex);

  if (!tabs || tabs.length === 0) {
    if (isInEditor) {
      return (
        <div className={`aem-tabs aem-tabs--empty ${className}`} {...rest}>
          <div className="aem-tabs__placeholder">No tabs configured</div>
        </div>
      );
    }
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowLeft' && index > 0) {
      setActiveTab(index - 1);
    } else if (e.key === 'ArrowRight' && index < tabs.length - 1) {
      setActiveTab(index + 1);
    } else if (e.key === 'Home') {
      setActiveTab(0);
    } else if (e.key === 'End') {
      setActiveTab(tabs.length - 1);
    }
  };

  return (
    <div className={`aem-tabs ${className}`} {...rest}>
      <div className="aem-tabs__header" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id || index}
            className={`aem-tabs__tab ${activeTab === index ? 'aem-tabs__tab--active' : ''}`}
            onClick={() => setActiveTab(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`panel-${tab.id || index}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="aem-tabs__content">
        {tabs.map((tab, index) => (
          <div
            key={tab.id || index}
            className={`aem-tabs__panel ${activeTab === index ? 'aem-tabs__panel--active' : ''}`}
            id={`panel-${tab.id || index}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id || index}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

TabsComponent.displayName = 'Tabs';

export const Tabs = MapTo('aem-react-toolkit/components/tabs')(TabsComponent);

export default Tabs;
