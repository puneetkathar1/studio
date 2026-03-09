'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { marketPerformanceData } from '@/lib/data'
import type { ChartConfig } from '@/components/ui/chart'

const chartConfig = {
  bet: {
    label: 'BET',
    color: 'hsl(var(--primary))',
  },
  no_bet: {
    label: 'NO_BET',
    color: 'hsl(var(--destructive))',
  },
  wait: {
    label: 'WAIT',
    color: 'hsl(var(--secondary))',
  },
} satisfies ChartConfig

export default function DashboardChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={marketPerformanceData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="bet" fill="var(--color-bet)" radius={4} />
        <Bar dataKey="no_bet" fill="var(--color-no_bet)" radius={4} />
        <Bar dataKey="wait" fill="var(--color-wait)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
