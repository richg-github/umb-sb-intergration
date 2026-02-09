import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextBlock } from './TextBlock';

const meta = {
  title: 'Components/AI TextBlock',
  component: TextBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    umbraco: {
      entityType: 'document-type',
      name: 'AI Text Block',
      alias: 'aiTextBlock',
      icon: 'icon-document-dashed-line',
      description: 'A simple text content block (AI-generated from SB)',
      isElement: true,
      group: 'AI Blocks',
    },
  },
  argTypes: {
    heading: {
      control: 'text',
      description: 'The block heading',
      table: { category: 'Content' },
      umbraco: {
        propertyEditorAlias: 'Umb.TextBox',
        label: 'Heading',
        alias: 'heading',
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
        alias: 'bodyText',
        mandatory: false,
        group: 'Content',
        sortOrder: 1,
      },
    },
    backgroundColor: {
      control: 'select',
      options: ['white', 'grey', 'blue'],
      description: 'Background colour for the block',
      table: { category: 'Settings' },
      umbraco: {
        propertyEditorAlias: 'Our.Custom.BackgroundColorPicker',
        label: 'Background Colour',
        alias: 'backgroundColor',
        mandatory: false,
        group: 'Settings',
        sortOrder: 0,
      },
    },
  },
} satisfies Meta<typeof TextBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Welcome',
    bodyText: '<p>This is a simple text block with <strong>rich text</strong> support.</p>',
    backgroundColor: 'white',
  },
};

export const GreyBackground: Story = {
  args: {
    heading: 'About Us',
    bodyText: '<p>Learn more about our team and mission.</p>',
    backgroundColor: 'grey',
  },
};

export const BlueBackground: Story = {
  args: {
    heading: 'Get in Touch',
    bodyText: '<p>We would love to hear from you. <a href="#">Contact us</a> today.</p>',
    backgroundColor: 'blue',
  },
};

export const BodyOnly: Story = {
  args: {
    bodyText: '<p>A block without a heading, just body content.</p>',
    backgroundColor: 'white',
  },
};
