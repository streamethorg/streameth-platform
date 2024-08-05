'use client';
import MDEditor from '@uiw/react-md-editor';

const MarkdownDisplay = ({ content }: { content: string }) => {
  return (
    <MDEditor.Markdown
      source={content}
      style={{
        color: 'gray',
        whiteSpace: 'pre-wrap',
        background: 'transparent',
      }}
    />
  );
};

export default MarkdownDisplay;
