"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { LoaderCircle, Mic, Volume2, X } from "lucide-react";
import Vapi from "@vapi-ai/web";
import {
  handleVapiMessage,
  type VapiIncomingMessage,
} from "@/lib/vapi";

/** Public frontend credentials only — never put private keys here. */
const VAPI_PUBLIC_KEY = "12aa5533-8750-4b68-a79f-f894cd18a2f7";
const VAPI_ASSISTANT_ID = "b9d837fd-2f9c-4776-aae8-72d3292d968a";

type CallStatus = "idle" | "listening" | "thinking" | "speaking";

type TranscriptMessage = VapiIncomingMessage & {
  type?: string;
  role?: string;
  transcript?: string;
  transcriptType?: string;
  status?: string;
};

const spring = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.8 };

type TalkContextValue = {
  status: CallStatus;
  caption: string;
  toast: string | null;
  inCall: boolean;
  startCall: () => Promise<void>;
  endCall: () => void;
  clearToast: () => void;
};

const TalkContext = createContext<TalkContextValue | null>(null);

function useTalk() {
  const ctx = useContext(TalkContext);
  if (!ctx) throw new Error("useTalk must be used within TalkToTahaProvider");
  return ctx;
}

function PulsingMic() {
  return (
    <div className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
      <span className="talk-mic-ring absolute inset-[-4px] rounded-full bg-[#0071e3]/20" />
      <span className="talk-mic-ring talk-mic-ring--delay absolute inset-[-4px] rounded-full bg-[#0071e3]/12" />
      <Mic className="talk-mic-pulse relative h-[15px] w-[15px] text-[#0071e3]" strokeWidth={2.1} />
    </div>
  );
}

function PulsingVolume() {
  return (
    <div className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
      <Volume2 className="talk-volume-pulse h-[15px] w-[15px] text-[#0071e3]" strokeWidth={2.1} />
    </div>
  );
}

function ThinkingSpinner() {
  return (
    <div className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
      <LoaderCircle className="talk-think-spin h-[15px] w-[15px] text-[#0071e3]" strokeWidth={2.1} />
    </div>
  );
}

function StatusGlyph({ status }: { status: CallStatus }) {
  return (
    <div className="relative flex h-5 w-7 shrink-0 items-center justify-center" aria-hidden="true">
      <AnimatePresence mode="wait" initial={false}>
        {status === "listening" && (
          <motion.span
            key="listen-mic"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
          >
            <PulsingMic />
          </motion.span>
        )}
        {status === "thinking" && (
          <motion.span
            key="think"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
          >
            <ThinkingSpinner />
          </motion.span>
        )}
        {status === "speaking" && (
          <motion.span
            key="talk"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
          >
            <PulsingVolume />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 3200);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none max-w-[280px] rounded-[20px] border border-white/50 bg-white/80 px-4 py-3 text-[12.5px] font-medium text-gray-800 shadow-[0_10px_28px_rgba(15,23,42,0.12)] backdrop-blur-xl"
    >
      {message}
    </motion.div>
  );
}

function MicPermissionSheet({
  open,
  busy,
  hint,
  onAllow,
  onClose,
}: {
  open: boolean;
  busy: boolean;
  hint: string;
  onAllow: () => void;
  onClose: () => void;
}) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[130] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="mic-perm-title">
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div className="relative z-[1] w-full max-w-sm rounded-[24px] border border-[#e6e6e6] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0071e3]/10">
          <Mic className="h-5 w-5 text-[#0071e3]" strokeWidth={2.2} aria-hidden="true" />
        </div>
        <h2 id="mic-perm-title" className="mt-4 text-center text-[17px] font-semibold tracking-tight text-[#0a0a0a]">
          Microphone access needed
        </h2>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-gray-500">
          {hint}
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={onAllow}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#0071e3] text-[15px] font-semibold text-white transition-opacity disabled:opacity-60"
        >
          {busy ? "Waiting for permission…" : "Allow microphone"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 flex h-11 w-full items-center justify-center rounded-full text-[14px] font-medium text-gray-500"
        >
          Not now
        </button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-400">
          If nothing pops up, check your browser site settings and set Microphone to Allow, then try again.
        </p>
      </div>
    </div>,
    document.body
  );
}

function statusCopy(status: CallStatus) {
  if (status === "listening") return "Listening...";
  if (status === "thinking") return "Thinking...";
  if (status === "speaking") return "Talking...";
  return "Talk to Taha";
}

