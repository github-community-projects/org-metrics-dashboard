import { marked } from 'marked'
import docs from '../../docs/definitions.md'

const convertMarkdownToHTML = (markdown: string): string => {
  return marked(markdown) as string
}

const Documentation = () => {
  const html = convertMarkdownToHTML(docs)

  return (
    // eslint-disable-next-line react/no-danger
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}


export default Documentation