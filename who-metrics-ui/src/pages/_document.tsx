import Navbar from '../components/navbar'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Navbar />
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
