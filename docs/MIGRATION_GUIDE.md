# Migration Guide: HTL/Sightly to React SPA

This guide provides step-by-step instructions for migrating existing AEM HTL/Sightly components to React SPAs using the AEM React Toolkit.

## Overview

**HTL/Sightly Approach:**
- Server-side rendering
- Model → HTL templates
- Traditional request/response cycle

**React SPA Approach:**
- Client-side rendering
- Model → React components
- Dynamic page composition with MapTo

## Step 1: Analyze Your Current Components

### Identify HTL Components
```
/apps/myapp/components/
├── text/
│   └── text.html
├── image/
│   └── image.html
└── hero/
    └── hero.html
```

### Note Component Properties
Review dialog.xml to understand:
- Property names and types
- Validation rules
- Default values
- Field dependencies

## Step 2: Create Sling Models

Before converting to React, create or update Sling models to expose component data as JSON.

### Example: Text Component Model

**Before (HTL Only):**
```xml
<!-- text/text.html -->
<sly data-sly-model="com.example.models.TextModel">
  ${model.text}
</sly>
```

**After (With Sling Model):**
```java
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TextModel {
  @ValueMapValue
  private String text;

  public String getText() {
    return text;
  }
}
```

### Register Model for JSON Export

```java
@Model(
  adaptables = Resource.class,
  resourceType = "myapp/components/text",
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME)
@ExporterOption(name = "mapper", value = "jackson")
public class TextModel { ... }
```

## Step 3: Create React Component

### Step 3a: Basic Component Structure

```tsx
import React from 'react';
import { AEMComponentProps } from 'aem-react-toolkit';

interface TextProps extends AEMComponentProps {
  text?: string;
  className?: string;
}

const TextComponent: React.FC<TextProps> = ({
  text,
  className = '',
  isInEditor,
  editConfig,
}) => {
  if (!text) {
    if (isInEditor && editConfig?.emptyLabel) {
      return <div className="aem-text--empty">{editConfig.emptyLabel}</div>;
    }
    return null;
  }

  return <div className={`aem-text ${className}`}>{text}</div>;
};

export default TextComponent;
```

### Step 3b: Add MapTo Decorator

```tsx
import { MapTo } from 'aem-react-toolkit';

const TextComponent: React.FC<TextProps> = ({ text, ... }) => {
  // Component implementation
};

export default MapTo('myapp/components/text', {
  emptyLabel: 'Click to add text'
})(TextComponent);
```

### Step 3c: Handle Rich Text (RTE)

```tsx
import { processRTEOutput } from 'aem-react-toolkit';

interface TextProps extends AEMComponentProps {
  text?: string;
  textIsRich?: boolean;
}

const TextComponent: React.FC<TextProps> = ({
  text,
  textIsRich = false,
}) => {
  if (textIsRich) {
    const processedHTML = processRTEOutput(text);
    return (
      <div
        className="aem-text--rich"
        dangerouslySetInnerHTML={{ __html: processedHTML }}
      />
    );
  }

  return <div className="aem-text">{text}</div>;
};

export default MapTo('myapp/components/text')(TextComponent);
```

## Step 4: Handle Content Fragments

### From HTL Reference:
```xml
<sly data-sly-use.cf="com.example.CF">${cf.title}</sly>
```

### To React Hook:

```tsx
import { useContentFragment } from 'aem-react-toolkit';

const MyComponent = ({ fragmentPath }) => {
  const { fragment, loading, error } = useContentFragment(fragmentPath);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{fragment?.title}</div>;
};
```

## Step 5: Handle Responsive Layouts

### From ResponsiveGrid HTL:
```xml
<sly data-sly-resource="${'./responsivegrid'}" />
```

### To React Component:

```tsx
import { ResponsiveGrid } from 'aem-react-toolkit';

const LayoutComponent: React.FC<ContainerProps> = ({
  ':items': items,
  ':itemsOrder': order,
}) => {
  return (
    <ResponsiveGrid
      items={items}
      itemsOrder={order}
      config={{ columns: 12 }}
    />
  );
};

export default MapTo('myapp/components/container')(LayoutComponent);
```

## Step 6: Handle Images and Assets

### From HTL Image Handling:
```xml
<img src="${image.src}" alt="${image.alt}" />
```

### To React Component:

```tsx
import { Image, buildAssetUrl } from 'aem-react-toolkit';

const HeroComponent: React.FC<HeroProps> = ({ imagePath, alt }) => {
  const optimizedUrl = buildAssetUrl(imagePath, {
    width: 1920,
    quality: 85,
    format: 'webp'
  });

  return <img src={optimizedUrl} alt={alt} />;
};
```

