/**
 * AEM React Toolkit
 * Main entry point - exports all public APIs
 */

// Core
export { MapTo, getComponentByType, getAllComponentMappings, clearComponentRegistry } from './core/MapTo';
export { EditableComponent, AEMEditorProvider, useAEMEditorContext } from './core/EditableComponent';
export { AEMModelManager, getModelManager, createModelManager } from './core/ModelManager';
export { ResponsiveGrid, ResponsiveGridItem, useCurrentBreakpoint, AEM_BREAKPOINTS } from './core/ResponsiveGrid';
export { ContentFragmentResolver, getContentFragmentResolver, resolveCFReference } from './core/ContentFragmentResolver';
export { ExperienceFragmentRenderer, ExperienceFragmentWrapper, useExperienceFragment, buildExperienceFragmentUrl } from './core/ExperienceFragmentRenderer';
export { PageModelProvider, getPageModelProvider, usePageModel, ItemsTree } from './core/PageModel';

// Types
export type {
  AEMProperty,
  EditConfig,
  AEMComponent,
  PageModel,
  ContainerItem,
  Container,
  ContentFragmentRef,
  ContentFragmentField,
  ContentFragment,
  ExperienceFragmentRef,
  AEMLinkRef,
  AEMImageRef,
  RTEOutput,
  ComponentMapping,
  SpaModelManagerConfig,
  BreakpointConfig,
  GridLayoutConfig,
  AEMComponentProps,
} from './core/types';

// Components
export { default as Text } from './components/Text/Text';
export { default as Image } from './components/Image/Image';
export { default as Title } from './components/Title/Title';
export { default as Button } from './components/Button/Button';
export { default as Teaser } from './components/Teaser/Teaser';
export { default as List } from './components/List/List';
export { default as Carousel } from './components/Carousel/Carousel';
export { default as Tabs } from './components/Tabs/Tabs';
export { default as Accordion } from './components/Accordion/Accordion';
export { default as Navigation } from './components/Navigation/Navigation';
export { default as Breadcrumb } from './components/Breadcrumb/Breadcrumb';
export { default as Container } from './components/Container/Container';
export { default as Separator } from './components/Separator/Separator';
export { default as Embed } from './components/Embed/Embed';
export { default as ContentFragment } from './components/ContentFragment/ContentFragment';

// Hooks
export { useAEMModel, useAEMComponent, useAEMProperty } from './hooks/useAEMModel';
export { useEditMode, useEditorInfo } from './hooks/useEditMode';
export { useContentFragment, useContentFragmentsByTag, useContentFragmentField } from './hooks/useContentFragment';
export { useResponsiveBreakpoint, useGridColumns, useMediaQuery, useResponsiveWidth } from './hooks/useResponsiveGrid';

// Utils
export {
  resolvePath,
  rewriteLink,
  extractPlainText,
  processRTEOutput,
  getLocaleFromPath,
  buildAssetUrl,
  isExternalLink,
  sanitizeProperty,
  parseSlingModel,
  createPropertyMap,
} from './utils/aem-helpers';

export {
  BREAKPOINTS,
  getBreakpointForWidth,
  generateMediaQuery,
  generateResponsiveCSS,
  calculateColumnWidth,
  getOptimalColumns,
  formatColSpan,
  parseColSpan,
  matchesBreakpoint,
  createResponsiveClass,
} from './utils/responsive';

export {
  extractMetadata,
  extractProperties,
  getComponentType,
  getComponentPath,
  hasChildren,
  getChildren,
  getChildrenOrder,
  forEachChild,
  mapChildren,
  findChildByType,
  filterChildrenByType,
  flattenModel,
  getProperty,
  hasProperty,
  toPropertyMap,
  createComponentModel,
  validateModel,
} from './utils/sling-models';
