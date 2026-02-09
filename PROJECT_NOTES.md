# SB to Umb uS Integration Project

## Project Goal

**Bridge the gap between frontend development (SB) and CMS implementation (Umb) by creating a bidirectional workflow:**

### The Complete Round-Trip Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND: Define content structure in SB             │
│    - TypeScript interfaces with property types                  │
│    - Umb metadata (type: 'richtext', mandatory: true)       │
│    - SB controls and previews                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. BACKEND: Generate uS XML from SB                  │
│    - Parse .stories.tsx files                                   │
│    - Look up umbraco.type in mappings file                      │
│    - Generate ContentType XML with correct data type GUIDs     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. UMBRACO: Import via uS                                    │
│    - Document types created in Umb                          │
│    - Properties configured with correct editors                 │
│    - Content authors can create/edit content                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. DELIVERY API EXTENSIONS: Generate Typed Swagger             │
│    - Umb.Community.DeliveryApiExtensions package            │
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
│    - SB TypeScript interface (step 1)                    │
│    - vs Generated TypeScript types (step 5)                     │
│    - Should match! If not, something went wrong                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Principle:** TypeScript interfaces in SB should match what the **Delivery API returns**, not the CMS editor type. Rich text returns HTML as `string`, dropdowns return values as `string`, etc.

## Project Structure

```
/Users/richgreen/Documents/_dev/SB/
├── umbraco-storybook-prototype/          # Frontend SB project
│   └── src/
│       └── doctypes/
│           └── aiPage.stories.tsx        # Example DocType definition
├── UmbStorySource/                   # Umb configuration files
│   └── uS/
│       └── v17/
│           ├── ContentTypes/             # Document Type configs
│           │   ├── aiPage.config
│           │   └── aipageexample.config
│           └── DataTypes/                # Data Type configs
│               └── DropdownColorPicker.config
└── umbraco-property-mappings.json        # Convention mapping file
```

## Technology Stack

