# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

#### Core Features
- **MapTo decorator** - Component registration and mapping for AEM resource types
- **EditableComponent** - Support for AEM author mode editing with overlays
- **ModelManager** - Page and component model fetching with caching
- **ResponsiveGrid** - 12-column responsive grid matching AEM layout system
- **ContentFragmentResolver** - Content Fragment API integration
- **ExperienceFragmentRenderer** - Experience Fragment rendering
- **PageModelProvider** - Page model state management

#### Components (15)
- Text - Rich text with RTE support
- Image - Responsive images with lazy loading
- Title - Configurable heading levels
- Button - CTA button with multiple styles
- Teaser - Image + title + description + CTA
- List - Dynamic lists with optional links
- Carousel - Touch-enabled carousel with keyboard navigation
- Tabs - Keyboard-accessible tab panels
- Accordion - Expandable content sections
- Navigation - Multi-level navigation from page tree
- Breadcrumb - Breadcrumb navigation trail
- Container - Layout wrapper with responsive grid
- Separator - Visual content divider
- Embed - External content embedding (YouTube, iframe, social)
- ContentFragment - Content Fragment renderer

#### Hooks
- `useAEMModel` - Page model subscription and updates
- `useAEMComponent` - Get specific component from model
- `useAEMProperty` - Get typed model property
- `useEditMode` - Detect AEM author/publish mode
- `useEditorInfo` - Get detailed editor information
- `useContentFragment` - Fetch Content Fragments
- `useContentFragmentsByTag` - Query fragments by tag
- `useContentFragmentField` - Get typed field value
- `useResponsiveBreakpoint` - Current viewport breakpoint
- `useGridColumns` - Grid columns for current breakpoint
- `useMediaQuery` - Media query matching
- `useResponsiveWidth` - Responsive width calculation

#### Utilities
- **AEM Helpers**
  - `resolvePath()` - AEM path resolution
  - `rewriteLink()` - Link rewriting for publication
  - `extractPlainText()` - HTML to plain text
  - `processRTEOutput()` - RTE sanitization
  - `buildAssetUrl()` - Asset optimization
  - `getLocaleFromPath()` - Locale detection
  - `isExternalLink()` - External link detection
  - `createPropertyMap()` - Property mapping

- **Responsive Utilities**
  - `BREAKPOINTS` - Standard AEM breakpoints
  - `getBreakpointForWidth()` - Width-based breakpoint detection
  - `generateMediaQuery()` - CSS media query generation
  - `formatColSpan()` - Column span formatting
  - `parseColSpan()` - Column span parsing
  - `calculateColumnWidth()` - Width calculation

- **Sling Model Utilities**
  - `extractMetadata()` - Extract AEM metadata
  - `extractProperties()` - Extract component properties
  - `getComponentType()` - Get resource type
  - `getComponentPath()` - Get component path
  - `hasChildren()` - Check for child items
  - `getChildren()` - Get child items
  - `mapChildren()` - Map children to React components
  - `filterChildrenByType()` - Filter children by type
  - `flattenModel()` - Flatten nested structure
  - `validateModel()` - Validate required properties

#### Configuration & Build
- TypeScript configuration with strict mode
- ESM and UMD build formats
- Vite build configuration
- Vitest test configuration
- ESLint and Prettier configuration
- Storybook setup (foundation)

#### Documentation
- Comprehensive README with architecture diagrams
- Migration guide from HTL/Sightly to React
- AEM setup guide
- Component mapping best practices guide
- API reference
- 15+ component examples

### Initial Release

This is the initial public release of AEM React Toolkit, featuring a complete integration suite for React SPAs with Adobe AEM's SPA Editor.

---

## Versioning

- Major version bumps for breaking changes
- Minor version bumps for new features
- Patch version bumps for bug fixes

## Future Releases

### Planned for v1.1.0
- Storybook component documentation
- Additional responsive component variants
- Form components (Form, TextInput, Select, etc.)
- Authentication utilities
- Advanced caching strategies

### Planned for v1.2.0
- GraphQL Content Fragment queries
- Advanced routing utilities
- Performance monitoring hooks
- Analytics integration utilities

### Planned for v2.0.0 (Future)
- Support for React 19+
- Improved model caching with Service Workers
- Built-in component state management
- Advanced editor features (inline editing, etc.)

---

## Support

For issues, questions, or contributions, please visit:
- GitHub Issues: https://github.com/alrod-dev/aem-react-toolkit/issues
- Discussions: https://github.com/alrod-dev/aem-react-toolkit/discussions
