
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { identifySpeciesAction } from "@/app/actions";
import type { IdentifySpeciesOutput } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Analyzing..." : "Identify Species"}
    </Button>
  );
}

export function TaxonomicClassification() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(identifySpeciesAction, null);
  const [result, setResult] = useState<IdentifySpeciesOutput | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error) {
      const errorMsg =
        state.error.sampleData?.[0] || state.error._errors?.[0];
      if (errorMsg) {
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMsg,
        });
      }
    }
    if (state?.data) {
      setResult(state.data);
      formRef.current?.reset();
    }
  }, [state, toast]);

  const { pending } = useFormStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxonomic Classification</CardTitle>
        <CardDescription>
          Use AI to identify species from biological sample data.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="sampleData">Paste DNA sequences, morphological measurements,etc in cms.
</Label>
            <Textarea
              placeholder="Example format:
Standard Length, Head Length, Body Depth, Dorsal Fin Rays, Pectoral Fin Rays, Gill Rakers"
              id="sampleData"
              name="sampleData"
              required
              rows={6}
            />
          </div>
          {pending && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}
          {!pending && result && (
             <div className="p-4 border rounded-lg bg-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold font-headline">AI Identification Result</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Species Name:</span>
                  <span className="font-semibold">{result.speciesIdentification.speciesName}</span>
                </div>
                 <div className="flex justify-between items-center">
                  <span className="font-medium text-muted-foreground">Confidence:</span>
                  <Badge variant={result.speciesIdentification.confidenceLevel > 0.8 ? "default" : "secondary"} className="bg-accent text-accent-foreground">
                    {(result.speciesIdentification.confidenceLevel * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Relevant Information:</span>
                  <p className="pt-1 text-foreground/80">{result.speciesIdentification.relevantInformation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
