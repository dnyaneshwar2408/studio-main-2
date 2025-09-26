"use server";

import { identifySpecies, IdentifySpeciesInput } from "@/ai/flows/species-identification-from-sample-data";
import { askAssistant, AskAssistantInput } from "@/ai/flows/assistant-flow";
import { z } from "zod";

const identifySpeciesSchema = z.object({
  sampleData: z.string().min(10, { message: "Sample data must be at least 10 characters long." }),
});

export async function identifySpeciesAction(prevState: any, formData: FormData) {
  const validatedFields = identifySpeciesSchema.safeParse({
    sampleData: formData.get('sampleData'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await identifySpecies({ sampleData: validatedFields.data.sampleData });
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: { _errors: ["An unexpected error occurred. Please try again."] } };
  }
}

const askAssistantSchema = z.object({
  query: z.string().min(1, { message: "Query cannot be empty." }),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional(),
});

export async function askAssistantAction(input: AskAssistantInput) {
  const validatedFields = askAssistantSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const result = await askAssistant(validatedFields.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: { _errors: ["An unexpected error occurred. Please try again."] } };
  }
}
