# Storybook to Umbraco uSync Integration Project

## Project Goal

**Bridge the gap between frontend development (Storybook) and CMS implementation (Umbraco) by creating a bidirectional workflow:**

### The Complete Round-Trip Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND: Define content structure in Storybook             │
│    - TypeScript interfaces with property types                  │
│    - Umbraco metadata (type: 'richtext', mandatory: true)       │
│    - Storybook controls and previews                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. BACKEND: Generate uSync XML from Storybook                  │
│    - Parse .stories.tsx files                                   │
│    - Look up umbraco.type in mappings file                      │
│    - Generate ContentType XML with correct data type GUIDs     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. UMBRACO: Import via uSync                                    │
│    - Document types created in Umbraco                          │
│    - Properties configured with correct editors                 │
│    - Content authors can create/edit content                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. DELIVERY API EXTENSIONS: Generate Typed Swagger             │
│    - Umbraco.Community.DeliveryApiExtensions package            │
│    - Creates TypeScript-friendly OpenAPI spec                   │
│    - Document types → TypeScript interfaces                     │
│    - Property types → Correct TypeScript types                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. FRONTEND: Generate TypeScript from Swagger                  │
│    - Tools: openapi-typescript, orval, NSwag                    │
│    - Auto-generates API client functions                        │
│    - Auto-generates TypeScript types for all content           │
│    - Types match what Delivery API returns                      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. VALIDATION: Compare original vs generated types             │
│    - Storybook TypeScript interface (step 1)                    │
│    - vs Generated TypeScript types (step 5)                     │
│    - Should match! If not, something went wrong                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Principle:** TypeScript interfaces in Storybook should match what the **Delivery API returns**, not the CMS editor type. Rich text returns HTML as `string`, dropdowns return values as `string`, etc.

## Project Structure

```
/Users/richgreen/Documents/_dev/Storybook/
├── umbraco-storybook-prototype/          # Frontend Storybook project
│   └── src/
│       └── doctypes/
│           └── aiPage.stories.tsx        # Example DocType definition
├── UmbracoStorySource/                   # Umbraco configuration files
│   └── uSync/
│       └── v17/
│           ├── ContentTypes/             # Document Type configs
│           │   ├── aiPage.config
│           │   └── aipageexample.config
│           └── DataTypes/                # Data Type configs
│               └── DropdownColorPicker.config
└── umbraco-property-mappings.json        # Convention mapping file
```

## Technology Stack

