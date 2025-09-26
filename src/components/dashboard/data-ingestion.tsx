"use client";

import { useState, useRef, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { DataContext } from "@/context/data-context";
import Papa from "papaparse";


type DataIngestionProps = {
  onUploadComplete: (data: any[], species: string[]) => void;
};

export function DataIngestion({ onUploadComplete }: DataIngestionProps) {
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please choose a file to upload.",
      });
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 99) {
           clearInterval(interval);
           return 100;
        }
        return prev + 10;
      });
    }, 200);

    Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            clearInterval(interval);
            setUploadProgress(100);

            const speciesSet = new Set<string>();
            results.data.forEach((row: any) => {
                if(row.Fish_Species) {
                    speciesSet.add(row.Fish_Species);
                }
            });
            const uniqueSpecies = Array.from(speciesSet);

            setTimeout(() => {
                setIsUploading(false);
                setFileName("");
                setSelectedFile(null);
                if(fileInputRef.current) fileInputRef.current.value = "";
                toast({
                  title: "Upload Complete",
                  description: `${fileName} has been successfully ingested and standardized.`,
                });
                onUploadComplete(results.data, uniqueSpecies);
            }, 500);
        },
        error: (error) => {
            clearInterval(interval);
            setIsUploading(false);
            toast({
                variant: "destructive",
                title: "Error parsing CSV",
                description: error.message,
            });
        }
    })
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Ingestion</CardTitle>
        <CardDescription>
          Upload oceanographic, taxonomic, or molecular datasets to begin analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors" onClick={handleButtonClick}>
          <UploadCloud className="w-10 h-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">CSV, FASTA, netCDF, etc.</p>
          <Input 
            ref={fileInputRef}
            id="file-upload" 
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
            accept=".csv"
          />
        </div>
        {fileName && !isUploading && (
          <p className="text-sm text-center text-muted-foreground">
            Selected file: <span className="font-medium text-foreground">{fileName}</span>
          </p>
        )}
        {isUploading && (
          <div className="space-y-2">
             <p className="text-sm text-center text-muted-foreground">
              Uploading <span className="font-medium text-foreground">{fileName}</span>...
            </p>
            <Progress value={uploadProgress} />
          </div>
        )}
        <Button onClick={handleUpload} disabled={isUploading || !fileName} className="w-full">
          {isUploading ? "Uploading..." : "Upload and Standardize"}
        </Button>
      </CardContent>
    </Card>
  );
}
