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
  onAllow: () => void | Promise<void>;
  onClose: () => void;
}) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[130] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mic-perm-title"
    >
      {/* Backdrop — behind the sheet, not a full-screen <button> over content */}
      <div
        className="absolute inset-0 bg-black/45"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-sm rounded-[24px] border border-[#e6e6e6] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.25)]"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0071e3]/10">
          <Mic className="h-5 w-5 text-[#0071e3]" strokeWidth={2.2} aria-hidden="true" />
        </div>
        <h2
          id="mic-perm-title"
          className="mt-4 text-center text-[17px] font-semibold tracking-tight text-[#0a0a0a]"
        >
          Microphone access needed
        </h2>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-gray-500">{hint}</p>
        <button
          type="button"
          disabled={busy}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void onAllow();
          }}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#0071e3] text-[15px] font-semibold text-white transition-opacity disabled:opacity-60"
        >
          {busy ? "Waiting for permission…" : "Allow microphone"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="mt-2 flex h-11 w-full items-center justify-center rounded-full text-[14px] font-medium text-gray-500"
        >
          Not now
        </button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-400">
          {iosMicHelpText()}
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

function isIOSDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  // iPadOS desktop UA
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

type IosBrowserKind = "safari" | "chrome" | "google-app" | "other";

/** Chrome/Google/Firefox on iOS all use WebKit, but mic UX differs from Safari. */
function getIosBrowserKind(): IosBrowserKind | null {
  if (!isIOSDevice()) return null;
  const ua = navigator.userAgent || "";
  if (/GSA\//i.test(ua)) return "google-app";
  if (/CriOS/i.test(ua)) return "chrome";
  if (/FxiOS|EdgiOS|OPiOS|YaBrowser/i.test(ua)) return "other";
  return "safari";
}

function iosMicHelpText(kind: IosBrowserKind | null = getIosBrowserKind()) {
  if (kind === "chrome") {
    return "On iPhone Chrome: open the Settings app → Chrome → Microphone → On, then tap Allow microphone.";
  }
  if (kind === "google-app") {
    return "The Google app’s browser often blocks live voice. Open this site in Safari or Chrome, then try Talk to Taha again.";
  }
  if (kind === "other") {
    return "This iPhone browser may block the mic. Open the page in Safari or Chrome, then try again.";
  }
  return "On iPhone Safari: tap aA in the address bar → Website Settings → Microphone → Allow, then try again.";
}

/** iOS Safari needs AudioContext unlock + play-and-record session before WebRTC. */
async function unlockIOSAudio() {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    if (ctx.state === "suspended") await ctx.resume();
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
    window.setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 500);
  } catch {
    /* ignore */
  }

  try {
    const audio = new Audio(
      "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA//////////////////////////////////////////////////////////////////8AAAA8AAAACadrbW0AAAApAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAD/4QAYZAAAAAADSAAAAAAADSAAAAAA"
    );
    audio.setAttribute("playsinline", "true");
    audio.muted = true;
    await audio.play();
    audio.pause();
  } catch {
    /* ignore */
  }
}

function setIOSAudioSession(
  type: "auto" | "playback" | "play-and-record" | "transient" | "transient-solo"
) {
  try {
    const session = (
      navigator as Navigator & {
        audioSession?: { type: string };
      }
    ).audioSession;
    if (session) session.type = type;
  } catch {
    /* ignore */
  }
}

async function requestMicrophoneAccess(): Promise<
  | { ok: true; stream: MediaStream }
  | { ok: false; reason: "unsupported" | "denied" | "unavailable"; detail?: string }
> {
  if (typeof window === "undefined") return { ok: false, reason: "unsupported" };
  if (!window.isSecureContext) {
    return { ok: false, reason: "unavailable", detail: "Needs a secure (HTTPS) connection." };
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return { ok: false, reason: "unsupported", detail: "This browser can’t access the microphone." };
  }

  try {
    // getUserMedia must be first in the tap chain on iPhone — don't await unlock before it.
    const stream = await Promise.race([
      navigator.mediaDevices.getUserMedia({ audio: true }),
      new Promise<never>((_, reject) => {
        window.setTimeout(
          () => reject(Object.assign(new Error("Permission timed out"), { name: "TimeoutError" })),
          15000
        );
      }),
    ]);

    if (isIOSDevice()) {
      setIOSAudioSession("play-and-record");
      // Fire-and-forget unlock after mic is granted (playback for assistant audio).
      void unlockIOSAudio();
    }

    return { ok: true, stream };
  } catch (err) {
    const name =
      err && typeof err === "object" && "name" in err ? String((err as { name: string }).name) : "";
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : String(err ?? "");

    if (
      name === "NotAllowedError" ||
      name === "PermissionDeniedError" ||
      name === "SecurityError"
    ) {
      return { ok: false, reason: "denied", detail: message };
    }
    if (name === "TimeoutError" || message.toLowerCase().includes("timed out")) {
      return {
        ok: false,
        reason: "unavailable",
        detail: "The permission prompt timed out. Try again.",
      };
    }
    return { ok: false, reason: "unavailable", detail: message || name };
  }
}

