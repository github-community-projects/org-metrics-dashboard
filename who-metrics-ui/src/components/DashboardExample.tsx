"use client";

import {
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
} from "@tremor/react";

import { Box, useTheme as primerUseTheme } from "@primer/react";
import Image from "next/image";
import logo from "@/images/who-logo-wide.svg";

import RepositoriesTable from "./RepositoriesTable";
import Data from "../data/data.json";
import { useTheme } from "next-themes";

export type DailyPerformance = {
  date: string;
  Sales: number;
  Profit: number;
  Customers: number;
};

export const performance: DailyPerformance[] = [
  {
    date: "2023-05-01",
    Sales: 900.73,
    Profit: 173,
    Customers: 73,
  },
  {
    date: "2023-05-02",
    Sales: 1000.74,
    Profit: 174.6,
    Customers: 74,
  },
  {
    date: "2023-05-03",
    Sales: 1100.93,
    Profit: 293.1,
    Customers: 293,
  },
  {
    date: "2023-05-04",
    Sales: 1200.9,
    Profit: 290.2,
    Customers: 29,
  },
];

export const DashboardExample = () => {
  const { theme, systemTheme } = useTheme();
  const { setColorMode } = primerUseTheme();
  if (theme === "light" || theme === "dark" || theme === "auto") {
    setColorMode(theme);
  }

  if (theme === "system" && systemTheme) {
    setColorMode(systemTheme);
  }

  return (
    <main className="px-18 py-18">
      <Box
        className="flex"
        sx={{ flexDirection: "row", gap: 4, alignItems: "center", mb: 1 }}
      >
        <Image
          className="block h-8 w-auto"
          src={logo}
          height={50}
          width={150}
          alt="World Health Organization logo"
        />
        <Title>{Data.orgInfo.name} Open Source Dashboard</Title>
      </Box>
      <Text>
        This project includes metrics about the Open Source repositories for the
        {Data.orgInfo.name}.
      </Text>
      <TabGroup className="mt-6">
        <TabList>
          <Tab>Repositories</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RepositoriesTable />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
};