async function requestMicrophoneAccess(): Promise<{ ok: true } | { ok: false; reason: "unsupported" | "denied" | "unavailable" }> {
  if (typeof window === "undefined") return { ok: false, reason: "unsupported" };
  if (!window.isSecureContext) return { ok: false, reason: "unavailable" };
  if (!navigator.mediaDevices?.getUserMedia) return { ok: false, reason: "unsupported" };

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    stream.getTracks().forEach((t) => t.stop());
    return { ok: true };
  } catch (err) {
    const name = err && typeof err === "object" && "name" in err ? String((err as { name: string }).name) : "";
    if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") {
      return { ok: false, reason: "denied" };
    }
    return { ok: false, reason: "unavailable" };
  }
}

export function TalkToTahaProvider({ children }: { children: ReactNode }) {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [caption, setCaption] = useState("");
  const [, setVolume] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [micPromptOpen, setMicPromptOpen] = useState(false);
  const [micBusy, setMicBusy] = useState(false);
  const [micHint, setMicHint] = useState(
    "Talk to Taha needs your mic so you can have a live voice conversation."
  );
  const activeRef = useRef(false);

  const resetIdle = useCallback(() => {
    activeRef.current = false;
    setStatus("idle");
    setCaption("");
    setVolume(0);
  }, []);

  const openMicPrompt = useCallback((hint?: string) => {
    if (hint) setMicHint(hint);
    setMicPromptOpen(true);
  }, []);

  const beginVapiCall = useCallback(async () => {
    const vapi = vapiRef.current;
    if (!vapi) return false;

    setStatus("listening");
    setCaption("");
    activeRef.current = true;

    try {
      await vapi.start(VAPI_ASSISTANT_ID, {
        clientMessages: [
          "transcript",
          "status-update",
          "tool-calls",
          "tool-calls-result",
          "function-call",
          "function-call-result",
          "speech-update",
          "conversation-update",
        ],
      } as never);
      return true;
    } catch {
      resetIdle();
      return false;
    }
  }, [resetIdle]);

  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    const onCallStart = () => {
      activeRef.current = true;
      setStatus("listening");
    };

    const onCallEnd = () => {
      resetIdle();
    };

    const onSpeechStart = () => {
      if (!activeRef.current) return;
      setStatus("speaking");
    };

    const onSpeechEnd = () => {
      if (!activeRef.current) return;
      setStatus("listening");
    };

    const onVolume = (level: number) => {
      setVolume(Math.min(1, Math.max(0, level)));
    };

    const onMessage = (message: TranscriptMessage) => {
      if (!message || typeof message !== "object") return;

      void handleVapiMessage(message, { vapi });

      if (message.type === "transcript" && message.transcript) {
        setCaption(message.transcript);
        if (message.role === "user" && message.transcriptType === "final") {
          setStatus("thinking");
        }
        if (message.role === "assistant" && message.transcriptType === "partial") {
          setStatus("speaking");
        }
      }

      if (message.type === "status-update" && message.status === "thinking") {
        setStatus("thinking");
      }
    };

    const onError = (err: unknown) => {
      const text = String(
        err && typeof err === "object" && "message" in err
          ? (err as { message: unknown }).message
          : err ?? ""
      ).toLowerCase();

      const permissionDenied =
        text.includes("permission") ||
        text.includes("not-allowed") ||
        text.includes("denied") ||
        text.includes("microphone");

      if (permissionDenied) {
        openMicPrompt(
          "Your browser blocked the microphone. Tap Allow microphone to try again, or enable it in site settings."
        );
      } else {
        setToast("Something went wrong starting the call. Please try again.");
      }

      try {
        vapi.stop();
      } catch {
        /* ignore */
      }
      resetIdle();
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolume);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.removeListener("call-start", onCallStart);
      vapi.removeListener("call-end", onCallEnd);
      vapi.removeListener("speech-start", onSpeechStart);
      vapi.removeListener("speech-end", onSpeechEnd);
      vapi.removeListener("volume-level", onVolume);
      vapi.removeListener("message", onMessage);
      vapi.removeListener("error", onError);
      try {
        vapi.stop();
      } catch {
        /* ignore */
      }
      vapiRef.current = null;
    };
  }, [openMicPrompt, resetIdle]);

  const startCall = useCallback(async () => {
    if (activeRef.current || status !== "idle") return;
    if (!vapiRef.current) return;

    const permission = await requestMicrophoneAccess();
    if (!permission.ok) {
      if (permission.reason === "unsupported") {
        openMicPrompt("This browser doesn’t support microphone access for voice calls.");
      } else if (permission.reason === "unavailable") {
        openMicPrompt("Microphone isn’t available right now. Use HTTPS and try again.");
      } else {
        openMicPrompt(
          "Tap Allow microphone below — your browser should show a permission popup. If it doesn’t, enable Microphone in site settings."
        );
      }
      return;
    }

    setMicPromptOpen(false);
    const started = await beginVapiCall();
    if (!started) {
      openMicPrompt("Couldn’t start the call. Tap Allow microphone to try again.");
    }
  }, [beginVapiCall, openMicPrompt, status]);

  const allowMicrophone = useCallback(async () => {
    setMicBusy(true);
    const permission = await requestMicrophoneAccess();
    setMicBusy(false);

    if (!permission.ok) {
      if (permission.reason === "denied") {
        setMicHint(
          "Permission is still blocked. In your browser site settings, set Microphone to Allow, then tap Allow microphone again."
        );
      } else {
        setMicHint("Still can’t reach the microphone. Check browser settings and try again.");
      }
      return;
    }

    setMicPromptOpen(false);
    const started = await beginVapiCall();
    if (!started) {
      setToast("Couldn’t start the call. Please try again.");
    }
  }, [beginVapiCall]);

  const endCall = useCallback(() => {
    try {
      vapiRef.current?.stop();
    } catch {
      /* ignore */
    }
    resetIdle();
  }, [resetIdle]);

  const clearToast = useCallback(() => setToast(null), []);

  const value = useMemo(
    () => ({
      status,
      caption,
      toast,
      inCall: status !== "idle",
      startCall,
      endCall,
      clearToast,
    }),
    [status, caption, toast, startCall, endCall, clearToast]
  );

  return (
    <TalkContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[120] -translate-x-1/2">
        <AnimatePresence>
          {toast ? <Toast message={toast} onDone={clearToast} /> : null}
        </AnimatePresence>
      </div>
      <MicPermissionSheet
        open={micPromptOpen}
        busy={micBusy}
        hint={micHint}
        onAllow={allowMicrophone}
        onClose={() => {
          setMicPromptOpen(false);
          setMicBusy(false);
        }}
      />
    </TalkContext.Provider>
  );
}

