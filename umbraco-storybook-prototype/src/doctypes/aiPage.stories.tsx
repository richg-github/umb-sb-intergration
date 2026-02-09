import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Page DocType definition for Umbraco CMS.
 *
 * This is not a renderable component — it defines the content structure
 * (properties and their editor types) that Umbraco uses to scaffold a
 * Page document type. The Umbraco metadata stored in `parameters` and
 * `argTypes` can be extracted to generate uSync XML files.
 */

interface PageDocTypeProps {
  /** The page title displayed in the browser tab and as the main heading */
  pageTitle: string;
  /** The background color of the page */
  backgroundColor: 'Pink' | 'Blue' | 'Green';
}

const PageDocTypePreview = (args: PageDocTypeProps) => (
  <div style={{ 
    fontFamily: "'Nunito Sans', sans-serif", 
    padding: '2rem',
    backgroundColor: args.backgroundColor?.toLowerCase() || 'white',
    minHeight: '100vh'
  }}>
    <h1>{args.pageTitle || 'Untitled Page'}</h1>
    <p style={{ color: '#666', marginTop: '1rem' }}>
      This is a simple AI Page DocType with page title and background color.
    </p>
    <p style={{ color: '#999', fontSize: '0.875rem', marginTop: '0.5rem' }}>
      Background: {args.backgroundColor || 'Not set'}
    </p>
  </div>
);

const meta = {
  title: 'DocTypes/AI Page',
  component: PageDocTypePreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    umbraco: {
      entityType: 'document-type',
      name: 'AI Page',
      alias: 'aiPage',
      icon: 'icon-document',
      description: 'A generic content page (AI-generated from Storybook)',
      isElement: false,
      allowedAtRoot: true,
      group: 'AI Content',
    },
  },
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
    backgroundColor: {
      control: 'select',
      options: ['Pink', 'Blue', 'Green'],
      description: 'The background color of the page',
      table: { category: 'Content' },
      umbraco: {
        propertyEditorAlias: 'Umbraco.DropDown.Flexible',
        label: 'Background Color',
        alias: 'backgroundColor',
        dataTypeGuid: '7fe18493-bd95-40e9-8076-1ed877450db0',
        mandatory: false,
        group: 'Content',
        sortOrder: 1,
      },
    },
  },
} satisfies Meta<typeof PageDocTypePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pageTitle: 'Welcome to Our Site',
    backgroundColor: 'Pink',
  },
};

export const AboutPage: Story = {
  args: {
    pageTitle: 'About Us',
    backgroundColor: 'Blue',
  },
};

export const GreenTheme: Story = {
  args: {
    pageTitle: 'Green Page',
    backgroundColor: 'Green',
  },
};
