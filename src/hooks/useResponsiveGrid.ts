/**
 * useResponsiveGrid Hook
 * Utilities for responsive grid layout
 */

import { useEffect, useState } from 'react';
import { AEM_BREAKPOINTS } from '../core/ResponsiveGrid';

/**
 * Hook to get current breakpoint
 */
export function useResponsiveBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<string>('desktop');

  useEffect(() => {
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

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

/**
 * Hook to get responsive grid columns for current breakpoint
 */
export function useGridColumns() {
  const breakpoint = useResponsiveBreakpoint();
  const bp = Object.values(AEM_BREAKPOINTS).find((b) => b.name === breakpoint);

  return bp?.columns || 12;
}

/**
 * Hook to check if at specific breakpoint or larger
 */
export function useMediaQuery(breakpoint: string): boolean {
  const [matches, setMatches] = useState(false);
  const bp = Object.values(AEM_BREAKPOINTS).find((b) => b.name === breakpoint);

  useEffect(() => {
    if (!bp) return;

    const mediaQuery = window.matchMedia(`(min-width: ${bp.width}px)`);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint, bp]);

  return matches;
}

/**
 * Hook to get width in grid columns
 */
export function useResponsiveWidth(colSpan: string) {
  const currentBreakpoint = useResponsiveBreakpoint();
  const gridColumns = useGridColumns();

  // Parse colSpan format: "phone-4 tablet-6 desktop-12"
  const parseColSpan = (span: string, bp: string): number => {
    const parts = span.split(' ');
    const rule = parts.find((part) => part.startsWith(bp + '-'));
    if (rule) {
      const [, cols] = rule.split('-');
      return parseInt(cols, 10);
    }
    return gridColumns;
  };

  const cols = parseColSpan(colSpan, currentBreakpoint);
  return (cols / gridColumns) * 100;
}
