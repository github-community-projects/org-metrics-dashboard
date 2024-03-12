"use client"

import { marked } from 'marked'
// import markdown from "../docs/index.md"

const convertMarkdownToHTML = (): string => {
  const markdown = `data`
  return marked(markdown) as string
}



const Documentation = () => {
  const data = convertMarkdownToHTML()
  console.log(data)

  return (
    // eslint-disable-next-line react/no-danger
    <div dangerouslySetInnerHTML={{ __html: data }} />
  )
}

export default Documentation