# Component Mapping Guide

Best practices and patterns for mapping AEM components to React components using the AEM React Toolkit.

## Basic Mapping Pattern

### Simple Component

```tsx
import React from 'react';
import { MapTo, AEMComponentProps } from 'aem-react-toolkit';

interface ButtonProps extends AEMComponentProps {
  label?: string;
  link?: string;
  style?: 'primary' | 'secondary';
}

const ButtonComponent: React.FC<ButtonProps> = ({
  label,
  link,
  style = 'primary',
  isInEditor,
  editConfig,
}) => {
  if (!label) {
    if (isInEditor) {
      return <div className="button--empty">Configure button</div>;
    }
    return null;
  }

  return (
    <button className={`button button--${style}`}>
      {link ? <a href={link}>{label}</a> : label}
    </button>
  );
};

// Register component with AEM resource type
export default MapTo('myapp/components/button')(ButtonComponent);
```

## Container Components

### Parent-Child Mapping

```tsx
// Container.tsx
import React from 'react';
import { MapTo, Container as ContainerType } from 'aem-react-toolkit';
import { ResponsiveGrid } from 'aem-react-toolkit';
import { ComponentRegistry } from './ComponentRegistry';

interface ContainerProps extends ContainerType {
  className?: string;
  isInEditor?: boolean;
}

const ContainerComponent: React.FC<ContainerProps> = ({
  ':items': items,
  ':itemsOrder': itemsOrder,
  className = '',
  isInEditor,
}) => {
  return (
    <div className={`container ${className}`}>
      <ResponsiveGrid
        items={items}
        itemsOrder={itemsOrder}
        isInEditor={isInEditor}
        config={{ columns: 12 }}
      >
        {/* Children rendered from items */}
      </ResponsiveGrid>
    </div>
  );
};

export default MapTo('myapp/components/container')(ContainerComponent);
```

### Child Component Rendering

```tsx
// ComponentRegistry.tsx
import { getComponentByType } from 'aem-react-toolkit';

export const renderComponent = (resourceType: string, props: any) => {
  const Component = getComponentByType(resourceType);

  if (!Component) {
    console.warn(`No component mapped for type: ${resourceType}`);
    return null;
  }

  return <Component {...props} />;
};

// In container
const items = model[':items'];
const order = model[':itemsOrder'];

{order.map((key) => {
  const item = items[key];
  const type = item[':type'];
  return renderComponent(type, { key, ...item });
})}
```

## Advanced Patterns

### Conditional Component Rendering

```tsx
import { getComponentByType } from 'aem-react-toolkit';

interface ConditionalComponentProps {
  condition?: boolean;
  resourceType?: string;
  componentProps?: any;
  fallback?: React.ReactNode;
}

const ConditionalComponent: React.FC<ConditionalComponentProps> = ({
  condition = true,
  resourceType,
  componentProps,
  fallback = null,
}) => {
  if (!condition) {
    return <>{fallback}</>;
  }

  if (!resourceType) {
    return null;
  }

  const Component = getComponentByType(resourceType);
  if (!Component) {
    return null;
  }

  return <Component {...componentProps} />;
};

export default ConditionalComponent;
```

### Dynamic Component Swapping

```tsx
// Allows switching components based on edit config
interface DynamicWrapperProps {
  resourceType: string;
  viewMode: 'grid' | 'list' | 'carousel';
  componentProps: any;
}

const DynamicWrapper: React.FC<DynamicWrapperProps> = ({
  resourceType,
  viewMode,
  componentProps,
}) => {
  const wrapperType = `${resourceType}/${viewMode}`;
  const Component = getComponentByType(wrapperType) || getComponentByType(resourceType);

  if (!Component) {
    return null;
  }

  return <Component {...componentProps} viewMode={viewMode} />;
};
```

## Wrapper Components

### with Data Fetching

```tsx
import React, { useEffect, useState } from 'react';
import { MapTo, AEMComponentProps } from 'aem-react-toolkit';

interface DataProps extends AEMComponentProps {
  dataSource?: string;
  renderAs?: React.ComponentType<any>;
}

const DataWrapperComponent: React.FC<DataProps> = ({
  dataSource,
  renderAs: RenderComponent,
  ...props
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!dataSource) return;

    fetch(dataSource)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [dataSource]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!RenderComponent) return null;

  return <RenderComponent data={data} {...props} />;
};

export default MapTo('myapp/components/wrapper/data')(DataWrapperComponent);
```

### Composition Wrapper

```tsx
// Wraps components with common layout
interface CompositionProps extends AEMComponentProps {
  title?: string;
  subtitle?: string;
  renderComponent?: string; // Resource type to render
  componentProps?: any;
}

const CompositionComponent: React.FC<CompositionProps> = ({
  title,
  subtitle,
  renderComponent,
  componentProps,
}) => {
  const Component = getComponentByType(renderComponent);

  return (
    <div className="composition">
      {title && <h2>{title}</h2>}
      {subtitle && <p className="subtitle">{subtitle}</p>}

      {Component ? (
        <Component {...componentProps} />
      ) : (
        <div className="empty">No component selected</div>
      )}
    </div>
  );
};

export default MapTo('myapp/components/composition')(CompositionComponent);
```

## Responsive Components

### Screen-Size Aware Rendering

