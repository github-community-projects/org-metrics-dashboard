import Navbar from '../components/navbar'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="h-full bg-gray-50">
      <Head />
      <Navbar />
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
