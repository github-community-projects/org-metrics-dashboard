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
  BadgeDelta,
  DeltaType,
  Flex,
  Metric,
  ProgressBar,
  AreaChart,
  Color,
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";

import { InfoIcon } from '@primer/octicons-react'
import {Tooltip} from '@primer/react'

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

export type SalesPerson = {
  name: string;
  leads: number;
  sales: string;
  quota: string;
  variance: string;
  region: string;
  status: string;
};

export const salesPeople: SalesPerson[] = [
  {
    name: "Peter Doe",
    leads: 45,
    sales: "1,000,000",
    quota: "1,200,000",
    variance: "low",
    region: "Region A",
    status: "overperforming",
  },
  {
    name: "Lena Whitehouse",
    leads: 35,
    sales: "900,000",
    quota: "1,000,000",
    variance: "low",
    region: "Region B",
    status: "average",
  },
  {
    name: "Phil Less",
    leads: 52,
    sales: "930,000",
    quota: "1,000,000",
    variance: "medium",
    region: "Region C",
    status: "underperforming",
  },
  {
    name: "John Camper",
    leads: 22,
    sales: "390,000",
    quota: "250,000",
    variance: "low",
    region: "Region A",
    status: "overperforming",
  },
  {
    name: "Max Balmoore",
    leads: 49,
    sales: "860,000",
    quota: "750,000",
    variance: "low",
    region: "Region B",
    status: "overperforming",
  },
];

const deltaTypes: { [key: string]: DeltaType } = {
  average: "unchanged",
  overperforming: "moderateIncrease",
  underperforming: "moderateDecrease",
};

export default function DashboardExample() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKpi = kpiList[selectedIndex];
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const isSalesPersonSelected = (salesPerson: SalesPerson) =>
    (salesPerson.status === selectedStatus || selectedStatus === "all") &&
    (selectedNames.includes(salesPerson.name) || selectedNames.length === 0);

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
    <main className="px-12 py-12">
      <Title>Dashboard</Title>
      <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Detail</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsLg={3} className="mt-6 gap-6">
              {kpiData.map((item) => (
                <Card key={item.title}>
                  <Flex alignItems="start">
                    <div className="truncate">
                      <Text>{item.title}</Text>
                      <Metric className="truncate">{item.metric}</Metric>
                    </div>
                    <BadgeDelta deltaType={item.deltaType}>{item.delta}</BadgeDelta>
                  </Flex>
                  <Flex className="mt-4 space-x-2">
                    <Text className="truncate">{`${item.progress}% (${item.metric})`}</Text>
                    <Text>{item.target}</Text>
                  </Flex>
                  <ProgressBar value={item.progress} className="mt-2" />
                </Card>
              ))}
            </Grid>
            <div className="mt-6">
              <Card>
                <>
                  <div className="md:flex justify-between">
                    <div>
                      <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
                        <Title> Performance History </Title>
                        <Tooltip aria-label="Shows daily increase or decrease of particular domain">
                            <InfoIcon size={24} />
                        </Tooltip>
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
                    <AreaChart
                      {...areaChartArgs}
                      startEndOnly={true}
                      showGradient={false}
                      showYAxis={false}
                    />
                  </div>
                </>
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <>
                  <div>
                    <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
                      <Title> Performance History </Title>
                      <Tooltip aria-label="Shows daily increase or decrease of particular domain">
                        <InfoIcon size={24} />
                    </Tooltip>
                    </Flex>
                  </div>
                  <div className="flex space-x-2">
                    <MultiSelect
                      className="max-w-full sm:max-w-xs"
                      onValueChange={setSelectedNames}
                      placeholder="Select Salespeople..."
                    >
                      {salesPeople.map((item) => (
                        <MultiSelectItem key={item.name} value={item.name}>
                          {item.name}
                        </MultiSelectItem>
                      ))}
                    </MultiSelect>
                    <Select
                      className="max-w-full sm:max-w-xs"
                      defaultValue="all"
                      onValueChange={setSelectedStatus}
                    >
                      <SelectItem value="all">All Performances</SelectItem>
                      <SelectItem value="overperforming">Overperforming</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="underperforming">Underperforming</SelectItem>
                    </Select>
                  </div>
                  <Table className="mt-6">
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell className="text-right">Leads</TableHeaderCell>
                        <TableHeaderCell className="text-right">Sales ($)</TableHeaderCell>
                        <TableHeaderCell className="text-right">Quota ($)</TableHeaderCell>
                        <TableHeaderCell className="text-right">Variance</TableHeaderCell>
                        <TableHeaderCell className="text-right">Region</TableHeaderCell>
                        <TableHeaderCell className="text-right">Status</TableHeaderCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {salesPeople
                        .filter((item) => isSalesPersonSelected(item))
                        .map((item) => (
                          <TableRow key={item.name}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">{item.leads}</TableCell>
                            <TableCell className="text-right">{item.sales}</TableCell>
                            <TableCell className="text-right">{item.quota}</TableCell>
                            <TableCell className="text-right">{item.variance}</TableCell>
                            <TableCell className="text-right">{item.region}</TableCell>
                            <TableCell className="text-right">
                              <BadgeDelta deltaType={deltaTypes[item.status]} size="xs">
                                {item.status}
                              </BadgeDelta>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </>
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}