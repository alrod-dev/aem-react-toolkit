# AEM Setup Guide

Complete setup instructions for configuring your AEM instance to work with AEM React Toolkit SPAs.

## Prerequisites

- AEM 6.5 SP2+ or AEM as a Cloud Service
- Node.js 16+
- React 18+

## 1. Enable SPA Editor

### Install AEM SPA Editor Package

1. Go to AEM Package Manager (/crx/packmgr)
2. Download and install:
   - **AEM SPA Editor Core Components** (com.adobe.cq.spa.core-wcm-components.core)
   - **AEM SPA Editor JS SDK** (com.adobe.cq.spa.spa-core.core)

### Or Install via Command Line

```bash
# For AEM 6.5
curl -u admin:admin -X POST -F file=@spa-core-wcm-components.core.zip \
  http://localhost:4502/crx/packmgr/service.jsp

# For AEM as a Cloud Service (via Cloud Manager)
```

## 2. Create SPA Project Structure

```bash
/apps/myapp/
├── install/               # Maven-built app
├── clientlibs/
│  └── clientlib-spa/      # Client libraries
├── components/
│  ├── page/              # Page component
│  └── [component-list]   # Your components
└── config/               # OSGi configuration
```

## 3. Create Page Component

### Example Page Component JSP

```jsp
<%@ include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false" %>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <cq:include script="headlibs.jsp"/>
</head>
<body>
  <div id="spa-root"></div>
  <cq:include script="clientlibs.jsp"/>
</body>
</html>
```

### Or Use AEM Core Components Page

```xml
<cq:Page allowedChildren="cq:PageContent">
  <!-- Inherits from /libs/cq/gui/content/dumpcomponent/page -->
</cq:Page>
```

## 4. Configure Remote SPA (for local development)

### Update AEM Configuration

Create OSGi configuration at `/apps/myapp/config`:

**com.adobe.cq.spa.editor.config.SpaEditorConfiguration.cfg.json:**

```json
{
  "remote": true,
  "remoteUrl": "http://localhost:3000",
  "projectRoot": "/content/myapp",
  "spa": {
    "enabled": true,
    "resourceTypes": [
      "myapp/components/page",
      "myapp/components/container"
    ]
  }
}
```

## 5. Create Sling Models

### Text Component Model

```java
package com.example.aem.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.fasterxml.jackson.annotation.JsonProperty;

@Model(
    adaptables = Resource.class,
    resourceType = "myapp/components/text"
)
public class TextModel {

    @ValueMapValue
    @Default(values = "")
    @JsonProperty
    private String text;

    @ValueMapValue
    @Default(values = "false")
    @JsonProperty
    private Boolean textIsRich;

    public String getText() {
        return text;
    }

    public Boolean isTextIsRich() {
        return textIsRich;
    }
}
```

### Register for JSON Export

Add to Model class:

```java
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;

@Model(
    adaptables = Resource.class,
    resourceType = "myapp/components/text"
)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
@ExporterOption(name = "mapping", value = "true")
public class TextModel implements ComponentExporter {
    // ... model properties ...

    @Override
    public String getExportedType() {
        return "myapp/components/text";
    }
}
```

## 6. Configure Root Model

### Page Root Model

```java
@Model(
    adaptables = {
        Resource.class,
        SlingHttpServletRequest.class
    },
    resourceType = "myapp/components/page"
)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = "json")
public class PageModel implements ComponentExporter {

    @Inject
    private Page currentPage;

    @ValueMapValue
    private String pageTitle;

    @ChildResource
    private Resource responsivegrid;

    // Properties mapped from items...

    @Override
    public String getExportedType() {
        return "myapp/components/page";
    }

    public String getPageTitle() {
        return pageTitle;
    }
}
```

## 7. Configure Client Libraries

### Create SPA JS Clientlib

**Path:** `/apps/myapp/clientlibs/clientlib-spa/js.txt`

```
myapp/dist/index.esm.js
```

**Path:** `/apps/myapp/clientlibs/clientlib-spa/.content.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    categories="[myapp.spa]"
    embed="[core.wcm.components.react.base,core.wcm.components.react.container]"
    jsProcessor="[min:gcc;obsolete:accept]"/>
```

