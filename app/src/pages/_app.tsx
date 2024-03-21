// eslint-disable-next-line filenames/match-regex
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import 'react-data-grid/lib/styles.css';
import '../styles/globals.css';

import {
  BaseStyles,
  ThemeProvider as PrimerThemeProvider,
} from '@primer/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextThemeProvider attribute="class">
      <PrimerThemeProvider>
        <BaseStyles>
          <Component {...pageProps} />
        </BaseStyles>
      </PrimerThemeProvider>
    </NextThemeProvider>
  );
}
