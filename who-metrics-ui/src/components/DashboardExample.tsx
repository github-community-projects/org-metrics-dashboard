"use client";

import {
  Card,
  Grid,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  DeltaType,
} from "@tremor/react";

import { Box } from "@primer/react";
import Image from "next/image";
import logo from "@/images/who-logo-wide.svg";
import { ChartView } from "./";

import KpiCard from "./KpiCard";
import { PerformanceHistoryTable } from "./PerformanceHistoryTable";
import DarkModeButton from "./DarkModeButton";

type Kpi = {
  title: string;
  metric: string;
  progress: number;
  target: string;
  delta: string;
  deltaType: DeltaType;
};

const kpiData: Kpi[] = [
  {
    title: "Sales",
    metric: "$ 12,699",
    progress: 15.9,
    target: "$ 80,000",
    delta: "13.2%",
    deltaType: "moderateIncrease",
  },
  {
    title: "Profit",
    metric: "$ 45,564",
    progress: 36.5,
    target: "$ 125,000",
    delta: "23.9%",
    deltaType: "increase",
  },
  {
    title: "Customers",
    metric: "1,072",
    progress: 53.6,
    target: "2,000",
    delta: "10.1%",
    deltaType: "moderateDecrease",
  },
];

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
          alt="who logo"
        />
        <Title>Dashboard</Title>
      </Box>
      <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>
      <TabGroup className="mt-6">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Detail</Tab>
          </TabList>
          <DarkModeButton />
        </Box>
        <TabPanels>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <ChartView />
              </Card>
            </div>
            <Grid numItemsLg={3} className="mt-6 gap-6">
              {kpiData.map((item) => (
                <KpiCard
                  key={item.title}
                  title={item.title}
                  metric={item.metric}
                  progress={item.progress}
                  target={item.target}
                  delta={item.delta}
                  deltaType={item.deltaType}
                />
              ))}
            </Grid>
            <div className="mt-6">
              <Card>
                <ChartView />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <PerformanceHistoryTable />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
};
