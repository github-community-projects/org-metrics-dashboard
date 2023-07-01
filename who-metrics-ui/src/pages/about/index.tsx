/* eslint-disable filenames/match-regex */
import { Card, Metric, Text, Flex, Grid } from "@tremor/react";
import Chart from "../../components/Chart";

const categories: Array<{
  title: string;
  metric: string;
  metricPrev: string;
}> = [
  {
    title: "Sales",
    metric: "$ 12,699",
    metricPrev: "$ 9,456",
  },
  {
    title: "Profit",
    metric: "$ 40,598",
    metricPrev: "$ 45,564",
  },
  {
    title: "Customers",
    metric: "1,072",
    metricPrev: "856",
  },
];

export default function PlaygroundPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Grid className="gap-6" numItemsSm={2} numItemsLg={3}>
        {categories.map((item) => (
          <Card key={item.title}>
            <Flex alignItems="start">
              <Text>{item.title}</Text>
            </Flex>
            <Flex
              className="space-x-3 truncate"
              justifyContent="start"
              alignItems="baseline"
            >
              <Metric>{item.metric}</Metric>
              <Text className="truncate">from {item.metricPrev}</Text>
            </Flex>
          </Card>
        ))}
      </Grid>
      <Chart />
    </main>
  );
}
