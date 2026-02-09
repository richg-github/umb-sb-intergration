import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * # Umb CMS Integration
 * 
 * This SB project defines content structures that sync with Umb CMS.
 * 
 * ## How It Works
 * 
 * ```
 * Your SB Story → uS Config → Umb CMS → Delivery API → Your App
 * ```
 * 
 * 1. You create a DocType story with TypeScript interfaces and Umb metadata
 * 2. Backend generates uS XML from your story
 * 3. Umb imports the config and creates the content type
 * 4. Content editors use it to create/edit content
 * 5. Delivery API serves it as JSON to your Astro/Next.js app
 */

const IntroductionGuide = () => (
  <div style={{ 
    fontFamily: "'Nunito Sans', sans-serif", 
    padding: '2rem',
    maxWidth: '900px',
    lineHeight: 1.6
  }}>
    <h1>Umb CMS Integration</h1>
    <p style={{ fontSize: '1.125rem', color: '#666' }}>
      This SB project defines content structures that sync with Umb CMS.
    </p>

    <h2>How It Works</h2>
    <div style={{ 
      backgroundColor: '#f5f5f5', 
      padding: '1rem', 
      borderRadius: '4px',
      fontFamily: 'monospace',
      marginBottom: '2rem'
    }}>
      Your SB Story → uS Config → Umb CMS → Delivery API → Your App
    </div>

    <ol>
      <li><strong>You create a DocType story</strong> with TypeScript interfaces and Umb metadata</li>
      <li><strong>Backend generates uS XML</strong> from your story</li>
      <li><strong>Umb imports the config</strong> and creates the content type</li>
      <li><strong>Content editors use it</strong> to create/edit content</li>
      <li><strong>Delivery API serves it</strong> as JSON to your Astro/Next.js app</li>
    </ol>

    <h2>Creating a DocType Story</h2>

    <h3>1. Define Your Interface</h3>
    <p>Match the <strong>TypeScript types to what the API returns</strong>. Use <code>?</code> for optional properties.</p>
    <pre style={{ 
      backgroundColor: '#f5f5f5', 
      padding: '1rem', 
      borderRadius: '4px',
      overflow: 'auto'
    }}>
{`interface MyPageProps {
  title: string;           // No ? = mandatory
  description?: string;    // ? = optional (rich text returns HTML as string)
  backgroundColor?: 'Pink' | 'Blue' | 'Green';  // ? = optional
}`}
    </pre>

    <h3>2. Add Table Type Metadata</h3>
    <p>Use standard SB features - everything is visible in docs:</p>
    <pre style={{ 
      backgroundColor: '#f5f5f5', 
      padding: '1rem', 
      borderRadius: '4px',
      overflow: 'auto'
    }}>
{`argTypes: {
  title: {
    control: 'text',
    table: {
      type: { summary: 'string' },  // Shows in Description column
      category: 'Required'          // Marks as mandatory
    }
  },
  description: {
    control: 'textarea',
    table: {
      type: { summary: 'richtext' }  // Creates TinyMCE in Umb
    }
  },
  backgroundColor: {
    control: 'select',
    options: ['Pink', 'Blue', 'Green'],
    table: {
      type: { summary: 'colorpicker' }  // Optional by default
    }
  }
}`}
    </pre>

    <h3>3. That's It!</h3>
    <p>Backend handles the rest:</p>
    <ul>
      <li>Reads <code>table.type.summary: 'richtext'</code> from argTypes</li>
      <li>Looks it up in the mappings file</li>
      <li>Gets the correct Umb data type GUID</li>
      <li>Checks TypeScript <code>?</code> or <code>category: 'Required'</code> for mandatory flag</li>
      <li>Generates the uS XML</li>
      <li>Imports it to Umb</li>
    </ul>

    <h2>Available Field Types</h2>
    <p>Check the <strong>Field Type Reference</strong> story to see all available types:</p>
    <ul>
      <li><code>string</code> - Simple text input</li>
      <li><code>richtext</code> - TinyMCE rich text editor</li>
      <li><code>colorpicker</code> - Color dropdown (Pink, Blue, Green)</li>
      <li><code>colorkeys</code> - Brand colors (mustard, coral, etc.)</li>
      <li><code>heroimage</code> - Image media picker</li>
      <li><code>backlink</code> - Link picker</li>
      <li>More coming soon...</li>
    </ul>

    <h2>Important Notes</h2>

    <h3>TypeScript Types = API Response</h3>
    <p>Your TypeScript interface should match what the <strong>Delivery API returns</strong>, not the editor type:</p>
    
    <div style={{ 
      backgroundColor: '#e8f5e9', 
      padding: '1rem', 
      borderRadius: '4px',
      marginBottom: '0.5rem'
    }}>
      <strong>✅ Correct:</strong>
      <pre style={{ margin: '0.5rem 0 0 0' }}>
{`description: string  // Rich text returns HTML string`}
      </pre>
    </div>

    <div style={{ 
      backgroundColor: '#ffebee', 
      padding: '1rem', 
      borderRadius: '4px'
    }}>
      <strong>❌ Wrong:</strong>
      <pre style={{ margin: '0.5rem 0 0 0' }}>
{`description: RichTextObject  // API doesn't return an object`}
      </pre>
    </div>

    <h3 style={{ marginTop: '2rem' }}>SB Controls ≠ CMS Editors</h3>
    <p>The SB control is just for previewing in SB:</p>
    <pre style={{ 
      backgroundColor: '#f5f5f5', 
      padding: '1rem', 
      borderRadius: '4px'
    }}>
{`control: 'textarea'             // ← Just for SB preview
table: {
  type: { summary: 'richtext' }  // ← Creates TinyMCE in Umb
}`}
    </pre>

    <h3>Making Properties Mandatory</h3>
    <p>Two ways to mark a property as required:</p>
    <ol>
      <li>
        <strong>TypeScript (preferred):</strong> Don't use <code>?</code>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '0.5rem', borderRadius: '4px', margin: '0.5rem 0' }}>
{`title: string  // Mandatory`}
        </pre>
      </li>
      <li>
        <strong>Table category:</strong> Add <code>category: 'Required'</code>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '0.5rem', borderRadius: '4px', margin: '0.5rem 0' }}>
{`table: { category: 'Required' }`}
        </pre>
      </li>
    </ol>
    <p>Everything else is optional by default.</p>

    <h3>Need a New Type?</h3>
    <p>If you need a field type that's not listed:</p>
    <ol>
      <li>Ask backend to add it to <code>umbraco-property-mappings.json</code></li>
      <li>They'll configure the Umb data type</li>
      <li>It'll be available for everyone to use</li>
    </ol>

    <h2>Questions?</h2>
    <ul>
      <li>See <strong>Field Type Reference</strong> for all available types</li>
      <li>Check existing DocType stories (<em>AI Page</em>, <em>AI Hero</em>) for examples</li>
      <li>Ask backend if you need a new field type added</li>
    </ul>
  </div>
);

const meta = {
  title: 'Umb/Introduction',
  component: IntroductionGuide,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete guide to creating Umb-synced content types in SB'
      }
    }
  },
} satisfies Meta<typeof IntroductionGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Guide: Story = {};