## 8. Create Component Dialogs

### Text Component Dialog

**Path:** `/apps/myapp/components/text/dialog.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root
    xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Text"
    sling:resourceType="cq/gui/components/authoring/dialog">
    <content jcr:primaryType="nt:unstructured">
        <items jcr:primaryType="nt:unstructured">
            <tabs
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/tabs"
                maximized="{Boolean}true">
                <items jcr:primaryType="nt:unstructured">
                    <properties
                        jcr:primaryType="nt:unstructured"
                        jcr:title="Properties"
                        sling:resourceType="granite/ui/components/coral/foundation/panel">
                        <items jcr:primaryType="nt:unstructured">
                            <text
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="cq/gui/components/authoring/dialog/richtext"
                                fieldLabel="Text"
                                name="./text"
                                hideLabel="{Boolean}false"/>
                            <textIsRich
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/checkbox"
                                fieldLabel="Is Rich Text"
                                name="./textIsRich"
                                value="true"/>
                        </items>
                    </properties>
                </items>
            </tabs>
        </items>
    </content>
</jcr:root>
```

## 9. Configure Allowed Components

### Update Container Component

Allow child components in your container:

**Path:** `/apps/myapp/components/container/container.xml`

```xml
<cq:Component
    jcr:description="Container"
    jcr:title="Container"
    componentGroup="myapp"
    editConfig="{allowedChildren:['myapp/components/text', 'myapp/components/image', 'myapp/components/hero']}"
    sling:resourceType="myapp/components/container"/>
```

## 10. Deploy SPA

### Build and Deploy

```bash
# Build SPA
npm run build

# Copy dist to AEM
# For AEM 6.5:
cp -r dist/* /path/to/aem/crx-quickstart/launchpad/bin/classes/...

# Or configure in pom.xml for Maven project
```

### AEM Project Structure (Maven)

```
aem-project/
├── ui.apps/
│  └── src/main/content/jcr_root/
│     └── apps/myapp/
│        └── clientlibs/clientlib-spa/
│           └── [build artifacts]
├── ui.frontend/
│  ├── src/
│  │  ├── components/
│  │  └── index.tsx
│  ├── package.json
│  └── tsconfig.json
```

## 11. Test Configuration

### Verify SPA Editor Integration

1. Open page in AEM Editor:
   ```
   http://localhost:4502/content/myapp/en/home.editor.html
   ```

2. Check browser console for errors
3. Verify model loads:
   ```
   http://localhost:4502/content/myapp/en/home.model.json
   ```

### Local Development

Run SPA on localhost:3000:

```bash
npm start
```

Access via Remote SPA Editor:
```
http://localhost:4502/editor.html/content/myapp/en/home
```

## 12. Configure Replication

### Replicate Components to Publish

1. Select components in `/apps/myapp/components/`
2. Right-click → Replicate
3. Or configure in Author/Publish setup

## 13. Performance Tuning

### Enable Dispatcher Caching

**Dispatcher config:**

```
/cache {
  /rules {
    /0000 {
      /glob "*.json"
      /type "deny"
    }
    /0001 {
      /glob "/content/myapp*"
      /type "allow"
    }
  }
}
```

### Cache Control Headers

```
/cache {
  /headers {
    /0 "Content-Type"
    /1 "Last-Modified"
  }
}
```

## 14. Troubleshooting

### Model Not Accessible

Check:
- Sling model properly annotated
- @Exporter annotation present
- Resource type matches MapTo()
- JSON endpoint accessible: `.model.json`

### Components Not Rendering

Check:
- MapTo resource type matches AEM component type
- Component properly exported
- React app correctly imports components
- ModelManager initialized

### Editor Not Loading

Check:
- Remote SPA URL configured
- SPA running on configured port
- CORS headers correct
- adobeQa available in window

## Security Considerations

1. **Validate inputs** - Always sanitize RTE output
2. **Restrict access** - Use AEM permissions on components
3. **CORS policy** - Configure for local development only
4. **CSP headers** - Set appropriate Content Security Policy

## Next Steps

- See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for component migration
- Review [COMPONENT_MAPPING.md](./COMPONENT_MAPPING.md) for mapping patterns
- Check toolkit [README.md](../README.md) for API reference
