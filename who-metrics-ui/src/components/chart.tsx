'use client';

import { Card, AreaChart, Title, Text } from '@tremor/react';

const data = [
  {
    Month: 'Jan 21',
    Sales: 2890,
    Profit: 2400
  },
  {
    Month: 'Feb 21',
    Sales: 1890,
    Profit: 1398
  },
  {
    Month: 'March 22',
    Sales: 3890,
    Profit: 2980
  },
  {
    Month: 'Jan 22',
    Sales: 3500,
    Profit: 2780
  },
  {
    Month: 'Jan 22',
    Sales: 5890,
    Profit: 4980
  },
  {
    Month: 'Jan 22',
    Sales: 3890,
    Profit: 2980
  }
];

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export default function Chart() {
  return (
    <Card className="mt-8">
      <Title>Performance</Title>
      <Text>Comparison between Sales and Profit</Text>
      <AreaChart
        className="mt-4 h-80"
        data={data}
        categories={['Sales', 'Profit']}
        index="Month"
        colors={['indigo', 'fuchsia']}
        valueFormatter={valueFormatter}
        curveType="natural"
      />
    </Card>
  );
}
