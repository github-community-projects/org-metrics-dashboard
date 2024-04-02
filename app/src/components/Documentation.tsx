import { Box } from '@primer/react';
import { marked } from 'marked';
import Docs from '../../docs/definitions.md';

const convertMarkdownToHTML = (markdown: string): string => {
  return marked(markdown) as string;
};

const Documentation = () => {
  const html = convertMarkdownToHTML(Docs);

  return (
    <Box className="prose dark:prose-invert prose-lg">
      <Box dangerouslySetInnerHTML={{ __html: html }} />
    </Box>
  );
};

export default Documentation;
