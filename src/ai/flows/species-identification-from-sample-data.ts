'use server';
/**
 * @fileOverview A species identification AI agent.
 *
 * - identifySpecies - A function that handles the species identification process.
 * - IdentifySpeciesInput - The input type for the identifySpecies function.
 * - IdentifySpeciesOutput - The return type for the identifySpecies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifySpeciesInputSchema = z.object({
  sampleData: z
    .string()
    .describe(
      'Biological sample data, such as DNA sequences, morphological measurements, or taxonomic information.'
    ),
});
export type IdentifySpeciesInput = z.infer<typeof IdentifySpeciesInputSchema>;

const IdentifySpeciesOutputSchema = z.object({
  speciesIdentification: z.object({
    speciesName: z.string().describe('The identified species name.'),
    confidenceLevel: z.number().describe('The confidence level of the identification (0-1).'),
    relevantInformation: z.string().describe('Relevant information about the identified species.'),
  }),
});
export type IdentifySpeciesOutput = z.infer<typeof IdentifySpeciesOutputSchema>;

export async function identifySpecies(input: IdentifySpeciesInput): Promise<IdentifySpeciesOutput> {
  return identifySpeciesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifySpeciesPrompt',
  input: {schema: IdentifySpeciesInputSchema},
  output: {schema: IdentifySpeciesOutputSchema},
  prompt: `You are an expert marine biologist specializing in species identification.

  Based on the provided biological sample data, identify the species and provide relevant information.

  Sample Data: {{{sampleData}}}
  `,
});

const identifySpeciesFlow = ai.defineFlow(
  {
    name: 'identifySpeciesFlow',
    inputSchema: IdentifySpeciesInputSchema,
    outputSchema: IdentifySpeciesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
