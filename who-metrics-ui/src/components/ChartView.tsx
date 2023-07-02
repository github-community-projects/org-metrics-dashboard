"use client";

import { InfoIcon } from "@primer/octicons-react";
import { Tooltip } from "@primer/react";
import {
  Flex,
  Title,
  AreaChart,
  Text,
  Color,
  Grid,
  Col,
  Card,
} from "@tremor/react";
import KpiCard from "./KpiCard";

const usNumberformatter = (number: number) =>
  Intl.NumberFormat("us").format(Number(number)).toString();

const Kpis = {
  Members: "Members",
  Collaborators: "Collaborators",
};

const kpiList = [Kpis.Members, Kpis.Collaborators];

export type DailyPerformance = {
  date: string;
  Members: number;
  Collaborators: number;
};

export const ChartView = () => {
  const performanceData = [];

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 2);

  for (let i = 0; i < 24; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    const members = Math.floor(Math.random() * 100) + 100;
    const collaborators = Math.floor(Math.random() * 200) + 50;
    performanceData.push({
      date: `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`,
      Members: members,
      Collaborators: collaborators,
    });
  }

  return (
    <>
      <div className="md:flex justify-between">
        <div>
          <Flex
            className="space-x-0.5"
            justifyContent="start"
            alignItems="center"
          >
            <Title> Performance History </Title>
            <Tooltip aria-label="Shows monthly contrinuters">
              <InfoIcon size={16} />
            </Tooltip>
          </Flex>
          <Text> Daily change per domain </Text>
        </div>
      </div>
      {/* web */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
        <Col numColSpan={1} numColSpanLg={2}>
          <Card className="">
            <AreaChart
              className="mt-5 h-72"
              data={performanceData}
              index={"date"}
              categories={kpiList}
              colors={["indigo", "cyan"] as Color[]}
              showLegend={false}
              valueFormatter={usNumberformatter}
              yAxisWidth={56}
              allowDecimals={false}
            />
          </Card>
        </Col>
        <Col
          numColSpan={1}
          style={{
            justifyContent: "space-between",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <KpiCard
            title="Open Source Health"
            metric="85%"
            progress={85}
            target="100%"
            color="pink"
          />
          <KpiCard
            title="Project Activities"
            metric="64%"
            progress={64}
            target="100%"
            color="green"
          />
        </Col>
      </Grid>
    </>
  );
};
