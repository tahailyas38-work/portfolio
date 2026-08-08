import type Vapi from "@vapi-ai/web";
import { getToolHandler, listRegisteredTools } from "./tools/registry";
import type {
  VapiIncomingMessage,
  VapiToolArgs,
  VapiToolCall,
  VapiToolContext,
} from "./tools/types";

function parseArgs(raw: unknown): VapiToolArgs {
  console.log("[vapi] parseArgs input:", raw, typeof raw);

  if (raw == null) return {};

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw || "{}") as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as VapiToolArgs;
      }
      console.warn("[vapi] parsed args were not an object:", parsed);
      return {};
    } catch (err) {
      console.error("[vapi] Failed to parse tool arguments JSON:", err, raw);
      return {};
    }
  }

  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as VapiToolArgs;
  }

  return {};
}

function extractNameAndArgs(call: VapiToolCall): {
  name: string | undefined;
  args: VapiToolArgs;
  toolCallId: string | undefined;
} {
  const name = call.function?.name ?? call.name;
  const rawArgs =
    call.function?.arguments ?? call.arguments ?? call.parameters ?? {};
  const args = parseArgs(rawArgs);
  const toolCallId = call.id;

  console.log("[vapi] extracted tool call:", { name, args, toolCallId });
  return { name, args, toolCallId };
}

/**
 * Acknowledge tool completion to Vapi when possible.
 * Official client tools are fire-and-forget, but async tools / some setups
 * expect a result. Prefer add-message (typed in SDK); also try tool-calls result.
 */
function sendToolResult(
  vapi: Vapi | null,
  toolCallId: string | undefined,
  name: string,
  result: string
) {
  if (!vapi) {
    console.log("[vapi] skip tool result — no vapi instance");
    return;
  }

  console.log("[vapi] sending tool result:", { toolCallId, name, result });

  try {
    // Typed Live Call Control path: inject tool role message into history.
    if (toolCallId) {
      vapi.send({
        type: "add-message",
        message: {
          role: "tool",
          tool_call_id: toolCallId,
          content: result,
        },
        triggerResponseEnabled: false,
      });
      console.log("[vapi] sent add-message tool result");
    }
  } catch (err) {
    console.warn("[vapi] add-message tool result failed:", err);
  }

  // Some community / async-tool setups expect this untyped payload.
  try {
    // Cast: not in VapiClientToServerMessage typings, but accepted by Live Call Control.
    (vapi as Vapi & { send: (msg: unknown) => void }).send({
      type: "tool-calls-result",
      toolCallResult: {
        toolCallId,
        name,
        result,
      },
    });
    console.log("[vapi] sent tool-calls-result");
  } catch (err) {
    console.warn("[vapi] tool-calls-result send failed (ok for client-only tools):", err);
  }
}

async function runToolCall(
  call: VapiToolCall,
  ctx: VapiToolContext
): Promise<void> {
  const { name, args, toolCallId } = extractNameAndArgs(call);

  if (!name) {
    console.warn("[vapi] tool call missing function name:", call);
    return;
  }

  const handler = getToolHandler(name);
  if (!handler) {
    console.warn(
      `[vapi] no handler for tool "${name}". Registered:`,
      listRegisteredTools()
    );
    sendToolResult(ctx.vapi, toolCallId, name, `Unknown tool: ${name}`);
    return;
  }

  console.log(`[vapi] executing tool "${name}"`);
  try {
    const result = await handler(args, ctx);
    console.log(`[vapi] tool "${name}" result:`, result);
    sendToolResult(ctx.vapi, toolCallId, name, result);
  } catch (err) {
    console.error(`[vapi] tool "${name}" threw:`, err);
    sendToolResult(
      ctx.vapi,
      toolCallId,
      name,
      `Tool error: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

function collectToolCalls(msg: VapiIncomingMessage): VapiToolCall[] {
  if (Array.isArray(msg.toolCallList) && msg.toolCallList.length > 0) {
    console.log("[vapi] using msg.toolCallList");
    return msg.toolCallList;
  }
  if (Array.isArray(msg.toolCalls) && msg.toolCalls.length > 0) {
    console.log("[vapi] using msg.toolCalls");
    return msg.toolCalls;
  }
  return [];
}

/**
 * Handle every Vapi `message` event. Logs full payload, then dispatches tools
 * for tool-calls / function-call shapes without assuming a single event type.
 */
export async function handleVapiMessage(
  msg: VapiIncomingMessage,
  ctx: VapiToolContext
): Promise<void> {
  console.log("Vapi message:", msg);

  if (msg.toolCallList) {
    console.log("msg.toolCallList:", msg.toolCallList);
  }
  if (msg.functionCall) {
    console.log("msg.functionCall:", msg.functionCall);
  }
  if (msg.toolCalls) {
    console.log("msg.toolCalls:", msg.toolCalls);
  }

  const type = msg.type;
  console.log("[vapi] message type:", type);

  // Primary path: tool-calls (current Vapi client message)
  if (type === "tool-calls" || type === "tool-call") {
    const calls = collectToolCalls(msg);
    console.log("[vapi] tool-calls payload count:", calls.length);
    for (const call of calls) {
      await runToolCall(call, ctx);
    }
    return;
  }

  // Legacy / alternate: function-call
  if (type === "function-call" && msg.functionCall) {
    const fc = msg.functionCall;
    const call: VapiToolCall = {
      id: undefined,
      function: {
        name: fc.name,
        arguments: fc.parameters ?? fc.arguments,
      },
    };
    console.log("[vapi] handling legacy function-call");
    await runToolCall(call, ctx);
    return;
  }

  // Fallback: payload has toolCallList even if type is unexpected
  const fallbackCalls = collectToolCalls(msg);
  if (fallbackCalls.length > 0) {
    console.log(
      "[vapi] found toolCallList/toolCalls on unexpected type — still dispatching"
    );
    for (const call of fallbackCalls) {
      await runToolCall(call, ctx);
    }
  }
}
