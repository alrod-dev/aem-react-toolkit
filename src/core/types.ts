/**
 * AEM React Toolkit - Core Type Definitions
 * TypeScript interfaces for AEM models, components, and SPA configuration
 */

/**
 * AEM Component Property Configuration
 * Maps to Sling model @Property annotations
 */
export interface AEMProperty {
  name: string;
  type: 'String' | 'Boolean' | 'Long' | 'Double' | 'Date' | 'Reference';
  value?: any;
  required?: boolean;
  description?: string;
}

/**
 * AEM Component Edit Configuration
 * Defines how the component appears in AEM author mode
 */
export interface EditConfig {
  emptyLabel?: string;
  emptyBehavior?: 'keep' | 'remove';
  inPlaceEditingConfig?: Record<string, any>;
}

/**
 * AEM Component Model
 * Represents a mapped Sling model object from AEM
 */
export interface AEMComponent {
  `:type`: string;
  `:itemsOrder`?: string[];
  [key: string]: any;
}

/**
 * AEM Page Model
 * Top-level page structure from AEM SPA Editor
 */
export interface PageModel {
  `:type`: string;
  `:itemsOrder`?: string[];
  `:path`?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

/**
 * AEM Container Item
 * Represents a component within a container/layout
 */
export interface ContainerItem extends AEMComponent {
  `:itemsOrder`?: string[];
}

/**
 * AEM Container Component
 * Layout container that holds child components
 */
export interface Container extends AEMComponent {
  `:items`?: Record<string, ContainerItem>;
  gridColumns?: number;
  layout?: 'row' | 'column';
}

/**
 * Content Fragment Reference
 * Links to AEM Content Fragment assets
 */
export interface ContentFragmentRef {
  path: string;
  title?: string;
  description?: string;
}

/**
 * Content Fragment Field
 * Individual field within a Content Fragment
 */
export interface ContentFragmentField {
  name: string;
  type: 'SingleLineText' | 'MultiLineText' | 'RichText' | 'Enum' | 'TagsEnum' | 'DateTime' | 'Decimal' | 'Boolean' | 'ContentFragment' | 'ContentFragmentReference';
  value: any;
}

/**
 * Content Fragment Model
 * AEM Content Fragment with typed fields
 */
export interface ContentFragment {
  id: string;
  title: string;
  description?: string;
  elements?: Record<string, ContentFragmentField>;
  `:type`?: string;
  `:path`?: string;
}

/**
 * Experience Fragment Reference
 * Links to AEM Experience Fragment
 */
export interface ExperienceFragmentRef {
  path: string;
  variation?: string;
  selectors?: string[];
}

/**
 * AEM Link Properties
 * Standard link configuration in AEM
 */
export interface AEMLinkRef {
  href?: string;
  path?: string;
  title?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

/**
 * AEM Image Properties
 * DAM asset reference with sizing
 */
export interface AEMImageRef {
  src?: string;
  path?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

/**
 * Rich Text Editor Output
 * HTML-formatted content from AEM RTE
 */
export interface RTEOutput {
  html: string;
  markup?: 'html' | 'markdown';
}

/**
 * Component Registration Mapping
 * Maps AEM component types to React components
 */
export interface ComponentMapping {
  [componentType: string]: React.ComponentType<any>;
}

/**
 * SPA Model Manager Configuration
 * Configuration for AEM SPA Editor integration
 */
export interface SpaModelManagerConfig {
  modelURL?: string;
  rewriteResourcePath?: (path: string) => string;
  rewriteLink?: (link: string) => string;
}

/**
 * Responsive Breakpoint Configuration
 * Matches AEM ResponsiveGrid breakpoints
 */
export interface BreakpointConfig {
  name: string;
  width: number;
  columns: number;
  gutter?: number;
}

/**
 * Grid Layout Configuration
 * ResponsiveGrid component sizing
 */
export interface GridLayoutConfig {
  columns: number;
  columnWidth?: number;
  gutter?: number;
  breakpoints?: BreakpointConfig[];
}

/**
 * Component Props with AEM Model
 * Base props for all AEM-mapped components
 */
export interface AEMComponentProps {
  cqPath?: string;
  cqType?: string;
  isInEditor?: boolean;
  editConfig?: EditConfig;
  [key: string]: any;
}
