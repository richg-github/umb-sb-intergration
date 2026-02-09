import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Hero DocType definition for Umbraco CMS.
 * 
 * A hero component with heading, description, background color, symbol, image and back link.
 */

// Type definitions based on the real component
type ColorKeys = 'mustard' | 'coral' | 'blue' | 'green' | 'gray';

interface HeroImage {
  src: string;
  alt: string;
}

interface BackLink {
  href: string;
  text: string;
}

interface HeroDocTypeProps {
  /** The main heading text */
  heading: string;
  /** Discover powerful strategies to drive more visitors, enhance your online visibility, and grow your brand's presence across the web. */
  description?: string;
  /** Background color for the hero section */
  backgroundColor?: ColorKeys;
  /** Hero image */
  image?: HeroImage;
  /** Back navigation link */
  backLink?: BackLink;
  /** Optional CSS class name */
  className?: string;
}

const HeroDocTypePreview = (args: HeroDocTypeProps) => (
  <div 
    style={{ 
      fontFamily: "'Nunito Sans', sans-serif",
      backgroundColor: args.backgroundColor || '#f5f5f5',
      padding: '4rem 2rem',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}
    className={args.className}
  >
    {args.backLink && (
      <a href={args.backLink.href} style={{ color: '#666', textDecoration: 'none', fontSize: '0.875rem' }}>
        ← {args.backLink.text}
      </a>
    )}
    
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', lineHeight: 1.2 }}>
          {args.heading || 'Hero Heading'}
        </h1>
        
        <p style={{ fontSize: '1.125rem', color: '#666', lineHeight: 1.6 }}>
          {args.description || 'Hero description goes here'}
        </p>
      </div>
      
      {args.image && (
        <div style={{ flex: 1, minWidth: '300px' }}>
          <img 
            src={args.image.src} 
            alt={args.image.alt}
            style={{ 
              width: '100%', 
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      )}
    </div>
    
    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: 'auto' }}>
      <p>Background: {args.backgroundColor}</p>
    </div>
  </div>
);

const meta = {
  title: 'DocTypes/AI Hero',
  component: HeroDocTypePreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    umbraco: {
      entityType: 'document-type',
      name: 'AI Hero',
      alias: 'aiHero',
      icon: 'icon-picture',
      description: 'Hero section with heading, description, background, symbol and image',
      isElement: false,
      allowedAsRoot: true,
      group: 'AI Content',
    },
  },
  argTypes: {
    heading: {
      control: 'text',
      description: 'The main heading text',
      table: {
        type: { summary: 'string' },
        category: 'Required'
      },
    },
    description: {
      control: 'textarea',
      description: 'Discover powerful strategies to drive more visitors, enhance your online visibility, and grow your brand\'s presence across the web.',
      table: {
        type: { summary: 'richtext' }
      },
    },
    backgroundColor: {
      control: 'select',
      options: ['mustard', 'coral', 'blue', 'green', 'gray'],
      description: 'Background color for the hero section',
      table: {
        type: { summary: 'brandcolors' }
      },
    },
    image: {
      control: 'object',
      description: 'Hero image',
      table: {
        type: { summary: 'mediapicker' }
      },
    },
    backLink: {
      control: 'object',
      description: 'Back navigation link',
      table: {
        type: { summary: 'urlpicker' }
      },
    },
    className: {
      control: 'text',
      description: 'Optional CSS class name',
      table: {
        type: { summary: 'string' }
      },
    },
  },
} satisfies Meta<typeof HeroDocTypePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Increase traffic',
    description: 'Discover powerful strategies to drive more visitors, enhance your online visibility, and grow your brand\'s presence across the web.',
    backgroundColor: 'mustard',
    image: {
      src: 'https://via.placeholder.com/600x400',
      alt: 'Hero image'
    },
    backLink: {
      href: '/',
      text: 'Back to home'
    },
  },
};

export const CoralTheme: Story = {
  args: {
    heading: 'Boost engagement',
    description: 'Learn how to create compelling content that resonates with your audience and drives meaningful interactions.',
    backgroundColor: 'coral',
    image: {
      src: 'https://via.placeholder.com/600x400/FF6B6B',
      alt: 'Coral themed hero'
    },
  },
};

export const BlueTheme: Story = {
  args: {
    heading: 'Scale your business',
    description: 'Implement proven strategies to grow your business and reach new markets effectively.',
    backgroundColor: 'blue',
    image: {
      src: 'https://via.placeholder.com/600x400/4ECDC4',
      alt: 'Blue themed hero'
    },
    backLink: {
      href: '/services',
      text: 'View all services'
    },
  },
};
