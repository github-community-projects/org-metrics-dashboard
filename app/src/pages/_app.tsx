import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

import {
  BaseStyles,
  ThemeProvider as PrimerThemeProvider,
} from '@primer/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextThemeProvider attribute="class">
      <PrimerThemeProvider colorMode="auto" preventSSRMismatch>
        <BaseStyles>
          <Component {...pageProps} />
        </BaseStyles>
      </PrimerThemeProvider>
    </NextThemeProvider>
  );
}
