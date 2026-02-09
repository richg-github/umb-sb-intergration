import type { Meta, StoryObj } from '@storybook/react';

// Types for the symbol and color options
type PossibleSymbols = 'astrix' | 'circle' | 'square' | 'triangle' | 'hexagon';
type SymbolColor = 'sky' | 'coral' | 'mustard' | 'green' | 'gray';

interface FeaturedCardProps {
  /** Symbol icon type */
  symbol: PossibleSymbols;
  /** Symbol icon color */
  symbolColor: SymbolColor;
  /** Card heading */
  heading: string;
  /** Card description */
  description: string;
}

interface ServicesSectionDocTypeProps {
  /** Section heading */
  heading: string;
  /** Array of featured cards */
  items: FeaturedCardProps[];
}

const ServicesSectionPreview = (args: ServicesSectionDocTypeProps) => (
  <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
    <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{args.heading}</h2>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    }}>
      {args.items.map((item, index) => (
        <div 
          key={index}
          style={{ 
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        >
          <div style={{ 
            fontSize: '2rem',
            marginBottom: '1rem',
            color: `var(--color-${item.symbolColor})` 
          }}>
            {item.symbol}
          </div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            marginBottom: '0.5rem',
            fontWeight: '600' 
          }}>
            {item.heading}
          </h3>
          <p style={{ 
            color: '#6b7280',
            lineHeight: '1.6' 
          }}>
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const meta = {
  title: 'DocTypes/Services Section',
  component: ServicesSectionPreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A services section with featured cards displaying icon, heading, and description. Maps to Umb Block List for repeating content.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    heading: {
      control: 'text',
      description: 'Main section heading',
      table: {
        type: { summary: 'string' },
        category: 'Required'
      }
    },
    items: {
      control: 'object',
      description: 'Array of featured cards (Block List in Umb)',
      table: {
        type: { summary: 'blocklist' }
      }
    }
  }
} satisfies Meta<typeof ServicesSectionPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Our Services',
    items: [
      {
        symbol: 'astrix',
        symbolColor: 'sky',
        heading: 'Digital Strategy',
        description: 'We create comprehensive digital strategies that align with your business goals and drive measurable results.'
      },
      {
        symbol: 'circle',
        symbolColor: 'coral',
        heading: 'Web Development',
        description: 'Custom websites and web applications built with modern technologies and best practices.'
      },
      {
        symbol: 'square',
        symbolColor: 'mustard',
        heading: 'Content Management',
        description: 'Powerful CMS solutions that give you full control over your digital content.'
      }
    ]
  }
};

export const SingleItem: Story = {
  args: {
    heading: 'Featured Service',
    items: [
      {
        symbol: 'hexagon',
        symbolColor: 'green',
        heading: 'Consulting',
        description: 'Expert guidance to help you navigate complex digital challenges and opportunities.'
      }
    ]
  }
};
