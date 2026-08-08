import { scrollToSectionTool } from "./scrollToSection";
import type { VapiToolDefinition, VapiToolHandler } from "./types";

const tools: VapiToolDefinition[] = [
  { name: "scrollToSection", handler: scrollToSectionTool },
];

const byName = new Map<string, VapiToolHandler>(
  tools.map((t) => [t.name, t.handler])
);

export function getToolHandler(name: string): VapiToolHandler | undefined {
  return byName.get(name);
}

export function listRegisteredTools(): string[] {
  return tools.map((t) => t.name);
}

/** Register additional client tools at runtime if needed later. */
export function registerTool(definition: VapiToolDefinition): void {
  tools.push(definition);
  byName.set(definition.name, definition.handler);
  console.log("[vapi/tools] registered tool:", definition.name);
}
