import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export function useMarkdown(content: string) {
  return md.render(content);
}
