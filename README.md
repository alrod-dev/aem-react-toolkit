# AEM React Toolkit

[![npm version](https://img.shields.io/npm/v/aem-react-toolkit.svg)](https://www.npmjs.com/package/aem-react-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional, production-ready toolkit for integrating React with Adobe AEM's SPA Editor. Built on deep enterprise experience with AEM + React solutions at Gorilla Group.

## Overview

**AEM React Toolkit** provides a comprehensive set of utilities, components, and hooks for building modern Single Page Applications (SPAs) that seamlessly integrate with Adobe AEM's SPA Editor. It abstracts away the complexity of AEM-React integration while maintaining full flexibility for enterprise requirements.

### Key Features

- **MapTo Component Mapping** - Declarative mapping of AEM components to React
- **SPA Editor Integration** - Full support for AEM author mode editing
- **Content Fragment Resolution** - Easy Content Fragment and Experience Fragment handling
- **Responsive Grid** - AEM-compatible 12-column responsive layout system
- **Rich Components** - 15+ pre-built, production-ready components
- **TypeScript First** - Full type safety with comprehensive interfaces
- **Custom Hooks** - React hooks for model management, edit mode detection, and more
- **Utilities** - Path resolution, link rewriting, RTE processing, and Sling model helpers

## Installation

```bash
npm install aem-react-toolkit
# or
yarn add aem-react-toolkit
```

### Peer Dependencies

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

## Quick Start

### 1. Initialize Model Manager

```tsx
import { getModelManager } from 'aem-react-toolkit';

// Initialize with your AEM instance
const modelManager = getModelManager();
```

### 2. Create a Mapped Component

```tsx
import React from 'react';
import { MapTo } from 'aem-react-toolkit';

const TextComponent: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-component">
    {text}
  </div>
);

export default MapTo('my-app/components/text')(TextComponent);
```

### 3. Use in Your SPA

```tsx
import { PageModel, Text } from 'aem-react-toolkit';

const Page: React.FC = () => {
  const { model } = usePageModel('/content/mysite/en/home');

  return (
    <div>
      {model && (
        <>
          <h1>{model.title}</h1>
          <Text {...model.text} />
        </>
      )}
    </div>
  );
};
```

## Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   AEM Author (Edit Mode)                     │
│                    ↓                                          │
│            AEM SPA Editor Framework                          │
│                    ↓                                          │
├─────────────────────────────────────────────────────────────┤
│                    Page Model (JSON)                          │
│  { ":type": "...", "text": {...}, "image": {...} }          │
│                    ↓                                          │
├─────────────────────────────────────────────────────────────┤
│            ModelManager (Fetches & Subscribes)              │
│                    ↓                                          │
├─────────────────────────────────────────────────────────────┤
│              MapTo Registry & Component Lookup               │
│    ":type" → React Component Mapping                         │
│                    ↓                                          │
├─────────────────────────────────────────────────────────────┤
│         React Components (with EditableComponent)           │
│  <Text /> <Image /> <Container /> <ResponsiveGrid />        │
│                    ↓                                          │
└─────────────────────────────────────────────────────────────┘
                  Rendered SPA
```

## Components

### Built-in Components (15)

#### Content Display
- **Text** - Rich text with RTE support
- **Image** - Responsive DAM images with lazy loading
- **Title** - Configurable heading levels
- **Teaser** - Image + title + description + CTA pattern
- **ContentFragment** - AEM Content Fragment renderer

#### User Interaction
- **Button** - CTA button with multiple styles
- **List** - Dynamic lists with optional links
- **Carousel** - Touch-enabled image carousel

#### Layout & Structure
- **Container** - Flexible layout wrapper
- **ResponsiveGrid** - 12-column responsive grid
- **Separator** - Visual content divider

#### Navigation
- **Navigation** - Multi-level site navigation
- **Breadcrumb** - Breadcrumb navigation trail

#### Interactive Content
- **Tabs** - Keyboard-accessible tab panels
- **Accordion** - Expandable content sections
- **Embed** - External embeds (YouTube, social, iframe)

## Hooks

```tsx
// Page model management
const { model, loading, error, currentPath } = useAEMModel(path);

// Edit mode detection
const isInEditor = useEditMode();
const { isInEditor, canEdit } = useEditorInfo();

// Content Fragment handling
const { fragment, loading } = useContentFragment('/content/dam/my-fragment');
const { fragments } = useContentFragmentsByTag('featured');
const fieldValue = useContentFragmentField(path, 'title');

// Responsive grid
const breakpoint = useResponsiveBreakpoint();
const columns = useGridColumns();
const isTablet = useMediaQuery('tablet');
const widthPercent = useResponsiveWidth('phone-4 tablet-6 desktop-12');
```

## Utilities

### AEM Helpers

```tsx
import {
  resolvePath,
  rewriteLink,
  extractPlainText,
  processRTEOutput,
  buildAssetUrl,
  getLocaleFromPath,
} from 'aem-react-toolkit';

// Path resolution
const path = resolvePath('/content/sites/mysite/en/home');

// Link rewriting
const link = rewriteLink('/content/sites/mysite/en/products');

// RTE processing
const text = extractPlainText('<p>Hello <strong>World</strong></p>');

// Asset optimization
const optimizedUrl = buildAssetUrl('/content/dam/image.jpg', {
  width: 800,
  quality: 80,
  format: 'webp',
});

// Locale detection
const locale = getLocaleFromPath('/content/sites/mysite/en/home');
```

### Sling Model Utilities

```tsx
import {
  getComponentType,
  hasChildren,
  getChildren,
  mapChildren,
  filterChildrenByType,
  getProperty,
} from 'aem-react-toolkit';

const type = getComponentType(model);
const children = getChildren(model);
const value = getProperty(model, 'title', 'Default Title');
```

### Responsive Utilities

```tsx
import {
  BREAKPOINTS,
  formatColSpan,
  parseColSpan,
  generateMediaQuery,
  calculateColumnWidth,
} from 'aem-react-toolkit';

const colSpan = formatColSpan({ phone: 4, tablet: 6, desktop: 12 });
const parsed = parseColSpan('phone-4 tablet-6 desktop-12');
const mediaQuery = generateMediaQuery('tablet');
```

## API Reference

### MapTo Decorator

```tsx
MapTo(resourceType: string, editConfig?: EditConfig)(Component)
```

Maps an AEM component resource type to a React component.

**Parameters:**
- `resourceType` - AEM component resource type (e.g., 'my-app/components/text')
- `editConfig` - Optional configuration for author mode

**Example:**
```tsx
export default MapTo('my-app/components/hero', {
  emptyLabel: 'Click to add hero content'
})(HeroComponent);
```

### Model Manager

```tsx
const manager = getModelManager();
await manager.fetchModel(path);
manager.subscribe(path, (model) => {});
```

### Page Model Provider

```tsx
const provider = getPageModelProvider();
const model = provider.getCurrentModel();
provider.subscribe((model) => {});
```

## Migration Guide

### From HTL/Sightly to React SPA

See [MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md) for detailed step-by-step instructions.

## AEM Setup

See [AEM_SETUP.md](./docs/AEM_SETUP.md) for AEM instance configuration and SPA Editor setup.

## Component Mapping

See [COMPONENT_MAPPING.md](./docs/COMPONENT_MAPPING.md) for component mapping patterns and best practices.

## Advanced Usage

### Custom Edit Config

```tsx
MapTo('my-app/components/text', {
  emptyLabel: 'Click to add text',
  emptyBehavior: 'keep',
  inPlaceEditingConfig: {
    active: true,
  }
})(Component);
```

### Experience Fragments

```tsx
import { ExperienceFragmentRenderer } from 'aem-react-toolkit';

<ExperienceFragmentRenderer
  fragmentPath="/content/experience-fragments/mysite/header"
  variation="default"
  onLoad={(html) => console.log('Loaded')}
/>
```

### Responsive Patterns

```tsx
import { ResponsiveGrid, useGridColumns } from 'aem-react-toolkit';

const MyGrid = ({ items }) => {
  const columns = useGridColumns();

  return (
    <ResponsiveGrid
      items={items}
      config={{ columns }}
    />
  );
};
```

## Best Practices

1. **Always use MapTo** - Wrap components with MapTo for proper AEM integration
2. **Type your models** - Leverage TypeScript for model safety
3. **Handle empty states** - Provide meaningful empty labels for author mode
4. **Optimize images** - Use buildAssetUrl for responsive image optimization
5. **Validate models** - Use validateModel utility for data validation
6. **Cache wisely** - Model Manager caches responses automatically
7. **Monitor performance** - Use React DevTools to profile component rendering

## Comparison with @adobe/aem-react-editable-components

| Feature | AEM React Toolkit | @adobe/aem-react-editable-components |
|---------|-------------------|--------------------------------------|
| Component Mapping | MapTo HOC | AuthoredComponent |
| Type Safety | Full TypeScript | Partial |
| Custom Hooks | 15+ hooks | Limited |
| Built-in Components | 15 components | None |
| Responsive Grid | Full support | Basic |
| Content Fragments | Full API | Manual fetch |
| Documentation | Comprehensive | Minimal |
| Bundle Size | ~45KB | ~20KB |
| Enterprise Ready | Yes | Yes |

## Performance

- **Tree-shaking** - Modular exports, only import what you need
- **Lazy loading** - Image lazy loading by default
- **Code splitting** - Compatible with React.lazy()
- **Caching** - Built-in model caching strategies
- **Minimal dependencies** - Only requires React and react-dom

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari 12+
- Edge (latest)

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## License

MIT © 2024 Alfredo Wiesner

## Support

- **Documentation** - https://github.com/alrod-dev/aem-react-toolkit/wiki
- **Issues** - https://github.com/alrod-dev/aem-react-toolkit/issues
- **Discussions** - https://github.com/alrod-dev/aem-react-toolkit/discussions

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

**Built with enterprise AEM + React expertise from Gorilla Group**
