export { handleVapiMessage } from "./handleVapiMessage";
export { getToolHandler, listRegisteredTools, registerTool } from "./tools/registry";
export { scrollToSectionTool, SECTION_IDS, SECTION_ALIASES } from "./tools/scrollToSection";
export type {
  VapiIncomingMessage,
  VapiToolArgs,
  VapiToolCall,
  VapiToolContext,
  VapiToolDefinition,
  VapiToolHandler,
} from "./tools/types";
