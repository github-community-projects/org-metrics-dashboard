"use client";

import {
  BadgeDelta,
  Card,
  DeltaType,
  Flex,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";

type KpiCardProps = {
  title: string;
  metric: string;
  delta: string;
  deltaType: string;
  target: string;
  progress: number;
};

const KpiCard = ({
  title,
  metric,
  delta,
  deltaType,
  target,
  progress,
}: KpiCardProps) => {
  return (
    <Card className="max-w-lg mx-auto">
      <Flex alignItems="start">
        <div className="truncate">
          <Text>{title}</Text>
          <Metric className="truncate">{metric}</Metric>
        </div>
        <BadgeDelta deltaType={deltaType as DeltaType}>{delta}</BadgeDelta>
      </Flex>
      <Flex className="mt-4">
        <Text className="truncate">{`${progress}% (${metric})`}</Text>
        <Text>{target}</Text>
      </Flex>
      <ProgressBar value={progress} className="mt-2" />
    </Card>
  );
};
export default KpiCard;
