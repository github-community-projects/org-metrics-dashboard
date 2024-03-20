"use client";

import { useTheme } from "next-themes";
import { Text, ToggleSwitch, useTheme as primerUseTheme } from "@primer/react";

const DarkModeToggle = () => {
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
    <>
      <Text id="toggle" sx={{ fontWeight: "bold", fontSize: 1 }}>
        Toggle Mode
      </Text>
      <ToggleSwitch
        checked={theme === "dark"}
        aria-labelledby="toggle"
        onClick={() => setThemePage()}
      />
    </>
  );
};

export default DarkModeToggle;
