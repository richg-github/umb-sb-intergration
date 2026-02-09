# Umbraco Storybook Automation - Project Knowledge

## Project Overview

This project automates the creation of Umbraco DocTypes from Storybook component stories. Instead of manually recreating front-end components as back-end DocTypes, we maintain a **single source of truth** in Storybook with embedded Umbraco metadata that can be extracted to generate uSync XML files.

### The Problem We're Solving
- Front-end creates React components in Storybook
- Back-end manually recreates them as Umbraco DocTypes
- Time-consuming, error-prone, property names drift out of sync

### The Solution
1. **Single source of truth**: Storybook stories with embedded Umbraco metadata
2. **Automated extraction**: Script reads stories → generates uSync XML files
3. **Version control**: uSync files in Git → reproducible Umbraco structure

### The Workflow
```
1. Front-end creates React component + Storybook story
   ↓
2. Back-end adds Umbraco metadata to the story
   ↓
3. Run: npm run extract:usync
   ↓
4. uSync XML files generated automatically
   ↓
5. Commit to Git → Import to Umbraco → DocTypes created
```

---

## Metadata Structure

### Story-Level Metadata (`parameters.umbraco`)

Located in the `meta` object's `parameters.umbraco` section:

```typescript
parameters: {
  umbraco: {
    entityType: 'document-type',
    name: 'Page',                    // Display name in Umbraco
    alias: 'page',                   // Unique identifier (camelCase)
    icon: 'icon-document',           // Umbraco icon name
    description: 'A generic content page',
    isElement: false,                // true for Block Grid elements
    allowedAtRoot: true,             // true for root-level DocTypes
    group: 'Content',                // DocType group/folder
  },
}
```

**Key Fields:**
- `entityType`: Always `'document-type'`
- `name`: Human-readable name shown in Umbraco UI
- `alias`: Unique identifier (camelCase, no spaces)
- `icon`: Umbraco icon class (see Umbraco icon picker)
- `isElement`: `true` for Block Grid/Block List elements, `false` for pages/containers
- `allowedAtRoot`: `true` if this DocType can be created at root level
- `group`: Category/folder in Umbraco (e.g., "Content", "Blocks", "Settings")

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
      propertyEditorAlias: 'Umbraco.TextBox',
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
- `propertyEditorAlias`: Umbraco property editor identifier (e.g., `Umbraco.TextBox`, `Umbraco.RichText`, `Umbraco.BlockGrid`)
- `label`: Display name in Umbraco UI
- `alias`: Property identifier (camelCase, must match TypeScript prop name)
- `mandatory`: `true` if required, `false` if optional
- `group`: Tab/group in Umbraco editor (e.g., "Content", "Settings", "SEO")
- `sortOrder`: Display order within the group (0-indexed)

---

## Common Property Editor Aliases

### Text & Content
- `Umbraco.TextBox` - Single-line text input
- `Umbraco.TextArea` - Multi-line plain text
- `Umbraco.RichText` - WYSIWYG rich text editor
- `Umbraco.MarkdownEditor` - Markdown editor

### Media & Files
- `Umbraco.MediaPicker` - Single/multiple media items
- `Umbraco.ImageCropper` - Image with crop presets
- `Umbraco.UploadField` - Direct file upload

### Structured Content
- `Umbraco.BlockGrid` - Block-based layout editor
- `Umbraco.BlockList` - List of content blocks
- `Umbraco.ContentPicker` - Reference to other content nodes
- `Umbraco.MultiNodeTreePicker` - Multiple content references

### Selection & Configuration
- `Umbraco.ColorPicker` - Hex color picker
- `Umbraco.Slider` - Numeric slider
- `Umbraco.TrueFalse` - Boolean toggle
- `Umbraco.Dropdown` - Select dropdown
- `Umbraco.RadioButtonList` - Radio button group
- `Umbraco.CheckBoxList` - Multiple checkboxes

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
- Defines content structure for Umbraco

### Components (Blocks/Elements)
```
src/components/
  TextBlock/
    TextBlock.tsx          # React component
    TextBlock.stories.tsx  # Storybook story + Umbraco metadata
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

### Umbraco
- **Aliases**: camelCase, match TypeScript prop names exactly (e.g., `pageTitle`, `mainContent`)
- **Display names**: Title Case with spaces (e.g., "Page Title", "Main Content")
- **Groups**: Title Case (e.g., "Content", "Settings", "SEO")

### Consistency Rule
**The Umbraco `alias` MUST match the TypeScript prop name exactly.**

Example:
```typescript
// TypeScript component
interface TextBlockProps {
  heading?: string;  // ← prop name
  bodyText?: string; // ← prop name
}

// Storybook story
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
  title: 'Components/TextBlock',  // Storybook category/name
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
        propertyEditorAlias: 'Umbraco.TextBox',
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
        propertyEditorAlias: 'Umbraco.RichText',
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

## uSync XML Generation

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
# Start Storybook (port 6006)
npm run storybook

# Extract Storybook metadata → uSync XML
npm run extract:usync

# Build production Storybook
npm run build-storybook
```

---

## Tips & Best Practices

### 1. Start with Storybook, Add Umbraco Later
Create the React component and Storybook story first. Get it working and reviewed. Then add the `umbraco` metadata blocks.

### 2. Use Autocomplete-Friendly Metadata
Define TypeScript interfaces for the metadata structure to get autocomplete and type checking:

```typescript
interface UmbracoDocTypeMetadata {
  entityType: 'document-type';
  name: string;
  alias: string;
  icon: string;
  description: string;
  isElement: boolean;
  allowedAtRoot?: boolean;
  group: string;
}

interface UmbracoPropertyMetadata {
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
- Storybook arg
- Umbraco alias

### 4. Document Custom Property Editors
If you use custom property editors (e.g., `Our.Custom.BackgroundColorPicker`), document them in this file or in `usync-mappings.json`.

### 5. Test in Storybook First
Always verify your stories render correctly in Storybook before running the extraction script. If Storybook can't parse it, neither can the extractor.

---

## Known Limitations

1. **No nested components** - The extractor reads `.stories.tsx` files only. Nested component metadata must be defined in separate stories.
2. **No conditional properties** - Umbraco doesn't support conditional fields (yet). Use separate DocTypes if needed.
3. **Block Grid configuration** - Advanced Block Grid settings (allowed blocks, min/max, etc.) may need manual configuration in Umbraco after import.

---

## Future Enhancements

- [ ] Two-way sync: Umbraco changes → update Storybook metadata
- [ ] Validation script: Check for missing metadata or mismatched aliases
- [ ] CLI tool: `npx umbraco-storybook init` to scaffold new components
- [ ] Visual diff: Compare uSync XML changes before commit

---

## Support & Questions

For help with this project:
1. Check existing `.stories.tsx` files for examples
2. Review `usync-mappings.json` for field mappings
3. Run the extraction script with `--verbose` flag for detailed output

---

_Last updated: 2026-02-09_