## Step 7: Update Dialog Configuration

### HTL Component Dialog:
```xml
<dialog jcr:primaryType="nt:unstructured">
  <content>
    <items>
      <tabs jcr:primaryType="cq:TabPanel">
        <items>
          <properties>
            <items>
              <text jcr:primaryType="cq:Widget"
                fieldLabel="Text"
                name="./text" />
            </items>
          </properties>
        </items>
      </tabs>
    </items>
  </content>
</dialog>
```

### Keep Dialogs the Same
Dialog configuration doesn't change - the Sling model translates dialog properties to JSON automatically.

## Step 8: Test Component

### Mock Model for Testing

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextComponent from './Text';

describe('Text Component', () => {
  it('renders text content', () => {
    render(<TextComponent text="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('shows empty placeholder in editor', () => {
    render(
      <TextComponent
        isInEditor={true}
        editConfig={{ emptyLabel: 'Add text' }}
      />
    );
    expect(screen.getByText('Add text')).toBeInTheDocument();
  });
});
```

## Step 9: Register in SPA

### Create Component Registry

```tsx
// components/index.ts
import Text from './Text/Text';
import Image from './Image/Image';
import Hero from './Hero/Hero';

export {
  Text,
  Image,
  Hero,
};
```

### Components Auto-Register via MapTo
The MapTo decorator automatically registers components - they're available via the component registry.

## Step 10: Update Page Component

### Before (HTL):
```xml
<!-- page/page.html -->
<sly data-sly-resource="${'./container'}" />
```

### After (React SPA):

```tsx
import { usePageModel } from 'aem-react-toolkit';
import * as Components from './components';

const PageComponent = () => {
  const { model, loading } = usePageModel();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page">
      <header>...</header>
      <main>
        {model?.['./container'] && (
          <Components.Container {...model['./container']} />
        )}
      </main>
      <footer>...</footer>
    </div>
  );
};

export default PageComponent;
```

## Migration Checklist

- [ ] Identify all HTL components to migrate
- [ ] Create/update Sling models
- [ ] Register models for JSON export
- [ ] Create React components for each
- [ ] Add MapTo decorators
- [ ] Handle rich text with processRTEOutput
- [ ] Test component rendering
- [ ] Test editor mode functionality
- [ ] Optimize images with buildAssetUrl
- [ ] Handle responsive layouts
- [ ] Update CSS/styling
- [ ] Deploy SPA configuration to AEM
- [ ] Configure Remote SPA Editor
- [ ] Test in author mode
- [ ] Test in publish mode

## Common Patterns

### Conditional Rendering

```tsx
// HTL
<sly data-sly-test="${model.showTitle}">
  <h1>${model.title}</h1>
</sly>

// React
const Component = ({ showTitle, title }) => (
  <>
    {showTitle && <h1>{title}</h1>}
  </>
);
```

### List Iteration

```tsx
// HTL
<ul data-sly-list="${model.items}">
  <li>${item.title}</li>
</ul>

// React
const Component = ({ items }) => (
  <ul>
    {items?.map((item) => (
      <li key={item.path}>{item.title}</li>
    ))}
  </ul>
);
```

### Dynamic Properties

```tsx
// HTL
${model[propertyName]}

// React
const Component = ({ model, propertyName }) => (
  <div>{model[propertyName]}</div>
);
```

## Performance Optimization

### Code Splitting

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./Heavy'));

<Suspense fallback={<div>Loading...</div>}>
  <HeavyComponent />
</Suspense>
```

### Memoization

```tsx
import { memo } from 'react';

export default memo(MapTo('myapp/components/text')(TextComponent));
```

## Troubleshooting

### Model Not Showing

- Verify Sling model is properly annotated with @Exporter
- Check resource type matches in both model and MapTo
- Verify JSON export endpoint (.model.json)

### Styling Issues

- Import component CSS properly
- Ensure class names match between HTL and React
- Use CSS modules for scoping if needed

### Editor Not Showing

- Verify isInEditor prop is passed
- Check editConfig has emptyLabel
- Verify adobeQa is available in window

## Next Steps

- Review [AEM_SETUP.md](./AEM_SETUP.md) for AEM configuration
- See [COMPONENT_MAPPING.md](./COMPONENT_MAPPING.md) for mapping patterns
- Check [README.md](../README.md) for API reference