- **Frontend**: Astro/Next.js with SB
- **CMS**: Umb v13+ (uS v17)
- **API**: Umb Delivery API + [DeliveryApiExtensions](https://github.com/ByteCrumb/Umb.Community.DeliveryApiExtensions)
- **Type Generation**: openapi-typescript, orval, or NSwag
- **Sync**: uS for configuration management

## Key Concepts

### 1. SB Stories as DocType Definitions

Frontend developers create `.stories.tsx` files that define:
- **TypeScript Interface**: Property names and types
- **Meta Parameters**: Umb document type metadata (name, alias, icon, description)
- **ArgTypes**: Property-level Umb metadata (editor type, mandatory, sort order)

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

**Important**: Frontend developers should NOT need to know Umb internals!

Frontend uses **standard SB features only** - no hidden metadata:

**MANDATORY FIELD RULE (Critical):**
- **Default = Optional** (80% of properties are optional in CMS)
- **ONLY mark mandatory** when `table.category: 'Required'` is explicitly set
- **TypeScript `?` syntax is IGNORED** for mandatory determination (only for type safety)
- This prevents over-constraining content editors and gives them flexibility

```typescript
interface HeroProps {
  title: string;           // TypeScript type (? is for type safety only)
  description: string;     // TypeScript type (mandatory status set via argTypes)
}

argTypes: {
  title: {
    control: 'text',
    table: {
      type: { summary: 'string' },  // ← Visible in SB docs
      category: 'Required'          // ← ONLY way to mark mandatory
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

The mapping system translates `table.type.summary` to full Umb configuration.

**Available Types:**
- `string` - Text input field
- `richtext` - Rich text editor
- `colorpicker` - Color dropdown (Pink/Blue/Green)
- `brandcolors` - Brand colors (mustard/coral/etc)
- `mediapicker` - Image/media picker
- `urlpicker` - Link picker

### 3. uS XML Configuration Files

Umb uses XML config files that can be imported to create content structures:

- **ContentTypes** (Document Types): Define the structure of content pages/documents
- **DataTypes**: Define the editor UI and configuration for properties
- **Properties**: Individual fields within a Document Type

### 3. TypeScript Types Must Match API Response

**Critical Understanding:**

```typescript
// SB TypeScript interface
interface HeroProps {
  description: string;  // ← What API returns (HTML as string)
}

// SB metadata
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

### 4. Umb.Community.DeliveryApiExtensions

This package is critical to the workflow. It:

1. **Generates Typed Swagger** from Umb document types
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

**Frontend Convention**: When developers name a property `backgroundColor`, it should automatically map to the Umb `[Dropdown] Color Picker` data type.

This eliminates the need for developers to specify data types every time - conventions handle it.

## Critical Learnings

### uS ContentType Import Issues

1. **Folder Dependency Problem**
   - **Issue**: `aiPage.config` failed to import because it referenced a folder "AI Content" that didn't exist
   - **Solution**: Changed to existing "Pages" folder
   - **Lesson**: Always verify folder paths exist before importing, or use root level

2. **Property Type Mismatch**
   - **Issue**: Initially used wrong `<Type>` for dropdown
   - **Correct Format**:
     ```xml
     <Definition>7fe18493-bd95-40e9-8076-1ed877450db0</Definition>
     <Type>Umb.DropDown.Flexible</Type>
     ```
   - **Lesson**: The `<Type>` must match the editor alias, not just "Umb.TextBox" for everything

3. **Sort Order vs XML Order**
   - **Issue**: Assumed properties appear in the order they're listed in XML
   - **Reality**: `<SortOrder>` determines display order in Umb
   - **Example**: `pageTitle` (sortOrder: 0) appears before `backgroundColor` (sortOrder: 1)

### Frontend-to-Backend Value Mismatches

**CRITICAL**: TypeScript types and Umb data type options must match!

- **Frontend** (`aiPage.stories.tsx`): `backgroundColor: 'white' | 'grey' | 'blue'`
- **Umb** (Color Picker): Options are "Pink", "Blue", "Green"
- **Problem**: Only "Blue" overlaps - will cause runtime issues
- **Solution**: Sync these values by either:
  - Updating Umb data type options, OR
  - Updating frontend TypeScript interface

### SB Metadata Gaps

**Observation**: The `backgroundColor` property exists in the TypeScript interface but NOT in `argTypes` with Umb metadata.

**Implication**: The mapping file serves as a fallback when properties lack explicit Umb metadata.

**Recommendation**: Frontend should add umbraco metadata to argTypes for all properties, but mappings provide a safety net for conventional names.

## Workflow: SB to uS

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
         type: { summary: 'string' },  // Visible in SB docs
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

That's it! Frontend's job is done. Everything is visible in SB.

### Backend Generation Process

1. **Read SB story file**
   - Extract interface properties and check for `?` (optional)
   - Extract argTypes metadata

2. **Read table.type.summary**
   - Find `table: { type: { summary: 'colorpicker' } }` in argTypes
   - Look up 'colorpicker' in `simpleTypes` section of mappings file
   - Get full Umb configuration:
     ```json
     {
       "dataTypeGuid": "7fe18493-bd95-40e9-8076-1ed877450db0",
       "umbracoEditorAlias": "Umb.DropDown.Flexible",
       "propertyType": "Umb.DropDown.Flexible"
     }
     ```

3. **Determine mandatory flag**
   - Check TypeScript: `backgroundColor?` (has `?`) → optional
   - OR check `table.category: 'Required'` → mandatory
   - Default: optional

4. **Apply naming conventions**
   - Property alias: `backgroundColor` (camelCase, as-is)
   - Display name: "Background Color" (Title Case with spaces)

5. **Generate uS XML**
   ```xml
   <GenericProperty>
     <Key>[NEW-GUID]</Key>
     <Name>Background Color</Name>          <!-- Title Case -->
     <Alias>backgroundColor</Alias>         <!-- camelCase -->
     <Definition>7fe18493-bd95-40e9-8076-1ed877450db0</Definition>  <!-- From mapping -->
     <Type>Umb.DropDown.Flexible</Type> <!-- From mapping -->
     <Mandatory>false</Mandatory>
     <SortOrder>1</SortOrder>
     <Tab Alias="content">Content</Tab>
   </GenericProperty>
   ```

5. **Import into Umb via uS**

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

### ✅ Visible Standard SB (Clean)
```typescript
backgroundColor?: 'mustard' | 'coral' | 'blue';  // ? = optional

argTypes: {
  backgroundColor: {
    control: 'select',
    options: ['mustard', 'coral', 'blue'],
    table: {
      type: { summary: 'brandcolors' }  // ← Visible in SB docs!
    }
  }
}
```

Everything frontend needs to know is **visible in SB documentation**. Backend reads `table.type.summary` and translates via mappings file.

## Data Types Reference

### Textstring (Standard)
- **GUID**: `0cc0eba1-9960-42c9-bf9b-60e150b429ae`
- **Alias**: Textstring
- **Editor**: Umb.TextBox
- **Use Case**: Simple text fields like page titles

### Dropdown Color Picker (Custom)
- **GUID**: `7fe18493-bd95-40e9-8076-1ed877450db0`
- **Alias**: [Dropdown] Color Picker
- **Editor**: Umb.DropDown.Flexible
- **Options**: Pink, Blue, Green
- **Use Case**: Any `backgroundColor` property (convention)

## Naming Conventions

### Frontend (TypeScript)
- **Properties**: camelCase (e.g., `backgroundColor`, `pageTitle`)
- **Types**: PascalCase (e.g., `PageDocTypeProps`)

### Umb (uS XML)
- **Alias**: camelCase, matches frontend exactly (e.g., `backgroundColor`)
- **Name**: Title Case with spaces (e.g., "Background Color")
- **ContentType Alias**: camelCase (e.g., `aiPage`)
- **ContentType Name**: Title Case (e.g., "AI Page")

## ⚠️ CRITICAL RULES

### Rule #1: Mandatory Field Default = OPTIONAL

**Default Behavior**: All properties are optional unless explicitly marked

**How to Mark Mandatory:**
```typescript
argTypes: {
  title: {
    table: {
      category: 'Required'  // ← ONLY way to make mandatory
    }
  }
}
```

**What Gets Ignored:**
- TypeScript `?` syntax (only for type safety, NOT for CMS)
- TypeScript `!` syntax
- Any other TypeScript modifiers

**Why:**
- 80% of CMS properties should be optional
- Gives content editors flexibility
- Prevents over-constraining the CMS
- Frontend uses `?` for compile-time checks, CMS uses `category` for validation

**Result:**
- No `category: 'Required'` → `<Mandatory>false</Mandatory>`
- Has `category: 'Required'` → `<Mandatory>true</Mandatory>`

### Rule #2: Always Look for Existing Examples First

**Before creating ANY new uS config file, ALWAYS:**

1. **Search for similar existing configs** in `/UmbStorySource/uS/v17/`
2. **Read the existing file** to understand the exact structure
3. **Copy the pattern** - don't invent your own structure
4. **Add to existing files** when appropriate (like Block Lists)

### Example: Adding to Block Lists

❌ **WRONG**: Creating a new Block List data type file  
✅ **CORRECT**: Follow this exact order (CANNOT skip steps):

**Step 1: Generate REAL GUIDs for new Element Types**
```bash
uuidgen | tr '[:upper:]' '[:lower:]'
# Returns: 0b3ca9db-6aad-4973-987f-fc9f7d229f9a (for featuredCard)
# Returns: 46f4f2ed-5285-483c-a2ea-2246af55f250 (for featuredCardSettings)
```
- Generate one GUID per element type
- Use `uuidgen` to ensure valid UUIDs
- Keep track of which GUID is for which element type

**Step 2: Create Element Type configs using those SAME GUIDs**
```xml
<ContentType Key="0b3ca9db-6aad-4973-987f-fc9f7d229f9a" Alias="featuredCard">
```
- Use the EXACT GUIDs generated in Step 1
- These GUIDs will be consistent across all files

**Step 3: Add to Block List using those SAME GUIDs**
```json
// Add to BlockListMainContent.config using SAME GUIDs from Step 1
{
  "contentElementTypeKey": "0b3ca9db-6aad-4973-987f-fc9f7d229f9a",  // SAME as featuredCard
  "settingsElementTypeKey": "46f4f2ed-5285-483c-a2ea-2246af55f250", // SAME as featuredCardSettings
  "label": "**Featured Card**: {umbValue: symbol} {umbValue: heading} ${$settings.hide == \u00271\u0027 ? \u0027[HIDDEN]\u0027 : \u0027\u0027}"
}
```

**Critical Rules:**
- ⚠️ **Generate GUIDs FIRST** using `uuidgen`
- ⚠️ **Use THE SAME GUIDs** in element type files AND Block List references
- ⚠️ **GUIDs must match exactly** across all files that reference them
- Missing `settingsElementTypeKey` breaks the pattern
- Label must include `${$settings.hide...}` conditional like other blocks
- Invalid GUIDs (containing "defg" etc.) cause validation errors
- **Label syntax**: Use `{umbValue: propertyName}` NOT `{propertyName}` - always check existing examples!

**Why this matters:**
- Block Lists reference Element Types by GUID - they must match exactly
- If GUIDs don't match, uS will fail to import
- `uuidgen` ensures valid, unique UUIDs
- One Block List can contain many different block types

**Example Workflow:**
```bash
# 1. Generate GUIDs
GUID1=$(uuidgen | tr '[:upper:]' '[:lower:]')  # 0b3ca9db-6aad-4973-987f-fc9f7d229f9a
GUID2=$(uuidgen | tr '[:upper:]' '[:lower:]')  # 46f4f2ed-5285-483c-a2ea-2246af55f250

# 2. Use in featuredcard.config: 
#    - Key="0b3ca9db-6aad-4973-987f-fc9f7d229f9a"
#    - Description: Client-friendly, NO dev references
# 3. Use in featuredcardsettings.config: Key="46f4f2ed-5285-483c-a2ea-2246af55f250"
# 4. Use in BlockListMainContent.config:
#    - contentElementTypeKey: "0b3ca9db-6aad-4973-987f-fc9f7d229f9a"
#    - settingsElementTypeKey: "46f4f2ed-5285-483c-a2ea-2246af55f250"
#    - label: Clean, shows content values only
```

**SB Documentation:**
Map SB stories to Umb element types in THIS file (PROJECT_NOTES.md), NOT in Umb configs:
- Featured Card element → `servicesSection.stories.tsx` → http://localhost:6006/?path=/docs/doctypes-services-section--docs
- Keep mapping centralized for developers
- Clients never see SB references

## SB and Umb: Keep Them Separate

**CRITICAL RULE: NO SB references in Umb configs**

**Why:**
- Umb is for **clients/content editors** - they don't care about SB
- SB is a **dev tool** - documentation happens elsewhere
- Keep client-facing UI clean and professional
- Dev documentation should be separate from production configs

**What this means:**
- ❌ NO SB URLs in Block List labels
- ❌ NO SB URLs in Element Type descriptions
- ❌ NO dev-specific references in any uS configs
- ✅ Keep descriptions client-friendly and clear
- ✅ Document SB links separately (in PROJECT_NOTES.md, README, etc.)

**Block List Label Best Practice:**
```json
{
  "label": "**Featured Card**: {umbValue: symbol} {umbValue: heading} ${$settings.hide == \u00271\u0027 ? \u0027[HIDDEN]\u0027 : \u0027\u0027}"
}
```
- Focus on showing content values (symbol, heading)
- Include hide/show conditional
- Keep it concise and readable
- No technical/dev references

## File Naming Conventions

### uS Files
- **Format**: `{alias}.config`
- **Example**: `aiPage.config` (matches ContentType alias)
- **Location**: `/UmbStorySource/uS/v17/ContentTypes/`

### SB Files
- **Format**: `{alias}.stories.tsx`
- **Example**: `aiPage.stories.tsx`
- **Location**: `/umbraco-storybook-prototype/src/doctypes/`

## Common Issues & Solutions

### Issue: Property doesn't appear in Umb
- **Cause**: Property might be in wrong tab or sortOrder is conflicting
- **Solution**: Check `<Tab Alias="content">` matches existing tab and sortOrder is unique

### Issue: Data type dropdown shows wrong options
- **Cause**: Using wrong data type GUID
- **Solution**: Check `umbraco-property-mappings.json` for correct GUID

### Issue: uS import fails silently
- **Causes**:
  1. Referenced folder doesn't exist
  2. Data type GUID doesn't exist in Umb
  3. XML syntax error (missing closing tags)
- **Solution**: Validate XML, verify all GUIDs exist, check folders

### Issue: Frontend values don't match Umb options
- **Cause**: TypeScript types and data type options out of sync
- **Solution**: Update one or the other to match exactly

## Type Generation & Validation

### Frontend Type Generation

After Umb document types are created, frontend generates types:

```bash
# Using openapi-typescript
npx openapi-typescript https://your-umbraco.com/umbraco/swagger/v1/swagger.json -o ./api/umbraco-types.ts

# Using orval
npx orval --input https://your-umbraco.com/umbraco/swagger/v1/swagger.json
```

### Validation Strategy

Compare original SB types with generated types:

1. **Before generation**: SB defines `interface HeroProps { description: string }`
2. **After generation**: Generated types from Swagger also have `description: string`
3. **If mismatch**: Something went wrong in the uS generation

This creates a feedback loop ensuring consistency across the entire stack.

## Umb Best Practices & Examples Section

**FUTURE GOAL**: Create a dedicated section in Umb containing:

### Reference Content Types
- Example Document Types showing all field types
- Block List with all available blocks
- Naming conventions examples
- Property organization patterns

### Reference Data Types
- One of each data type we use
- Configured with best practices
- Includes SB links
- Documents when to use each

### Reference Content Nodes
- Live examples of each content type
- Populated with realistic content
- Shows how fields work together
- Demonstrates validation rules

**Purpose:**
- Onboard new developers quickly
- Establish team conventions
- Provide working examples to copy
- Living documentation that stays in sync

**Location Ideas:**
- Root folder: `/Reference Examples/`
- Hidden from public site
- Accessible only to developers/admins
- Synced via uS for consistency

## Next Steps / TODO

1. [ ] Sync frontend `backgroundColor` values with Umb Color Picker options
2. [ ] Create Element Type for Featured Card (needed for Block List)
3. [ ] Create Umb "Reference Examples" section with best practices
4. [ ] Add more data types to mappings file (Rich Text, Image Picker, etc.)
5. [ ] Create automation script to generate uS from SB stories
6. [ ] Document Swagger → TypeScript generation process
7. [ ] Create validation script to compare SB types vs generated types
8. [ ] Add more simple types to mappings (textarea, number, checkbox, etc.)
9. [ ] Document DeliveryApiExtensions configuration and usage

## Running SB

```bash
cd /Users/richgreen/Documents/_dev/SB/umbraco-storybook-prototype
npm run storybook
# Opens at http://localhost:6006/
```

## Key Files to Reference

1. **umbraco-property-mappings.json** - Source of truth for property conventions
2. **aiPage.config** - Example ContentType with working properties
3. **DropdownColorPicker.config** - Example Data Type configuration
4. **aiPage.stories.tsx** - Example SB DocType definition
5. **appsettings.json** - Delivery API and Extensions configuration
6. **Swagger endpoint** - `https://your-umbraco.com/umbraco/swagger` for type generation

## Glossary

- **DocType**: Document Type in Umb - defines content structure
- **uS**: Umb package for syncing configuration via XML files
- **Data Type**: Defines the editor UI for a property (textbox, dropdown, etc.)
- **Property**: Individual field within a Document Type
- **ArgTypes**: SB metadata for component arguments/properties
- **GUID**: Unique identifier for Umb entities (data types, content types, properties)
- **Alias**: Machine-readable name (camelCase, no spaces)
- **Name**: Human-readable display name (Title Case with spaces)
- **Delivery API**: Umb's headless API for fetching content as JSON
- **DeliveryApiExtensions**: Community package adding Typed Swagger and preview features
- **Typed Swagger**: OpenAPI spec with TypeScript-friendly types for content models
- **openapi-typescript**: Tool to generate TypeScript types from OpenAPI/Swagger specs
- **orval**: Tool to generate TypeScript API clients from OpenAPI specs

---

**Last Updated**: 2026-02-09  
**Project Status**: Proof of Concept - Establishing workflow and conventions