/** Inline CTA — morphs in place into the live call pill. */
export function TalkToTahaCTA({ className = "" }: { className?: string }) {
  const { status, caption, inCall, startCall, endCall } = useTalk();
  const reduceMotion = useReducedMotion();
  const label = statusCopy(status);

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <AnimatePresence>
        {inCall && caption ? (
          <motion.div
            key="captions"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-[min(100vw-2.5rem,300px)] -translate-x-1/2"
            aria-live="polite"
          >
            <div className="rounded-2xl border border-white/60 bg-white/85 px-3.5 py-3 text-left shadow-[0_12px_32px_rgba(15,23,42,0.1)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Live
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={caption}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 text-[13px] leading-relaxed text-gray-800"
                >
                  {caption}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <LayoutGroup>
        <motion.div
          layout
          transition={spring}
          className={`talk-shell relative overflow-visible rounded-full border ${
            inCall
              ? `border-white/55 bg-white/85 shadow-[0_10px_32px_rgba(15,23,42,0.12)] ${
                  status === "listening" ? "talk-breathe" : ""
                }`
              : "cursor-pointer border-[#e6e6e6] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] hover:border-[#d4d4d4] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          }`}
        >
          {!inCall ? (
            <button
              type="button"
              onClick={() => void startCall()}
              className="flex h-[48px] items-center justify-center gap-2 px-6 text-[15px] font-semibold tracking-tight text-gray-900 lg:h-[52px] lg:px-7 lg:text-[16px]"
            >
              <Mic className="h-[15px] w-[15px] text-gray-700" strokeWidth={2.1} aria-hidden="true" />
              Talk to Taha
            </button>
          ) : (
            <motion.div
              layout
              role="status"
              aria-live="polite"
              className="flex h-[48px] items-center lg:h-[52px]"
              style={{ paddingLeft: 18, paddingRight: 8, gap: 10, minWidth: 220 }}
              transition={spring}
            >
              <StatusGlyph status={status} />
              <motion.span
                layout
                className={`flex min-w-0 flex-1 items-center text-[13px] font-semibold tracking-tight ${
                  status === "listening" || status === "speaking"
                    ? "text-[#0071e3]"
                    : "text-gray-800"
                }`}
                transition={spring}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={label}
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
              <motion.button
                type="button"
                aria-label="End conversation"
                onClick={endCall}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors duration-200 hover:bg-[#d70015]/10 hover:text-[#d70015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70015]"
              >
                <X className="h-[15px] w-[15px]" strokeWidth={2.2} />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </LayoutGroup>
    </div>
  );
}

/** @deprecated Prefer TalkToTahaProvider + TalkToTahaCTA */
export function TalkToTaha() {
  return null;
}
