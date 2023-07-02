"use client";

import {
  BadgeDelta,
  Card,
  Color,
  DeltaType,
  Flex,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";

type KpiCardProps = {
  title: string;
  metric?: string;
  delta?: string;
  deltaType?: string;
  target: string;
  progress: number;
  color?: Color;
};

const KpiCard = ({
  title,
  metric,
  delta,
  deltaType,
  target,
  progress,
  color,
}: KpiCardProps) => {
  const merticTextVal: string = metric
    ? `${progress}% (${metric})`
    : `${progress}%`;
  return (
    <Card className="max-w-lg mx-auto">
      <Flex alignItems="start">
        <div className="truncate">
          <Text>{title}</Text>
          <Metric className="truncate">{metric}</Metric>
        </div>
        {delta && (
          <BadgeDelta deltaType={deltaType as DeltaType}>{delta}</BadgeDelta>
        )}
      </Flex>
      <Flex className="mt-4">
        <Text className="truncate">{merticTextVal}</Text>
        <Text>{target}</Text>
      </Flex>
      <ProgressBar value={progress} className="mt-2" color={color} />
    </Card>
  );
};
export default KpiCard;
