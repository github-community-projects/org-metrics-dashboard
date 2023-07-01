import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from "next-themes"
import {ThemeProvider as PrimerThemeProvider, BaseStyles} from '@primer/react'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <PrimerThemeProvider>
        <BaseStyles>
          <Component {...pageProps} />
        </BaseStyles>
      </PrimerThemeProvider>
    </ThemeProvider>
  )
}