function releaseStream(stream?: MediaStream | null) {
  stream?.getTracks().forEach((t) => {
    try {
      t.stop();
    } catch {
      /* ignore */
    }
  });
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
    } catch (err) {
      console.warn("[TalkToTaha] vapi.start failed:", err);
      resetIdle();
      return false;
    }
  }, [resetIdle]);

  /** Mic unlock first in the same tap, then Vapi — required for iPhone. */
  const startCallWithMic = useCallback(async (): Promise<"started" | "denied" | "failed"> => {
    const permission = await requestMicrophoneAccess();
    if (!permission.ok) {
      return permission.reason === "denied" ? "denied" : "failed";
    }

    const warmup = permission.stream;
    const iosBrowser = getIosBrowserKind();

    try {
      // Chrome / Google app on iOS reject a second getUserMedia while our warmup
      // stream still holds the mic. Release first, then let Vapi open the device.
      if (iosBrowser && iosBrowser !== "safari") {
        releaseStream(warmup);
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 80);
        });
        setIOSAudioSession("play-and-record");
        await unlockIOSAudio();
        const started = await beginVapiCall();
        return started ? "started" : "failed";
      }

      const started = await beginVapiCall();
      return started ? "started" : "failed";
    } finally {
      if (!iosBrowser || iosBrowser === "safari") {
        // Safari: keep warmup briefly so the permission session stays warm.
        window.setTimeout(() => releaseStream(warmup), 1500);
      } else {
        releaseStream(warmup);
      }
    }
  }, [beginVapiCall]);

  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    const onCallStart = () => {
      activeRef.current = true;
      setStatus("listening");
      setMicPromptOpen(false);
      setMicBusy(false);
    };

    const onCallEnd = () => {
      if (isIOSDevice()) {
        setIOSAudioSession("playback");
        setIOSAudioSession("auto");
      }
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

      console.warn("[TalkToTaha] vapi error:", err);

      const permissionDenied =
        text.includes("permission") ||
        text.includes("not-allowed") ||
        text.includes("denied") ||
        text.includes("microphone") ||
        text.includes("getusermedia");

      if (permissionDenied) {
        openMicPrompt(
          isIOSDevice()
            ? `iPhone blocked the mic. ${iosMicHelpText()}`
            : "Microphone is blocked for this site. Tap Allow microphone to try again."
        );
      } else if (getIosBrowserKind() === "google-app") {
        openMicPrompt(iosMicHelpText("google-app"));
      } else {
        setToast("Something went wrong starting the call. Please try again.");
      }

      try {
        vapi.stop();
      } catch {
        /* ignore */
      }
      if (isIOSDevice()) {
        setIOSAudioSession("playback");
        setIOSAudioSession("auto");
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

    const result = await startCallWithMic();
    if (result === "started") {
      setMicPromptOpen(false);
      return;
    }

    if (result === "denied") {
      openMicPrompt(
        isIOSDevice()
          ? `Microphone permission was denied. ${iosMicHelpText()}`
          : "Microphone permission was denied. Tap Allow microphone to try again."
      );
      return;
    }

    openMicPrompt(
      isIOSDevice()
        ? `Couldn’t start on iPhone. ${iosMicHelpText()}`
        : "Couldn’t start the call. Tap Allow microphone to try again."
    );
  }, [openMicPrompt, startCallWithMic, status]);

  const allowMicrophone = useCallback(async () => {
    setMicBusy(true);
    try {
      const result = await startCallWithMic();
      if (result === "started") {
        setMicPromptOpen(false);
        return;
      }
      if (result === "denied") {
        setMicHint(
          isIOSDevice()
            ? `Still blocked on iPhone. ${iosMicHelpText()}`
            : "Still blocked. Enable Microphone in site settings, then try again."
        );
        return;
      }
      setMicHint(
        isIOSDevice()
          ? `Still couldn’t start. ${iosMicHelpText()}`
          : "Still couldn’t start the call. Close this, tap Talk to Taha again, and allow the mic when asked."
      );
    } finally {
      setMicBusy(false);
    }
  }, [startCallWithMic]);

  const endCall = useCallback(() => {
    try {
      vapiRef.current?.stop();
    } catch {
      /* ignore */
    }
    if (isIOSDevice()) {
      setIOSAudioSession("playback");
      setIOSAudioSession("auto");
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
  const shellRef = useRef<HTMLDivElement>(null);
  const [captionBox, setCaptionBox] = useState<{
    bottom: number;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    if (!inCall || !caption) {
      setCaptionBox(null);
      return;
    }

    const update = () => {
      const el = shellRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const width = Math.min(window.innerWidth - 32, 300);
      setCaptionBox({
        bottom: window.innerHeight - r.top + 12,
        left: r.left + r.width / 2,
        width,
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const id = window.setInterval(update, 250);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      window.clearInterval(id);
    };
  }, [inCall, caption, status]);

  const captionPortal =
    captionBox && inCall && caption && typeof document !== "undefined"
      ? createPortal(
          <div
            className="pointer-events-none fixed z-[125] select-none"
            style={{
              bottom: captionBox.bottom,
              left: captionBox.left,
              width: captionBox.width,
              transform: "translateX(-50%)",
            }}
            aria-live="polite"
          >
            <div className="rounded-2xl border border-[#e8e8e8] bg-white px-3.5 py-3 text-left shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Live
              </p>
              {/* No per-token AnimatePresence — streaming captions were double-painting on iOS Chrome */}
              <p className="mt-1 text-[13px] leading-relaxed text-gray-800">{caption}</p>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {captionPortal}

      <LayoutGroup>
        <motion.div
          ref={shellRef}
          layout
          transition={spring}
          className={`talk-shell relative overflow-visible rounded-full border ${
            inCall
              ? `border-[#e8e8e8] bg-white shadow-[0_10px_32px_rgba(15,23,42,0.12)] ${
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
