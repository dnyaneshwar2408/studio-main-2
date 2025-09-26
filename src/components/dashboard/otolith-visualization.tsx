import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";
import { DataContext } from "@/context/data-context";
import { useContext, useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

export function OtolithVisualization() {
  const otolithImage = PlaceHolderImages.find((img) => img.id === "otolith");
  const { uploadedData, selectedSpecies } = useContext(DataContext);

  const morphometrics = useMemo(() => {
    if (!selectedSpecies) return null;
    
    const speciesData = uploadedData.filter(d => d['Fish_Species'] === selectedSpecies);
    if (speciesData.length === 0) return null;

    const firstRecord = speciesData[0];
    const length = parseFloat(firstRecord['Otolith_Length(mm)']);
    const width = parseFloat(firstRecord['Otolith_Width(mm)']);

    if (isNaN(length) || isNaN(width) || length === 0 || width === 0) return null;

    const area = (Math.PI * length * width) / 4; // Area of an ellipse
    const perimeter = Math.PI * (3 * (length + width) - Math.sqrt((3 * length + width) * (length + 3 * width))); // Ramanujan's approximation
    const circularity = (4 * Math.PI * area) / (perimeter * perimeter);
    const aspectRatio = length / width;

    return {
      area: `${area.toFixed(2)} mm²`,
      perimeter: `${perimeter.toFixed(2)} mm`,
      circularity: circularity.toFixed(2),
      aspectRatio: aspectRatio.toFixed(2)
    }

  }, [uploadedData, selectedSpecies]);


  if (!selectedSpecies) {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Otolith Visualization</CardTitle>
                <CardDescription>Select a species to see otolith morphometrics.</CardDescription>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[400px] w-full" />
            </CardContent>
        </Card>
    )
  }


  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Otolith Visualization for {selectedSpecies}</CardTitle>
        <CardDescription>
          Interactive module for otolith shapes and morphometrics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {otolithImage && (
          <div className="overflow-hidden rounded-lg border">
            <Image
              src={otolithImage.imageUrl}
              alt={otolithImage.description}
              data-ai-hint={otolithImage.imageHint}
              width={600}
              height={400}
              className="aspect-video w-full object-cover"
            />
          </div>
        )}
        <div>
          <h4 className="font-medium">Morphometrics</h4>
          <Separator className="my-2" />
          {morphometrics ? (
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Area:</span>
                <span className="font-mono text-foreground">{morphometrics.area}</span>
              </li>
              <li className="flex justify-between">
                <span>Perimeter:</span>
                <span className="font-mono text-foreground">{morphometrics.perimeter}</span>
              </li>
              <li className="flex justify-between">
                <span>Circularity:</span>
                <span className="font-mono text-foreground">{morphometrics.circularity}</span>
              </li>
              <li className="flex justify-between">
                <span>Aspect Ratio:</span>
                <span className="font-mono text-foreground">{morphometrics.aspectRatio}</span>
              </li>
            </ul>
          ) : (
             <p className="text-sm text-muted-foreground">No otolith data available for this species.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