```tsx
import React from 'react';
import { useResponsiveBreakpoint, MapTo } from 'aem-react-toolkit';

interface ResponsiveProps {
  mobileComponent?: string;
  desktopComponent?: string;
  props?: any;
}

const ResponsiveComponentWrapper: React.FC<ResponsiveProps> = ({
  mobileComponent,
  desktopComponent,
  props,
}) => {
  const breakpoint = useResponsiveBreakpoint();

  const resourceType =
    breakpoint === 'phone' || breakpoint === 'tablet'
      ? mobileComponent
      : desktopComponent;

  const Component = getComponentByType(resourceType);

  if (!Component) {
    return null;
  }

  return <Component {...props} />;
};

export default MapTo('myapp/components/wrapper/responsive')(
  ResponsiveComponentWrapper
);
```

## Content Fragment Integration

### Content Fragment Mapper

```tsx
import React from 'react';
import { MapTo, useContentFragment } from 'aem-react-toolkit';

interface CFMapperProps extends AEMComponentProps {
  cfPath?: string;
  renderAs?: React.ComponentType<any>;
  fieldMapping?: Record<string, string>;
}

const ContentFragmentMapper: React.FC<CFMapperProps> = ({
  cfPath,
  renderAs: RenderComponent,
  fieldMapping = {},
}) => {
  const { fragment, loading, error } = useContentFragment(cfPath);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading fragment</div>;
  if (!fragment || !RenderComponent) return null;

  // Map fragment fields to component props
  const props: Record<string, any> = {};
  Object.entries(fieldMapping).forEach(([componentProp, fragmentField]) => {
    const field = fragment.elements?.[fragmentField];
    if (field) {
      props[componentProp] = field.value;
    }
  });

  return <RenderComponent {...props} />;
};

export default MapTo('myapp/components/wrapper/cf-mapper')(
  ContentFragmentMapper
);
```

## Editor-Specific Behavior

### Edit Mode Awareness

```tsx
import { useEditMode, MapTo } from 'aem-react-toolkit';

interface EditAwareProps extends AEMComponentProps {
  authorContent?: string;
  publishContent?: string;
}

const EditAwareComponent: React.FC<EditAwareProps> = ({
  authorContent,
  publishContent,
}) => {
  const isInEditor = useEditMode();

  const content = isInEditor ? authorContent : publishContent;

  return <div>{content}</div>;
};

export default MapTo('myapp/components/edit-aware', {
  emptyLabel: 'Configure content',
})(EditAwareComponent);
```

### Preview Mode Rendering

```tsx
interface PreviewProps extends AEMComponentProps {
  content?: string;
  previewMode?: boolean;
}

const PreviewComponent: React.FC<PreviewProps> = ({
  content,
  previewMode = false,
}) => {
  return (
    <div className={previewMode ? 'preview-mode' : ''}>
      {previewMode && <div className="preview-badge">Preview</div>}
      {content}
    </div>
  );
};

export default MapTo('myapp/components/preview')(PreviewComponent);
```

## Performance Optimization

### Lazy Loading Components

```tsx
import React, { lazy, Suspense } from 'react';
import { MapTo } from 'aem-react-toolkit';

const LazyHeavyComponent = lazy(() => import('./HeavyComponent'));

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  data?: any;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({
  fallback = <div>Loading...</div>,
  data,
}) => {
  return (
    <Suspense fallback={fallback}>
      <LazyHeavyComponent {...data} />
    </Suspense>
  );
};

export default MapTo('myapp/components/lazy-wrapper')(LazyWrapper);
```

### Memoized Components

```tsx
import React, { memo } from 'react';
import { MapTo } from 'aem-react-toolkit';

interface MemoComponentProps {
  title: string;
  content: string;
  expensiveCalculation?: boolean;
}

const MemoComponent = memo<MemoComponentProps>(({
  title,
  content,
  expensiveCalculation,
}) => {
  // Component implementation
  return <div>{title}: {content}</div>;
});

MemoComponent.displayName = 'MemoComponent';

export default MapTo('myapp/components/memo')(MemoComponent);
```

## Testing Mapped Components

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { clearComponentRegistry } from 'aem-react-toolkit';
import TextComponent from './Text';

describe('Mapped Text Component', () => {
  beforeEach(() => {
    // Clear registry before each test
    clearComponentRegistry();
  });

  it('registers component in registry', () => {
    render(<TextComponent text="Hello" />);
    // Component should be registered after rendering
  });

  it('handles empty state in editor', () => {
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

## Best Practices

1. **Always extend AEMComponentProps** - Ensures compatibility with editor
2. **Handle empty states** - Provide meaningful messages in editor mode
3. **Use TypeScript** - Full type safety for component props
4. **Validate props** - Check required properties before rendering
5. **Optimize images** - Use buildAssetUrl for responsive images
6. **Memo expensive components** - Prevent unnecessary re-renders
7. **Lazy load large components** - Improve initial load time
8. **Test in both modes** - Editor and publish mode
9. **Follow naming conventions** - Match AEM component structure
10. **Document prop types** - Help other developers use components

## Common Mistakes to Avoid

- Not handling null/undefined values
- Not providing edit mode UI
- Forgetting MapTo decorator
- Incorrect resource type path
- Not memoizing expensive components
- Direct DOM manipulation instead of React patterns
- Not cleaning up subscriptions in hooks
- Importing from wrong paths in component tree
