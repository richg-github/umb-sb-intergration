import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * # Umbraco Field Type Reference
 * 
 * This reference shows all available Umbraco field types you can use when creating DocTypes.
 * 
 * ## How to Use
 * 
 * When adding properties to your DocType stories, use standard Storybook table.type:
 * 
 * ```typescript
 * interface MyProps {
 *   title: string;      // No ? = mandatory
 *   subtitle?: string;  // ? = optional
 * }
 * 
 * argTypes: {
 *   title: {
 *     control: 'text',
 *     table: {
 *       type: { summary: 'string' },  // ← Pick from types below
 *       category: 'Required'          // ← Marks as mandatory
 *     }
 *   },
 *   subtitle: {
 *     control: 'text',
 *     table: {
 *       type: { summary: 'string' }  // Optional by default
 *     }
 *   }
 * }
 * ```
 * 
 * ## Available Types
 * 
 * Browse the examples below to see all available field types and their configurations.
 */

interface ExampleProps {
  fieldType: string;
  description: string;
  tsType: string;
  example: string;
}

const FieldTypeExample = (args: ExampleProps) => (
  <div style={{ 
    fontFamily: "'Nunito Sans', sans-serif", 
    padding: '2rem',
    maxWidth: '800px'
  }}>
    <div style={{
      backgroundColor: '#f0f0f0',
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <h2 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
        {args.fieldType}
      </h2>
      <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.875rem' }}>
        {args.description}
      </p>
      
      <div style={{
        backgroundColor: '#fff',
        padding: '1rem',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        marginBottom: '1rem'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>TypeScript type:</strong> <code>{args.tsType}</code>
        </div>
        <div>
          <strong>Storybook argTypes:</strong>
          <pre style={{ margin: '0.5rem 0 0 0', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
{`table: {
  type: { summary: '${args.fieldType.toLowerCase()}' }
}`}
          </pre>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
          Add <code>category: 'Required'</code> to make mandatory
        </div>
      </div>

      <div style={{
        backgroundColor: '#e8f5e9',
        padding: '1rem',
        borderRadius: '4px',
        fontSize: '0.875rem'
      }}>
        <strong>Example value:</strong><br/>
        <code>{args.example}</code>
      </div>
    </div>
  </div>
);

const meta = {
  title: 'Umbraco/Field Type Reference',
  component: FieldTypeExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Reference guide for all available Umbraco field types. Use these type values in your `umbraco.type` metadata.'
      }
    }
  },
} satisfies Meta<typeof FieldTypeExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const String: Story = {
  args: {
    fieldType: 'string',
    description: 'Simple text input field for short text content (page titles, names, labels, etc.)',
    tsType: 'string',
    example: '"Hello World"'
  }
};

export const RichText: Story = {
  args: {
    fieldType: 'richtext',
    description: 'Rich text editor (TinyMCE) for formatted content. API returns HTML markup as a string.',
    tsType: 'string',
    example: '"<p>Some <strong>formatted</strong> text</p>"'
  }
};

export const ColorPicker: Story = {
  args: {
    fieldType: 'colorpicker',
    description: 'Dropdown with predefined color options (Pink, Blue, Green). Good for theme/styling properties.',
    tsType: "'Pink' | 'Blue' | 'Green'",
    example: '"Pink"'
  }
};

export const BrandColors: Story = {
  args: {
    fieldType: 'brandcolors',
    description: 'Dropdown with brand color options (mustard, coral, blue, green, gray). Used for background colors.',
    tsType: "'mustard' | 'coral' | 'blue' | 'green' | 'gray'",
    example: '"mustard"'
  }
};

export const MediaPicker: Story = {
  args: {
    fieldType: 'mediapicker',
    description: 'Media picker for images. API returns an object with url, alt, dimensions, etc.',
    tsType: '{ src: string; alt: string }',
    example: '{ src: "https://...", alt: "Hero image" }'
  }
};

export const UrlPicker: Story = {
  args: {
    fieldType: 'urlpicker',
    description: 'Link picker for navigation links. API returns an object with url and text.',
    tsType: '{ href: string; text: string }',
    example: '{ href: "/", text: "Back to home" }'
  }
};

export const BlockList: Story = {
  args: {
    fieldType: 'blocklist',
    description: 'Repeating content blocks (like feature cards, testimonials, FAQ items). Each item in the array becomes a block that editors can add/reorder. The object properties define the fields within each block.',
    tsType: 'Array<{ heading: string; description: string; ... }>',
    example: '[{ heading: "Feature 1", description: "..." }, { heading: "Feature 2", description: "..." }]'
  }
};

// Summary of all available types
export const AllTypesReference: Story = {
  render: () => (
    <div style={{ 
      fontFamily: "'Nunito Sans', sans-serif", 
      padding: '2rem',
      maxWidth: '900px'
    }}>
      <h2>Quick Reference: All Available Types</h2>
      
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginTop: '1rem'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Type Name</th>
            <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>TypeScript Type</th>
            <th style={{ padding: '0.75rem', borderBottom: '2px solid #ddd' }}>Use For</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>string</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>string</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Page titles, labels, short text</td>
          </tr>
          <tr style={{ backgroundColor: '#fafafa' }}>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>richtext</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>string</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Formatted content, descriptions</td>
          </tr>
          <tr>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>colorpicker</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>'Pink' | 'Blue' | 'Green'</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Simple color themes</td>
          </tr>
          <tr style={{ backgroundColor: '#fafafa' }}>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>brandcolors</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>'mustard' | 'coral' | ...</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Background colors (brand palette)</td>
          </tr>
          <tr>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>mediapicker</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>{'{ src, alt }'}</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Images, media files</td>
          </tr>
          <tr style={{ backgroundColor: '#fafafa' }}>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>urlpicker</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>{'{ href, text }'}</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Navigation links, CTAs</td>
          </tr>
          <tr>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>blocklist</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}><code>{'Array<ElementType>'}</code></td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Repeating content blocks</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ marginTop: '2rem' }}>Coming Soon</h3>
      <ul>
        <li><code>textarea</code> - Multi-line plain text</li>
        <li><code>number</code> - Numeric input</li>
        <li><code>checkbox</code> - Boolean true/false</li>
        <li><code>datepicker</code> - Date selection</li>
        <li><code>contentpicker</code> - Content node selection</li>
        <li><code>blockgrid</code> - Grid-based block content</li>
      </ul>

      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '1rem', 
        borderRadius: '4px',
        marginTop: '2rem'
      }}>
        <p style={{ margin: 0 }}>
          <strong>💡 How it works:</strong> You add <code>table.type.summary</code> to your argTypes, 
          backend reads it and translates to the correct Umbraco data type using the mappings file.
        </p>
      </div>

      <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '1rem' }}>
        Need a new type? Ask backend to add it to <code>umbraco-property-mappings.json</code>
      </p>
    </div>
  )
};
