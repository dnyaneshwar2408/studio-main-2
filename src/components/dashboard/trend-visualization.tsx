"use client"

import { useMemo, useContext } from "react";
import { Line, LineChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataContext } from "@/context/data-context";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  temp: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-1))",
  },
  salinity: {
    label: "Salinity (PSU)",
    color: "hsl(var(--chart-2))",
  },
  speciesCount: {
    label: "Species Richness",
    color: "hsl(var(--chart-1))",
  },
  biomass: {
    label: "Fish Abundance",
    color: "hsl(var(--chart-2))",
  },
}

export function TrendVisualization() {
  const { uploadedData, selectedSpecies } = useContext(DataContext);

  const filteredData = useMemo(() => {
    if (!selectedSpecies) return [];
    return uploadedData.filter(d => d['Fish_Species'] === selectedSpecies);
  }, [uploadedData, selectedSpecies]);


  const oceanData = useMemo(() => {
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dataByMonth = filteredData.reduce((acc, row) => {
        const month = row['Month'];
        if (month) {
            if (!acc[month]) {
                acc[month] = { temps: [], salinities: [] };
            }
            acc[month].temps.push(parseFloat(row['Sea_Surface_Temp(°C)']));
            acc[month].salinities.push(parseFloat(row['Salinity(PSU)']));
        }
        return acc;
    }, {} as Record<string, { temps: number[], salinities: number[] }>);

    return monthOrder.map(month => {
        const data = dataByMonth[month];
        if (!data) return { month, temp: null, salinity: null };
        const avgTemp = data.temps.reduce((a, b) => a + b, 0) / data.temps.length;
        const avgSalinity = data.salinities.reduce((a, b) => a + b, 0) / data.salinities.length;
        return { month, temp: avgTemp.toFixed(1), salinity: avgSalinity.toFixed(1) };
    }).filter(d => d.temp !== null);
  }, [filteredData]);

  const biodiversityData = useMemo(() => {
     const dataByYear = filteredData.reduce((acc, row) => {
        const year = row['Year'];
        if (year) {
            if (!acc[year]) {
                acc[year] = { richness: [], abundance: [] };
            }
            acc[year].richness.push(parseInt(row['Species_Richness']));
            acc[year].abundance.push(parseInt(row['Fish_Abundance']));
        }
        return acc;
    }, {} as Record<string, { richness: number[], abundance: number[] }>);

    return Object.keys(dataByYear).sort().map(year => {
        const data = dataByYear[year];
        const avgRichness = data.richness.reduce((a, b) => a + b, 0) / data.richness.length;
        const avgAbundance = data.abundance.reduce((a, b) => a + b, 0) / data.abundance.length;
        return { year, speciesCount: avgRichness, biomass: avgAbundance };
    });
  }, [filteredData]);
  
  if (!selectedSpecies) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle>Trend Visualization</CardTitle>
                  <CardDescription>Select a species to see trend visualizations.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-[300px] w-full" />
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Visualization for {selectedSpecies}</CardTitle>
        <CardDescription>
          Interactive visualizations for oceanographic and biodiversity trends.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="oceanographic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oceanographic">Oceanographic</TabsTrigger>
            <TabsTrigger value="biodiversity">Biodiversity</TabsTrigger>
          </TabsList>
          <TabsContent value="oceanographic">
             <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer>
                <LineChart data={oceanData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line dataKey="temp" type="monotone" stroke="var(--color-temp)" strokeWidth={2} dot={false} name="Temperature" />
                  <Line dataKey="salinity" type="monotone" stroke="var(--color-salinity)" strokeWidth={2} dot={false} name="Salinity" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="biodiversity">
             <ChartContainer config={chartConfig} className="h-[250px] w-full">
               <ResponsiveContainer>
                <LineChart data={biodiversityData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line dataKey="speciesCount" type="monotone" stroke="var(--color-speciesCount)" strokeWidth={2} dot={false} name="Species Richness"/>
                  <Line dataKey="biomass" type="monotone" stroke="var(--color-biomass)" strokeWidth={2} dot={false} name="Fish Abundance"/>
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
