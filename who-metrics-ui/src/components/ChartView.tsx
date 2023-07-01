"use client";

import { Flex, Title, Icon, TabGroup, TabList, Tab, AreaChart, Text, Color } from "@tremor/react";
import { useState } from "react";

const usNumberformatter = (number: number, decimals = 0) =>
  Intl.NumberFormat("us", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString();

const formatters: { [key: string]: any } = {
  Sales: (number: number) => `$ ${usNumberformatter(number)}`,
  Profit: (number: number) => `$ ${usNumberformatter(number)}`,
  Customers: (number: number) => `${usNumberformatter(number)}`,
  Delta: (number: number) => `${usNumberformatter(number, 2)}%`,
};

const Kpis = {
  Sales: "Sales",
  Profit: "Profit",
  Customers: "Customers",
};

const kpiList = [Kpis.Sales, Kpis.Profit, Kpis.Customers];

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

const ChartView = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKpi = kpiList[selectedIndex];

  const areaChartArgs = {
    className: "mt-5 h-72",
    data: performance,
    index: "date",
    categories: [selectedKpi],
    colors: ["blue"] as Color[],
    showLegend: false,
    valueFormatter: formatters[selectedKpi],
    yAxisWidth: 56,
  };

  return (
    <>
      <div className="md:flex justify-between">
        <div>
          <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
            <Title> Performance History </Title>
            {/* <Icon
              icon={null}
              variant="simple"
              tooltip="Shows daily increase or decrease of particular domain"
            /> */}
          </Flex>
          <Text> Daily change per domain </Text>
        </div>
        <div>
          <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex}>
            <TabList color="gray" variant="solid">
              <Tab>Sales</Tab>
              <Tab>Profit</Tab>
              <Tab>Customers</Tab>
            </TabList>
          </TabGroup>
        </div>
      </div>
      {/* web */}
      <div className="mt-8 hidden sm:block">
        <AreaChart {...areaChartArgs} />
      </div>
      {/* mobile */}
      <div className="mt-8 sm:hidden">
        <AreaChart {...areaChartArgs} startEndOnly={true} showGradient={false} showYAxis={false} />
      </div>
    </>
  );
}

export default ChartView;