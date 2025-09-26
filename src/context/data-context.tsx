
"use client";

import React, { createContext, useState, ReactNode } from 'react';

type DataContextType = {
  isDataUploaded: boolean;
  setIsDataUploaded: (isUploaded: boolean) => void;
  uploadedData: any[];
  setUploadedData: (data: any[]) => void;
  species: string[];
  setSpecies: (species: string[]) => void;
  selectedSpecies: string | null;
  setSelectedSpecies: (species: string | null) => void;
  handleUploadComplete: (data: any[], species: string[]) => void;
};

export const DataContext = createContext<DataContextType>({
  isDataUploaded: false,
  setIsDataUploaded: () => {},
  uploadedData: [],
  setUploadedData: () => {},
  species: [],
  setSpecies: () => {},
  selectedSpecies: null,
  setSelectedSpecies: () => {},
  handleUploadComplete: () => {},
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [isDataUploaded, setIsDataUploaded] = useState(false);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [species, setSpecies] = useState<string[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

  const handleUploadComplete = (data: any[], uniqueSpecies: string[]) => {
    setUploadedData(data);
    setSpecies(uniqueSpecies);
    if (uniqueSpecies.length > 0) {
        setSelectedSpecies(uniqueSpecies[0]);
    }
    setIsDataUploaded(true);
  };

  return (
    <DataContext.Provider value={{ 
        isDataUploaded, setIsDataUploaded,
        uploadedData, setUploadedData,
        species, setSpecies,
        selectedSpecies, setSelectedSpecies,
        handleUploadComplete
    }}>
      {children}
    </DataContext.Provider>
  );
};
