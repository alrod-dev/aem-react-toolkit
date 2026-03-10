/**
 * Responsive Utilities
 * Breakpoint and responsive design helpers matching AEM ResponsiveGrid
 */

export interface Breakpoint {
  name: string;
  width: number;
  columns: number;
  gutter?: number;
}

/**
 * Standard AEM breakpoints matching ResponsiveGrid
 */
export const BREAKPOINTS: Record<string, Breakpoint> = {
  phone: {
    name: 'phone',
    width: 480,
    columns: 4,
    gutter: 20,
  },
  tablet: {
    name: 'tablet',
    width: 768,
    columns: 8,
    gutter: 20,
  },
  desktop: {
    name: 'desktop',
    width: 1024,
    columns: 12,
    gutter: 20,
  },
  wide: {
    name: 'wide',
    width: 1440,
    columns: 12,
    gutter: 20,
  },
};

/**
 * Get breakpoint for given width
 */
export function getBreakpointForWidth(width: number): Breakpoint {
  const sorted = Object.values(BREAKPOINTS).sort((a, b) => b.width - a.width);

  for (const bp of sorted) {
    if (width >= bp.width) {
      return bp;
    }
  }

  return BREAKPOINTS.phone;
}

/**
 * Generate media query for breakpoint
 */
export function generateMediaQuery(breakpointName: string): string {
  const bp = BREAKPOINTS[breakpointName];
  if (!bp) return '';
  return `(min-width: ${bp.width}px)`;
}

/**
 * Generate responsive width CSS variable
 */
export function generateResponsiveCSS(
  baseColumns: number,
  selector?: string
): string {
  const css: string[] = [];

  Object.entries(BREAKPOINTS).forEach(([name, bp]) => {
    const width = (baseColumns / bp.columns) * 100;
    const mediaQuery = generateMediaQuery(name);

    if (selector) {
      css.push(`@media ${mediaQuery} {
  ${selector} {
    width: ${width}%;
  }
}`);
    }
  });

  return css.join('\n');
}

/**
 * Calculate column width percentage
 */
export function calculateColumnWidth(
  colSpan: number,
  totalColumns: number = 12
): number {
  return (colSpan / totalColumns) * 100;
}

/**
 * Get optimal column count for element
 */
export function getOptimalColumns(
  availableWidth: number,
  desiredElementWidth: number
): number {
  const bp = getBreakpointForWidth(availableWidth);
  return Math.floor((desiredElementWidth / availableWidth) * bp.columns);
}

/**
 * Format column span string for ResponsiveGrid
 * @example formatColSpan({ phone: 4, tablet: 6, desktop: 12 })
 * @returns "phone-4 tablet-6 desktop-12"
 */
export function formatColSpan(colSpans: Record<string, number>): string {
  return Object.entries(colSpans)
    .map(([breakpoint, span]) => `${breakpoint}-${span}`)
    .join(' ');
}

/**
 * Parse column span string
 * @example parseColSpan("phone-4 tablet-6 desktop-12")
 * @returns { phone: 4, tablet: 6, desktop: 12 }
 */
export function parseColSpan(colSpanStr: string): Record<string, number> {
  const result: Record<string, number> = {};

  colSpanStr.split(' ').forEach((part) => {
    const [breakpoint, span] = part.split('-');
    if (breakpoint && span) {
      result[breakpoint] = parseInt(span, 10);
    }
  });

  return result;
}

/**
 * Check if viewport matches breakpoint
 */
export function matchesBreakpoint(breakpointName: string, width: number): boolean {
  const bp = BREAKPOINTS[breakpointName];
  if (!bp) return false;

  const nextBp = Object.values(BREAKPOINTS).find(
    (b) => b.width > bp.width && b.columns === bp.columns
  );
  const maxWidth = nextBp ? nextBp.width - 1 : Infinity;

  return width >= bp.width && width <= maxWidth;
}

/**
 * Create responsive className based on breakpoint
 */
export function createResponsiveClass(
  baseClass: string,
  classMap: Record<string, string>
): (width: number) => string {
  return (width: number) => {
    const bp = getBreakpointForWidth(width);
    const additionalClass = classMap[bp.name];
    return additionalClass ? `${baseClass} ${additionalClass}` : baseClass;
  };
}
