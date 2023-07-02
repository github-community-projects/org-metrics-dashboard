"use client";

import { useTheme } from "next-themes";
import { IconButton, useTheme as primerUseTheme } from "@primer/react";
import { MoonIcon, SunIcon } from "@primer/octicons-react";

const DarkModeButton = () => {
  const { theme, setTheme } = useTheme();
  const { setColorMode } = primerUseTheme();

  const setThemePage = () => {
    if (theme === "dark") {
      setTheme("light");
      setColorMode("light");
    } else {
      setTheme("dark");
      setColorMode("dark");
    }
  };
  return (
    <IconButton
      icon={theme === "dark" ? SunIcon : MoonIcon}
      aria-label="Default"
      sx={{ marginLeft: "auto" }}
      onClick={setThemePage}
    />
  );
};

export default DarkModeButton;
