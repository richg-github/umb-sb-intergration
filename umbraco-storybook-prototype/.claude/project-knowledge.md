# Umb SB Automation - Project Knowledge

## Project Overview

This project automates the creation of Umb DocTypes from SB component stories. Instead of manually recreating front-end components as back-end DocTypes, we maintain a **single source of truth** in SB with embedded Umb metadata that can be extracted to generate uS XML files.

### The Problem We're Solving
- Front-end creates React components in SB
- Back-end manually recreates them as Umb DocTypes
- Time-consuming, error-prone, property names drift out of sync

### The Solution
1. **Single source of truth**: SB stories with embedded Umb metadata
2. **Automated extraction**: Script reads stories → generates uS XML files
3. **Version control**: uS files in Git → reproducible Umb structure

### The Workflow
```
1. Front-end creates React component + SB story
   ↓
2. Back-end adds Umb metadata to the story
   ↓
3. Run: npm run extract:usync
   ↓
4. uS XML files generated automatically
   ↓
5. Commit to Git → Import to Umb → DocTypes created
```

---

## Metadata Structure

### Story-Level Metadata (`parameters.umbraco`)

Located in the `meta` object's `parameters.umbraco` section:

```typescript
parameters: {
  umbraco: {
    entityType: 'document-type',
    name: 'Page',                    // Display name in Umb
    alias: 'page',                   // Unique identifier (camelCase)
    icon: 'icon-document',           // Umb icon name
    description: 'A generic content page',
    isElement: false,                // true for Block Grid elements
    allowedAtRoot: true,             // true for root-level DocTypes
    group: 'Content',                // DocType group/folder
  },
}
```

**Key Fields:**
- `entityType`: Always `'document-type'`
- `name`: Human-readable name shown in Umb UI
- `alias`: Unique identifier (camelCase, no spaces)
- `icon`: Umb icon class (see Umb icon picker)
- `isElement`: `true` for Block Grid/Block List elements, `false` for pages/containers
- `allowedAtRoot`: `true` if this DocType can be created at root level
- `group`: Category/folder in Umb (e.g., "Content", "Blocks", "Settings")

---

### Property-Level Metadata (`argTypes[prop].umbraco`)

Located in each property's `argTypes` definition:

```typescript
argTypes: {
  pageTitle: {
    control: 'text',
    description: 'The page title',
    table: { category: 'Content' },
    umbraco: {
      propertyEditorAlias: 'Umb.TextBox',
      label: 'Page Title',
      alias: 'pageTitle',
      mandatory: true,
      group: 'Content',
      sortOrder: 0,
    },
  },
}
```

**Key Fields:**
- `propertyEditorAlias`: Umb property editor identifier (e.g., `Umb.TextBox`, `Umb.RichText`, `Umb.BlockGrid`)
- `label`: Display name in Umb UI
- `alias`: Property identifier (camelCase, must match TypeScript prop name)
- `mandatory`: `true` if required, `false` if optional
- `group`: Tab/group in Umb editor (e.g., "Content", "Settings", "SEO")
- `sortOrder`: Display order within the group (0-indexed)

---

## Common Property Editor Aliases

### Text & Content
- `Umb.TextBox` - Single-line text input
- `Umb.TextArea` - Multi-line plain text
- `Umb.RichText` - WYSIWYG rich text editor
- `Umb.MarkdownEditor` - Markdown editor

### Media & Files
- `Umb.MediaPicker` - Single/multiple media items
- `Umb.ImageCropper` - Image with crop presets
- `Umb.UploadField` - Direct file upload

### Structured Content
- `Umb.BlockGrid` - Block-based layout editor
- `Umb.BlockList` - List of content blocks
- `Umb.ContentPicker` - Reference to other content nodes
- `Umb.MultiNodeTreePicker` - Multiple content references

### Selection & Configuration
- `Umb.ColorPicker` - Hex color picker
- `Umb.Slider` - Numeric slider
- `Umb.TrueFalse` - Boolean toggle
- `Umb.Dropdown` - Select dropdown
- `Umb.RadioButtonList` - Radio button group
- `Umb.CheckBoxList` - Multiple checkboxes

### Custom Editors
- Use format: `YourNamespace.EditorName` (e.g., `Our.Custom.BackgroundColorPicker`)

---

## File Organization

### DocTypes (Pages/Containers)
```
src/doctypes/
  Page.stories.tsx
  BlogPost.stories.tsx
  LandingPage.stories.tsx
```

**Characteristics:**
- No actual React component (or minimal preview component)
- `isElement: false`
- `allowedAtRoot: true` (usually)
- Defines content structure for Umb

### Components (Blocks/Elements)
```
src/components/
  TextBlock/
    TextBlock.tsx          # React component
    TextBlock.stories.tsx  # SB story + Umb metadata
  Hero/
    Hero.tsx
    Hero.stories.tsx
```

**Characteristics:**
- Full React component implementation
- `isElement: true` (usually)
- `allowedAtRoot: false` (usually)
- Designed for Block Grid/Block List

---

## Naming Conventions

