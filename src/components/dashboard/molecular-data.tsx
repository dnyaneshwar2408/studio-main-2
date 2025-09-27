
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContext, useMemo } from "react";
import { DataContext } from "@/context/data-context";
import { Skeleton } from "../ui/skeleton";


export function MolecularData() {
  const { toast } = useToast();
  const { uploadedData, selectedSpecies } = useContext(DataContext);

  const handleActionClick = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Detailed sample actions are not yet implemented.",
    });
  };

  const molecularData = useMemo(() => {
     if (!selectedSpecies) return [];
     return uploadedData
        .filter(d => d['Fish_Species'] === selectedSpecies)
        .map(d => ({
            id: d['Sample_ID'],
            species: d['Fish_Species'],
            coiMarker: d['COI_Marker'],
            rrnaMarker: d['16S_rRNA_Marker'],
            // AI-based confidence score can be added here in the future
            confidence: Math.random() * (0.99 - 0.90) + 0.90,
        }));
  }, [uploadedData, selectedSpecies]);

  if (!selectedSpecies) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Molecular Data Management</CardTitle>
                <CardDescription>Select a species to see molecular data.</CardDescription>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[200px] w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Molecular Data for {selectedSpecies}</CardTitle>
        <CardDescription>
          Secure storage and retrieval of molecular and eDNA data.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {molecularData.length > 0 ? (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Sample ID</TableHead>
                <TableHead>COI Marker</TableHead>
                <TableHead>16S rRNA</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {molecularData.map((sample) => (
                <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell className="font-mono text-xs">{sample.coiMarker.substring(0, 15)}</TableCell>
                    <TableCell className="font-mono text-xs">{sample.rrnaMarker.substring(0, 15)}</TableCell>
                    <TableCell className="text-right">
                    {(sample.confidence * 100).toFixed(0)}%
                    </TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={handleActionClick}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        ) : (
            <p className="text-sm text-muted-foreground text-center">No molecular data available for this species.</p>
        )}
      </CardContent>
    </Card>
  );
}
