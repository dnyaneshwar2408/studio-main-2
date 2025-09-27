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
};

export function TrendVisualization() {
  const { uploadedData, selectedSpecies } = useContext(DataContext);

  // No changes needed here, this logic is sound.
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

            // FIX: Check if the parsed value is a valid number before pushing it.
            const temp = parseFloat(row['Sea_Surface_Temp(°C)']);
            const salinity = parseFloat(row['Salinity(PSU)']);

            if (!isNaN(temp)) {
              acc[month].temps.push(temp);
            }
            if (!isNaN(salinity)) {
              acc[month].salinities.push(salinity);
            }
        }
        return acc;
    }, {} as Record<string, { temps: number[], salinities: number[] }>);

    return monthOrder.map(month => {
        const data = dataByMonth[month];
        // Ensure there is data to average
        if (!data || data.temps.length === 0 || data.salinities.length === 0) {
          return { month, temp: null, salinity: null };
        }
        
        const avgTemp = data.temps.reduce((a, b) => a + b, 0) / data.temps.length;
        const avgSalinity = data.salinities.reduce((a, b) => a + b, 0) / data.salinities.length;

        // FIX: Return numbers, not strings. Formatting will be handled by the tooltip.
        return { month, temp: avgTemp, salinity: avgSalinity };
    }).filter(d => d.temp !== null);
  }, [filteredData]);

  const biodiversityData = useMemo(() => {
     const dataByYear = filteredData.reduce((acc, row) => {
        const year = row['Year'];
        if (year) {
            if (!acc[year]) {
                acc[year] = { richness: [], abundance: [] };
            }
            
            // FIX: Check if the parsed value is a valid number before pushing it.
            const richness = parseInt(row['Species_Richness'], 10);
            const abundance = parseInt(row['Fish_Abundance'], 10);

            if (!isNaN(richness)) {
              acc[year].richness.push(richness);
            }
            if (!isNaN(abundance)) {
              acc[year].abundance.push(abundance);
            }
        }
        return acc;
    }, {} as Record<string, { richness: number[], abundance: number[] }>);

    return Object.keys(dataByYear).sort().map(year => {
        const data = dataByYear[year];
        if (!data || data.richness.length === 0 || data.abundance.length === 0) {
          return { year, speciesCount: null, biomass: null };
        }

        const avgRichness = data.richness.reduce((a, b) => a + b, 0) / data.richness.length;
        const avgAbundance = data.abundance.reduce((a, b) => a + b, 0) / data.abundance.length;
        
        return { year, speciesCount: avgRichness, biomass: avgAbundance };
    }).filter(d => d.speciesCount !== null);
  }, [filteredData]);
  
  // This empty state is already perfect.
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

  // The JSX rendering part is also correct.
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
                  <Tooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => typeof value === 'number' ? value.toFixed(1) : value} 
                    />} 
                  />
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