### TypeScript/React
- **Component names**: PascalCase (e.g., `TextBlock`, `HeroSection`)
- **Prop names**: camelCase (e.g., `pageTitle`, `backgroundColor`)
- **File names**: Match component name (e.g., `TextBlock.tsx`)

### Umb
- **Aliases**: camelCase, match TypeScript prop names exactly (e.g., `pageTitle`, `mainContent`)
- **Display names**: Title Case with spaces (e.g., "Page Title", "Main Content")
- **Groups**: Title Case (e.g., "Content", "Settings", "SEO")

### Consistency Rule
**The Umb `alias` MUST match the TypeScript prop name exactly.**

Example:
```typescript
// TypeScript component
interface TextBlockProps {
  heading?: string;  // ← prop name
  bodyText?: string; // ← prop name
}

// SB story
argTypes: {
  heading: {  // ← must match
    umbraco: {
      alias: 'heading',  // ← must match exactly
    },
  },
  bodyText: {  // ← must match
    umbraco: {
      alias: 'bodyText',  // ← must match exactly
    },
  },
}
```

---

## Example: Full Story File

Here's a complete annotated example:

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextBlock } from './TextBlock';

const meta = {
  title: 'Components/TextBlock',  // SB category/name
  component: TextBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    umbraco: {  // ← DOCUMENT-TYPE METADATA
      entityType: 'document-type',
      name: 'Text Block',
      alias: 'textBlock',
      icon: 'icon-document-dashed-line',
      description: 'A simple text content block',
      isElement: true,  // ← This is a Block Grid element
      group: 'Blocks',
    },
  },
  argTypes: {
    heading: {
      control: 'text',
      description: 'The block heading',
      table: { category: 'Content' },
      umbraco: {  // ← PROPERTY METADATA
        propertyEditorAlias: 'Umb.TextBox',
        label: 'Heading',
        alias: 'heading',  // ← Must match prop name
        mandatory: false,
        group: 'Content',
        sortOrder: 0,
      },
    },
    bodyText: {
      control: 'text',
      description: 'Rich text body content',
      table: { category: 'Content' },
      umbraco: {
        propertyEditorAlias: 'Umb.RichText',
        label: 'Body Text',
        alias: 'bodyText',  // ← Must match prop name
        mandatory: false,
        group: 'Content',
        sortOrder: 1,
      },
    },
  },
} satisfies Meta<typeof TextBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Welcome',
    bodyText: '<p>This is a simple text block.</p>',
  },
};
```

---

## uS XML Generation

The extraction script will:

1. **Find all `.stories.tsx` files** in `src/`
2. **Parse each file** to extract `parameters.umbraco` and `argTypes[*].umbraco`
3. **Generate XML** for each DocType
4. **Output to** `usync/v9/ContentTypes/` (configurable)

### Expected Output Structure
```
usync/
  v9/
    ContentTypes/
      page.config            # From Page.stories.tsx
      textBlock.config       # From TextBlock.stories.tsx
      heroSection.config     # From HeroSection.stories.tsx
```

---

## Development Commands

```bash
# Start SB (port 6006)
npm run storybook

# Extract SB metadata → uS XML
npm run extract:usync

# Build production SB
npm run build-storybook
```

---

## Tips & Best Practices

### 1. Start with SB, Add Umb Later
Create the React component and SB story first. Get it working and reviewed. Then add the `umbraco` metadata blocks.

### 2. Use Autocomplete-Friendly Metadata
Define TypeScript interfaces for the metadata structure to get autocomplete and type checking:

```typescript
interface UmbDocTypeMetadata {
  entityType: 'document-type';
  name: string;
  alias: string;
  icon: string;
  description: string;
  isElement: boolean;
  allowedAtRoot?: boolean;
  group: string;
}

interface UmbPropertyMetadata {
  propertyEditorAlias: string;
  label: string;
  alias: string;
  mandatory: boolean;
  group: string;
  sortOrder: number;
}
```

### 3. Keep Aliases in Sync
The most common error is mismatched aliases. Use the same name for:
- TypeScript prop
- SB arg
- Umb alias

### 4. Document Custom Property Editors
If you use custom property editors (e.g., `Our.Custom.BackgroundColorPicker`), document them in this file or in `usync-mappings.json`.

### 5. Test in SB First
Always verify your stories render correctly in SB before running the extraction script. If SB can't parse it, neither can the extractor.

---

## Known Limitations

1. **No nested components** - The extractor reads `.stories.tsx` files only. Nested component metadata must be defined in separate stories.
2. **No conditional properties** - Umb doesn't support conditional fields (yet). Use separate DocTypes if needed.
3. **Block Grid configuration** - Advanced Block Grid settings (allowed blocks, min/max, etc.) may need manual configuration in Umb after import.

---

## Future Enhancements

- [ ] Two-way sync: Umb changes → update SB metadata
- [ ] Validation script: Check for missing metadata or mismatched aliases
- [ ] CLI tool: `npx umbraco-storybook init` to scaffold new components
- [ ] Visual diff: Compare uS XML changes before commit

---

## Support & Questions

For help with this project:
1. Check existing `.stories.tsx` files for examples
2. Review `usync-mappings.json` for field mappings
3. Run the extraction script with `--verbose` flag for detailed output

---

_Last updated: 2026-02-09_
