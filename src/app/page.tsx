
"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { DataIngestion } from '@/components/dashboard/data-ingestion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Fish, Beaker } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { DataContext } from '@/context/data-context';

export default function DashboardPage() {
  const { isDataUploaded, handleUploadComplete } = useContext(DataContext);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(loggedIn);
    if (!loggedIn) {
      router.push('/login');
    }
  }, [router]);


  if (isAuthenticated === null) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="space-y-4 p-8">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Or a redirect component
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="p-4 md:p-6 lg:p-8">
            {!isDataUploaded ? (
              <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
                <div className="w-full max-w-lg">
                   <DataIngestion onUploadComplete={handleUploadComplete} />
                </div>
              </div>
            ) : (
              <div className="grid auto-rows-max items-start gap-6 lg:grid-cols-3">
                 <div className="grid gap-6 lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome to SmartFishers</CardTitle>
                            <CardDescription>
                                Your data has been uploaded. Explore the analysis and visualization tools.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <Link href="/species" passHref>
                                <Button asChild variant="outline" className="w-full h-24 flex-col gap-2">
                                    <span>
                                        <Fish className="w-8 h-8"/>
                                        <span>Species Details</span>
                                    </span>
                                </Button>
                            </Link>
                             <Link href="/trends" passHref>
                                <Button asChild variant="outline" className="w-full h-24 flex-col gap-2">
                                    <span>
                                        <AreaChart className="w-8 h-8"/>
                                        <span>Trend Analysis</span>
                                    </span>
                                </Button>
                            </Link>
                             <Link href="/otolith" passHref>
                                <Button asChild variant="outline" className="w-full h-24 flex-col gap-2">
                                    <span>
                                        <Beaker className="w-8 h-8"/>
                                        <span>Otolith View</span>
                                    </span>
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-6 lg:col-span-3">
                  <DataIngestion onUploadComplete={handleUploadComplete} />
                </div>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
