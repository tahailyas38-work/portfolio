import type Vapi from "@vapi-ai/web";

export type VapiToolArgs = Record<string, unknown>;

export type VapiToolContext = {
  vapi: Vapi | null;
};

export type VapiToolHandler = (
  args: VapiToolArgs,
  ctx: VapiToolContext
) => Promise<string> | string;

export type VapiToolDefinition = {
  name: string;
  handler: VapiToolHandler;
};

/** Loose shape for incoming Vapi client messages — inspect before assuming type. */
export type VapiIncomingMessage = {
  type?: string;
  toolCallList?: VapiToolCall[];
  toolCalls?: VapiToolCall[];
  functionCall?: {
    name?: string;
    parameters?: unknown;
    arguments?: unknown;
  };
  [key: string]: unknown;
};

export type VapiToolCall = {
  id?: string;
  type?: string;
  function?: {
    name?: string;
    arguments?: unknown;
  };
  name?: string;
  parameters?: unknown;
  arguments?: unknown;
};
