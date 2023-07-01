/* eslint-disable filenames/match-regex */
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import {
  ThemeProvider as PrimerThemeProvider,
  BaseStyles,
} from "@primer/react";

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
