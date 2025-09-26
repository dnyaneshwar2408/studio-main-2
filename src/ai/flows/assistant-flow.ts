'use server';
/**
 * @fileOverview An AI assistant for answering user queries.
 *
 * - askAssistant - A function that handles user queries.
 * - AskAssistantInput - The input type for the askAssistant function.
 * - AskAssistantOutput - The return type for the askAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s query for the AI assistant.'),
  history: z
    .array(z.object({role: z.enum(['user', 'model']), content: z.string()}))
    .optional()
    .describe('The conversation history.'),
});
export type AskAssistantInput = z.infer<typeof AskAssistantInputSchema>;

const AskAssistantOutputSchema = z.string().describe('The AI assistant\'s response.');
export type AskAssistantOutput = z.infer<typeof AskAssistantOutputSchema>;

export async function askAssistant(input: AskAssistantInput): Promise<AskAssistantOutput> {
  return assistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {schema: AskAssistantInputSchema},
  output: {schema: z.string()},
  prompt: `You are a helpful marine biology research assistant. Your goal is to provide accurate and concise information to researchers.
  
  {{#if history}}
  Here is the conversation history:
  {{#each history}}
  {{#if (eq role 'user')}}User: {{content}}{{/if}}
  {{#if (eq role 'model')}}Assistant: {{content}}{{/if}}
  {{/each}}
  {{/if}}

  User's latest query: {{{query}}}
  `,
  config: {
    temperature: 0.5,
  },
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AskAssistantInputSchema,
    outputSchema: AskAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
