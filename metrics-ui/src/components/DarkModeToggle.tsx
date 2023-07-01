"use client"
import React from 'react'
import { useTheme } from "next-themes";
import { Text, ToggleSwitch } from '@primer/react'

const DarkModeToggle = () => {
    const { theme, setTheme } = useTheme();
    return (
        <>
        <Text id="toggle" fontWeight="bold" fontSize={1}>
            Toggle Mode
        </Text>
        <ToggleSwitch
            checked={theme == "dark"}
            aria-labelledby="toggle" 
            onClick={() => theme == "dark" ? setTheme('light') : setTheme("dark")}    
        />
    </>)
}

export default DarkModeToggle