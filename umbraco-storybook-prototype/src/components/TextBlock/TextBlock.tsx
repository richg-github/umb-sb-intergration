import React from 'react';

export interface TextBlockProps {
  /** The block heading */
  heading?: string;
  /** Rich text body content (rendered as HTML) */
  bodyText?: string;
  /** Optional background colour */
  backgroundColor?: 'white' | 'grey' | 'blue';
}

const backgroundStyles: Record<string, React.CSSProperties> = {
  white: { backgroundColor: '#ffffff', color: '#333333' },
  grey: { backgroundColor: '#f4f4f4', color: '#333333' },
  blue: { backgroundColor: '#e8f0fe', color: '#1a3c6e' },
};

export const TextBlock = ({
  heading,
  bodyText,
  backgroundColor = 'white',
}: TextBlockProps) => {
  const style: React.CSSProperties = {
    ...backgroundStyles[backgroundColor],
    padding: '2rem',
    borderRadius: '4px',
    fontFamily: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  };

  return (
    <section style={style}>
      {heading && <h2 style={{ margin: '0 0 1rem' }}>{heading}</h2>}
      {bodyText && (
        <div dangerouslySetInnerHTML={{ __html: bodyText }} />
      )}
    </section>
  );
};
