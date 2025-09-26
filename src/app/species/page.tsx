
"use client";

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { TaxonomicClassification } from '@/components/dashboard/taxonomic-classification';
import { MolecularData } from '@/components/dashboard/molecular-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useContext } from 'react';
import { DataContext } from '@/context/data-context';


export default function SpeciesPage() {
    const { species, selectedSpecies, setSelectedSpecies } = useContext(DataContext);

    return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="p-4 md:p-6 lg:p-8">
             <div className="grid auto-rows-max items-start gap-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Species Details</h1>
                     <Select value={selectedSpecies ?? ""} onValueChange={(value) => setSelectedSpecies(value || null)}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select a species" />
                        </SelectTrigger>
                        <SelectContent>
                            {species.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <TaxonomicClassification />
                    <MolecularData />
                </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
