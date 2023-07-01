import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider as NextThemeProvider, useTheme as nextUseTheme } from "next-themes"
import {ThemeProvider as PrimerThemeProvider, BaseStyles, useTheme} from '@primer/react'

export default function App({ Component, pageProps }: AppProps) {
  const {resolvedColorMode} = useTheme()
  const {theme} = nextUseTheme()
  return (
    <NextThemeProvider
      attribute='class'
    >
      <PrimerThemeProvider>
        <BaseStyles>
          <Component {...pageProps} />
        </BaseStyles>
      </PrimerThemeProvider>
    </NextThemeProvider>
  )
}
