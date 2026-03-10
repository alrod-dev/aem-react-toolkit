/**
 * ResponsiveGrid - AEM Layout Container Component
 * Implements responsive grid matching AEM's ResponsiveGrid system
 * Supports 12-column layout with dynamic breakpoints
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Container, GridLayoutConfig } from './types';

/**
 * Standard AEM breakpoints
 */
export const AEM_BREAKPOINTS = {
  phone: { name: 'phone', width: 480, columns: 4 },
  tablet: { name: 'tablet', width: 768, columns: 8 },
  desktop: { name: 'desktop', width: 1024, columns: 12 },
  wide: { name: 'wide', width: 1440, columns: 12 },
} as const;

export interface ResponsiveGridProps extends Omit<Container, ':items'> {
  items?: Record<string, any>;
  children?: React.ReactNode;
  config?: Partial<GridLayoutConfig>;
  className?: string;
  cqPath?: string;
  isInEditor?: boolean;
  onItemsChange?: (items: Record<string, any>) => void;
}

/**
 * Calculate column span from component property
 * AEM ResponsiveGrid uses colSpan property (e.g., 'phone-4 tablet-6 desktop-12')
 */
export function parseColSpan(colSpanStr?: string, breakpoint: string = 'desktop'): number {
  if (!colSpanStr) {
    return 12; // Default full width
  }

  // Parse format: "phone-4 tablet-6 desktop-12"
  const parts = colSpanStr.split(' ');
  const breakpointRule = parts.find((part) => part.startsWith(breakpoint + '-'));

  if (breakpointRule) {
    const [, span] = breakpointRule.split('-');
    return parseInt(span, 10) || 12;
  }

  // Fallback to full width
  return 12;
}

/**
 * Calculate grid item width percentage
 */
export function calculateItemWidth(colSpan: number, totalColumns: number = 12): number {
  return (colSpan / totalColumns) * 100;
}

/**
 * ResponsiveGridItem - Individual grid cell
 */
export interface ResponsiveGridItemProps {
  colSpan?: string;
  children: React.ReactNode;
  breakpoint?: string;
  totalColumns?: number;
  isInEditor?: boolean;
  className?: string;
  name?: string;
}

export const ResponsiveGridItem: React.FC<ResponsiveGridItemProps> = ({
  colSpan,
  children,
  breakpoint = 'desktop',
  totalColumns = 12,
  isInEditor,
  className,
  name,
}) => {
  const span = useMemo(() => parseColSpan(colSpan, breakpoint), [colSpan, breakpoint]);
  const widthPercent = useMemo(() => calculateItemWidth(span, totalColumns), [span, totalColumns]);

  const itemClassName = classNames(
    'aem-responsive-grid__item',
    {
      'aem-responsive-grid__item--editor': isInEditor,
    },
    className
  );

  return (
    <div
      className={itemClassName}
      style={{
        width: `${widthPercent}%`,
        minHeight: isInEditor ? '200px' : undefined,
      }}
      data-component-name={name}
      data-col-span={colSpan}
    >
      {children}
    </div>
  );
};

ResponsiveGridItem.displayName = 'ResponsiveGridItem';

/**
 * Detect current viewport breakpoint
 */
export function useCurrentBreakpoint(): string {
  const [breakpoint, setBreakpoint] = React.useState<string>('desktop');

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 480) {
        setBreakpoint('phone');
      } else if (width < 768) {
        setBreakpoint('tablet');
      } else if (width < 1440) {
        setBreakpoint('desktop');
      } else {
        setBreakpoint('wide');
      }
    };

    // Initial check
    handleResize();

    // Listen to window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

/**
 * ResponsiveGrid - Main grid container
 * Manages responsive layout with multiple breakpoints
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  items,
  children,
  config,
  className,
  cqPath,
  isInEditor = false,
  onItemsChange,
  ':itemsOrder': itemsOrder,
  ...rest
}) => {
  const currentBreakpoint = useCurrentBreakpoint();

  const defaultConfig: GridLayoutConfig = {
    columns: 12,
    columnWidth: 80,
    gutter: 20,
    breakpoints: Object.values(AEM_BREAKPOINTS),
    ...config,
  };

  const gridClassName = classNames(
    'aem-responsive-grid',
    {
      'aem-responsive-grid--editor': isInEditor,
      [`aem-responsive-grid--${currentBreakpoint}`]: currentBreakpoint,
    },
    className
  );

  const itemsArray = useMemo(() => {
    if (!items) {
      return [];
    }

    // Sort items by itemsOrder if available
    const order = itemsOrder || Object.keys(items);
    return order.filter((key) => items[key]);
  }, [items, itemsOrder]);

  return (
    <div
      className={gridClassName}
      data-path={cqPath}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${defaultConfig.gutter}px`,
      }}
      {...rest}
    >
      {itemsArray.map((itemKey) => {
        const item = items?.[itemKey];
        if (!item) {
          return null;
        }

        return (
          <ResponsiveGridItem
            key={itemKey}
            colSpan={item.colSpan}
            breakpoint={currentBreakpoint}
            totalColumns={defaultConfig.columns}
            isInEditor={isInEditor}
            name={itemKey}
          >
            {children}
          </ResponsiveGridItem>
        );
      })}

      {!itemsArray.length && children && (
        <div
          className="aem-responsive-grid__empty"
          style={{
            width: '100%',
            padding: '20px',
            textAlign: 'center',
            color: '#999',
          }}
        >
          {isInEditor && <p>Drag components here to add to the grid</p>}
        </div>
      )}
    </div>
  );
};

ResponsiveGrid.displayName = 'ResponsiveGrid';

/**
 * CSS media query utility for responsive styles
 */
export function getResponsiveMediaQuery(breakpoint: string): string {
  const bp = Object.values(AEM_BREAKPOINTS).find((b) => b.name === breakpoint);
  if (!bp) {
    return '';
  }
  return `@media (min-width: ${bp.width}px)`;
}