- **Frontend**: Astro/Next.js with Storybook
- **CMS**: Umbraco v13+ (uSync v17)
- **API**: Umbraco Delivery API + [DeliveryApiExtensions](https://github.com/ByteCrumb/Umbraco.Community.DeliveryApiExtensions)
- **Type Generation**: openapi-typescript, orval, or NSwag
- **Sync**: uSync for configuration management

## Key Concepts

### 1. Storybook Stories as DocType Definitions

Frontend developers create `.stories.tsx` files that define:
- **TypeScript Interface**: Property names and types
- **Meta Parameters**: Umbraco document type metadata (name, alias, icon, description)
- **ArgTypes**: Property-level Umbraco metadata (editor type, mandatory, sort order)

Example from `aiPage.stories.tsx`:

```typescript
interface PageDocTypeProps {
  pageTitle: string;
  backgroundColor: 'white' | 'grey' | 'blue';
}

parameters: {
  umbraco: {
    entityType: 'document-type',
    name: 'AI Page',
    alias: 'aiPage',
    icon: 'icon-document',
    // ... more metadata
  }
}
```

### 2. Simplified Type System for Frontend Developers

**Important**: Frontend developers should NOT need to know Umbraco internals!

Frontend uses **standard Storybook features only** - no hidden metadata:

```typescript
interface HeroProps {
  title: string;           // No ? = mandatory
  description?: string;    // ? = optional
}

argTypes: {
  title: {
    control: 'text',
    table: {
      type: { summary: 'string' },  // ← Visible in Storybook docs
      category: 'Required'          // ← Shows as mandatory
    }
  },
  description: {
    control: 'textarea',
    table: {
      type: { summary: 'richtext' }  // ← Optional by default
    }
  }
}
```

The mapping system translates `table.type.summary` to full Umbraco configuration.

**Available Types:**
- `string` - Text input field
- `richtext` - Rich text editor
- `colorpicker` - Color dropdown (Pink/Blue/Green)
- `brandcolors` - Brand colors (mustard/coral/etc)
- `mediapicker` - Image/media picker
- `urlpicker` - Link picker

### 3. uSync XML Configuration Files

Umbraco uses XML config files that can be imported to create content structures:

- **ContentTypes** (Document Types): Define the structure of content pages/documents
- **DataTypes**: Define the editor UI and configuration for properties
- **Properties**: Individual fields within a Document Type

### 3. TypeScript Types Must Match API Response

**Critical Understanding:**

```typescript
// Storybook TypeScript interface
interface HeroProps {
  description: string;  // ← What API returns (HTML as string)
}

// Storybook metadata
umbraco: {
  type: 'richtext'  // ← How to edit in CMS (TinyMCE editor)
}
```

**The API returns:**
```json
{
  "properties": {
    "description": "<p>Some <strong>HTML</strong> content</p>"
  }
}
```

**NOT** a rich text object! It's a string containing HTML.

This is why:
- Rich text → TypeScript type is `string`
- Dropdown → TypeScript type is `string` (the selected value)
- Media picker → TypeScript type is `object` with url, name, etc.

### 4. Umbraco.Community.DeliveryApiExtensions

This package is critical to the workflow. It:

1. **Generates Typed Swagger** from Umbraco document types
2. **Creates discriminated unions** for polymorphic content
3. **Enables type-safe API clients** in TypeScript

Example from their docs:
```typescript
import { getContentItemByPath } from './api/umbraco-api';

const content = (await getContentItemByPath('/')).data;

if (content.contentType === 'home') {
    // TypeScript knows this is a Home page
    console.log(`Title: ${content.properties?.title}`);
    console.log(`Text: ${content.properties?.text?.markup}`);
}
```

**Configuration in appsettings.json:**
```json
{
  "DeliveryApiExtensions": {
    "Preview": {
      "Enabled": true,
      "Media": { "Enabled": true },
      "AllowedUserGroupAliases": []
    },
    "TypedSwagger": {
      "Enabled": true,
      "Mode": "Auto"
    }
  }
}
```

### 5. Property Mapping Convention

The `umbraco-property-mappings.json` file establishes naming conventions:

**Frontend Convention**: When developers name a property `backgroundColor`, it should automatically map to the Umbraco `[Dropdown] Color Picker` data type.

This eliminates the need for developers to specify data types every time - conventions handle it.

## Critical Learnings

### uSync ContentType Import Issues

1. **Folder Dependency Problem**
   - **Issue**: `aiPage.config` failed to import because it referenced a folder "AI Content" that didn't exist
   - **Solution**: Changed to existing "Pages" folder
   - **Lesson**: Always verify folder paths exist before importing, or use root level

2. **Property Type Mismatch**
   - **Issue**: Initially used wrong `<Type>` for dropdown
   - **Correct Format**:
     ```xml
     <Definition>7fe18493-bd95-40e9-8076-1ed877450db0</Definition>
     <Type>Umbraco.DropDown.Flexible</Type>
     ```
   - **Lesson**: The `<Type>` must match the editor alias, not just "Umbraco.TextBox" for everything

3. **Sort Order vs XML Order**
   - **Issue**: Assumed properties appear in the order they're listed in XML
   - **Reality**: `<SortOrder>` determines display order in Umbraco
   - **Example**: `pageTitle` (sortOrder: 0) appears before `backgroundColor` (sortOrder: 1)

### Frontend-to-Backend Value Mismatches

**CRITICAL**: TypeScript types and Umbraco data type options must match!

- **Frontend** (`aiPage.stories.tsx`): `backgroundColor: 'white' | 'grey' | 'blue'`
- **Umbraco** (Color Picker): Options are "Pink", "Blue", "Green"
- **Problem**: Only "Blue" overlaps - will cause runtime issues
- **Solution**: Sync these values by either:
  - Updating Umbraco data type options, OR
  - Updating frontend TypeScript interface

### Storybook Metadata Gaps

**Observation**: The `backgroundColor` property exists in the TypeScript interface but NOT in `argTypes` with Umbraco metadata.

**Implication**: The mapping file serves as a fallback when properties lack explicit Umbraco metadata.

**Recommendation**: Frontend should add umbraco metadata to argTypes for all properties, but mappings provide a safety net for conventional names.

## Workflow: Storybook to uSync

### Frontend Developer Workflow (Simplified)

1. **Define property in TypeScript interface**
   ```typescript
   interface PageDocTypeProps {
     pageTitle: string;        // No ? = mandatory
     backgroundColor?: 'Pink' | 'Blue' | 'Green';  // ? = optional
   }
   ```

2. **Add to argTypes with table.type**
   ```typescript
   argTypes: {
     pageTitle: {
       control: 'text',
       description: 'The page title',
       table: {
         type: { summary: 'string' },  // Visible in Storybook docs
         category: 'Required'          // Marks as mandatory
       }
     },
     backgroundColor: {
       control: 'select',
       options: ['Pink', 'Blue', 'Green'],
       table: {
         type: { summary: 'colorpicker' }  // Optional by default
       }
     }
   }
   ```

That's it! Frontend's job is done. Everything is visible in Storybook.

### Backend Generation Process

1. **Read Storybook story file**
   - Extract interface properties and check for `?` (optional)
   - Extract argTypes metadata

2. **Read table.type.summary**
   - Find `table: { type: { summary: 'colorpicker' } }` in argTypes
   - Look up 'colorpicker' in `simpleTypes` section of mappings file
   - Get full Umbraco configuration:
     ```json
     {
       "dataTypeGuid": "7fe18493-bd95-40e9-8076-1ed877450db0",
       "umbracoEditorAlias": "Umbraco.DropDown.Flexible",
       "propertyType": "Umbraco.DropDown.Flexible"
     }
     ```

3. **Determine mandatory flag**
   - Check TypeScript: `backgroundColor?` (has `?`) → optional
   - OR check `table.category: 'Required'` → mandatory
   - Default: optional

4. **Apply naming conventions**
   - Property alias: `backgroundColor` (camelCase, as-is)
   - Display name: "Background Color" (Title Case with spaces)

5. **Generate uSync XML**
   ```xml
   <GenericProperty>
     <Key>[NEW-GUID]</Key>
     <Name>Background Color</Name>          <!-- Title Case -->
     <Alias>backgroundColor</Alias>         <!-- camelCase -->
     <Definition>7fe18493-bd95-40e9-8076-1ed877450db0</Definition>  <!-- From mapping -->
     <Type>Umbraco.DropDown.Flexible</Type> <!-- From mapping -->
     <Mandatory>false</Mandatory>
     <SortOrder>1</SortOrder>
     <Tab Alias="content">Content</Tab>
   </GenericProperty>
   ```

5. **Import into Umbraco via uSync**

## Frontend Approach: Visible and Simple

### ❌ Hidden Metadata (Confusing)
```typescript
backgroundColor: {
  control: 'select',
  umbraco: {                  // ← Hidden object, not visible in docs
    type: 'colorpicker',
    mandatory: false
  }
}
```

### ✅ Visible Standard Storybook (Clean)
```typescript
backgroundColor?: 'mustard' | 'coral' | 'blue';  // ? = optional

argTypes: {
  backgroundColor: {
    control: 'select',
    options: ['mustard', 'coral', 'blue'],
    table: {
      type: { summary: 'brandcolors' }  // ← Visible in Storybook docs!
    }
  }
}
```

Everything frontend needs to know is **visible in Storybook documentation**. Backend reads `table.type.summary` and translates via mappings file.

## Data Types Reference

### Textstring (Standard)
- **GUID**: `0cc0eba1-9960-42c9-bf9b-60e150b429ae`
- **Alias**: Textstring
- **Editor**: Umbraco.TextBox
- **Use Case**: Simple text fields like page titles

### Dropdown Color Picker (Custom)
- **GUID**: `7fe18493-bd95-40e9-8076-1ed877450db0`
- **Alias**: [Dropdown] Color Picker
- **Editor**: Umbraco.DropDown.Flexible
- **Options**: Pink, Blue, Green
- **Use Case**: Any `backgroundColor` property (convention)

## Naming Conventions

### Frontend (TypeScript)
- **Properties**: camelCase (e.g., `backgroundColor`, `pageTitle`)
- **Types**: PascalCase (e.g., `PageDocTypeProps`)

### Umbraco (uSync XML)
- **Alias**: camelCase, matches frontend exactly (e.g., `backgroundColor`)
- **Name**: Title Case with spaces (e.g., "Background Color")
- **ContentType Alias**: camelCase (e.g., `aiPage`)
- **ContentType Name**: Title Case (e.g., "AI Page")

## File Naming Conventions

### uSync Files
- **Format**: `{alias}.config`
- **Example**: `aiPage.config` (matches ContentType alias)
- **Location**: `/UmbracoStorySource/uSync/v17/ContentTypes/`

### Storybook Files
- **Format**: `{alias}.stories.tsx`
- **Example**: `aiPage.stories.tsx`
- **Location**: `/umbraco-storybook-prototype/src/doctypes/`

## Common Issues & Solutions

### Issue: Property doesn't appear in Umbraco
- **Cause**: Property might be in wrong tab or sortOrder is conflicting
- **Solution**: Check `<Tab Alias="content">` matches existing tab and sortOrder is unique

### Issue: Data type dropdown shows wrong options
- **Cause**: Using wrong data type GUID
- **Solution**: Check `umbraco-property-mappings.json` for correct GUID

### Issue: uSync import fails silently
- **Causes**:
  1. Referenced folder doesn't exist
  2. Data type GUID doesn't exist in Umbraco
  3. XML syntax error (missing closing tags)
- **Solution**: Validate XML, verify all GUIDs exist, check folders

### Issue: Frontend values don't match Umbraco options
- **Cause**: TypeScript types and data type options out of sync
- **Solution**: Update one or the other to match exactly

## Type Generation & Validation

### Frontend Type Generation

After Umbraco document types are created, frontend generates types:

```bash
# Using openapi-typescript
npx openapi-typescript https://your-umbraco.com/umbraco/swagger/v1/swagger.json -o ./api/umbraco-types.ts

# Using orval
npx orval --input https://your-umbraco.com/umbraco/swagger/v1/swagger.json
```

### Validation Strategy

Compare original Storybook types with generated types:

1. **Before generation**: Storybook defines `interface HeroProps { description: string }`
2. **After generation**: Generated types from Swagger also have `description: string`
3. **If mismatch**: Something went wrong in the uSync generation

This creates a feedback loop ensuring consistency across the entire stack.

## Next Steps / TODO

1. [ ] Sync frontend `backgroundColor` values with Umbraco Color Picker options
2. [ ] Add more data types to mappings file (Rich Text, Image Picker, etc.)
3. [ ] Create automation script to generate uSync from Storybook stories
4. [ ] Document Swagger → TypeScript generation process
5. [ ] Create validation script to compare Storybook types vs generated types
6. [ ] Add more simple types to mappings (textarea, number, checkbox, etc.)
7. [ ] Document DeliveryApiExtensions configuration and usage

## Running Storybook

```bash
cd /Users/richgreen/Documents/_dev/Storybook/umbraco-storybook-prototype
npm run storybook
# Opens at http://localhost:6006/
```

## Key Files to Reference

1. **umbraco-property-mappings.json** - Source of truth for property conventions
2. **aiPage.config** - Example ContentType with working properties
3. **DropdownColorPicker.config** - Example Data Type configuration
4. **aiPage.stories.tsx** - Example Storybook DocType definition
5. **appsettings.json** - Delivery API and Extensions configuration
6. **Swagger endpoint** - `https://your-umbraco.com/umbraco/swagger` for type generation

## Glossary

- **DocType**: Document Type in Umbraco - defines content structure
- **uSync**: Umbraco package for syncing configuration via XML files
- **Data Type**: Defines the editor UI for a property (textbox, dropdown, etc.)
- **Property**: Individual field within a Document Type
- **ArgTypes**: Storybook metadata for component arguments/properties
- **GUID**: Unique identifier for Umbraco entities (data types, content types, properties)
- **Alias**: Machine-readable name (camelCase, no spaces)
- **Name**: Human-readable display name (Title Case with spaces)
- **Delivery API**: Umbraco's headless API for fetching content as JSON
- **DeliveryApiExtensions**: Community package adding Typed Swagger and preview features
- **Typed Swagger**: OpenAPI spec with TypeScript-friendly types for content models
- **openapi-typescript**: Tool to generate TypeScript types from OpenAPI/Swagger specs
- **orval**: Tool to generate TypeScript API clients from OpenAPI specs

---

**Last Updated**: 2026-02-09  
**Project Status**: Proof of Concept - Establishing workflow and conventions
