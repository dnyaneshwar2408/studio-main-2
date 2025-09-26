import type { IdentifySpeciesOutput as AIOutputType } from '@/ai/flows/species-identification-from-sample-data';
import type { AskAssistantInput as AskAssistantInputType, AskAssistantOutput as AskAssistantOutputType } from '@/ai/flows/assistant-flow';

export type IdentifySpeciesOutput = AIOutputType;
export type AskAssistantInput = AskAssistantInputType;
export type AskAssistantOutput = AskAssistantOutputType;
