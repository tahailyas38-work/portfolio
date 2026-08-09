"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LoaderCircle, Mic, X } from "lucide-react";
import Vapi from "@vapi-ai/web";
import SpecularEdge from "@/components/SpecularEdge";
import {
  handleVapiMessage,
  type VapiIncomingMessage,
} from "@/lib/vapi";

/** Public frontend credentials only — never put private keys here. */
const VAPI_PUBLIC_KEY = "12aa5533-8750-4b68-a79f-f894cd18a2f7";
const VAPI_ASSISTANT_ID = "b9d837fd-2f9c-4776-aae8-72d3292d968a";

type CallStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "ending";

type CaptionRole = "user" | "assistant" | null;

type TranscriptMessage = VapiIncomingMessage & {
  type?: string;
  role?: string;
  transcript?: string;
  transcriptType?: string;
  status?: string;
};

const softEase = [0.22, 1, 0.36, 1] as const;

/** Shared footprint — inline styles beat flex min-width:auto. */
const CTA_W = 188;
const CTA_H = 48;
const CTA_H_LG = 52;

function useCtaHeight() {
  const [h, setH] = useState(CTA_H);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setH(mq.matches ? CTA_H_LG : CTA_H);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return h;
}

function ctaBoxStyle(height: number): CSSProperties {
  return {
    width: CTA_W,
    minWidth: CTA_W,
    maxWidth: CTA_W,
    height,
    minHeight: height,
    maxHeight: height,
    boxSizing: "border-box",
  };
}

type TalkContextValue = {
  status: CallStatus;
  caption: string;
  captionRole: CaptionRole;
  volume: number;
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

/** Listening: pulsing mic + sonar rings (volume nudges ring intensity). */
function ListeningGlyph({ level }: { level: number }) {
  const t = Math.min(1, Math.max(0, level));
  return (
    <div className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
      <span
        className="talk-mic-ring absolute inset-[-4px] rounded-full bg-[#0071e3]/25"
        style={{ opacity: 0.35 + t * 0.45 }}
      />
      <span
        className="talk-mic-ring talk-mic-ring--delay absolute inset-[-4px] rounded-full bg-[#0071e3]/15"
        style={{ opacity: 0.25 + t * 0.35 }}
      />
      <Mic
        className="talk-mic-pulse relative h-[15px] w-[15px] text-[#0071e3]"
        strokeWidth={2.1}
      />
    </div>
  );
}

/** Speaking: clean waveform — keep as-is (user approved). */
function SpeakingGlyph({ level }: { level: number }) {
  const t = Math.min(1, Math.max(0.2, level));
  return (
    <div className="relative flex h-5 w-7 items-center justify-center" aria-hidden="true">
      <div className="flex h-[15px] items-end gap-[2.5px]">
        {[0.45, 0.85, 0.55, 1, 0.65].map((weight, i) => (
          <span
            key={i}
            className="talk-speak-bar w-[2.5px] rounded-full bg-[#0071e3]"
            style={{
              height: `${Math.max(4, (0.28 + weight * 0.72 * t) * 15)}px`,
              animationDelay: `${i * 0.09}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Thinking: solid spinner — always visible, always spinning. */
function ThinkingGlyph() {
  return (
    <div className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
      <LoaderCircle className="talk-think-spin h-[15px] w-[15px] text-[#0071e3]" strokeWidth={2.1} />
    </div>
  );
}

function ConnectingGlyph() {
  return (
    <div className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
      <LoaderCircle className="talk-think-spin h-[15px] w-[15px] text-[#0071e3]" strokeWidth={2.1} />
    </div>
  );
}

function EndingGlyph() {
  return (
    <div className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
      <LoaderCircle className="talk-think-spin h-[14px] w-[14px] text-gray-400" strokeWidth={2.1} />
    </div>
  );
}

function StatusGlyph({
  status,
  volume,
}: {
  status: CallStatus;
  volume: number;
}) {
  // Absolute overlap (no mode="wait") so the slot never goes blank between states.
  const glyph =
    status === "connecting" ? (
      <ConnectingGlyph />
    ) : status === "listening" ? (
      <ListeningGlyph level={volume} />
    ) : status === "thinking" ? (
      <ThinkingGlyph />
    ) : status === "speaking" ? (
      <SpeakingGlyph level={volume} />
    ) : status === "ending" ? (
      <EndingGlyph />
    ) : null;

  return (
    <div className="relative h-5 w-7 shrink-0" aria-hidden="true">
      <AnimatePresence initial={false}>
        {glyph ? (
          <motion.span
            key={status}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.16 }}
          >
            {glyph}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function shellToneClass(status: CallStatus) {
  if (status === "listening") return "talk-breathe border-[#0071e3]/25";
  if (status === "speaking") return "talk-speak-glow border-[#0071e3]/30";
  if (status === "thinking") return "talk-think-glow border-[#0071e3]/18";
  if (status === "connecting" || status === "ending") return "border-gray-200 opacity-95";
  return "border-gray-200";
}

function ActiveCallInner({
  status,
  volume,
  onEnd,
  reduceMotion,
}: {
  status: CallStatus;
  volume: number;
  onEnd: () => void;
  reduceMotion?: boolean | null;
}) {
  const label = statusCopy(status);

  return (
    <div className="flex h-full w-full items-center gap-2 pl-3.5 pr-1.5">
      <StatusGlyph status={status} volume={volume} />
      <span
        className={`min-w-0 flex-1 truncate text-[13px] font-semibold tracking-tight ${
          status === "ending" ? "text-gray-400" : "text-[#0071e3]"
        }`}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={label}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: softEase }}
            className="block truncate"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        aria-label="End conversation"
        onClick={onEnd}
        disabled={status === "ending"}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors duration-200 hover:bg-[#d70015]/10 hover:text-[#d70015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70015] disabled:pointer-events-none disabled:opacity-45"
      >
        <X className="h-[15px] w-[15px]" strokeWidth={2.2} />
      </button>
    </div>
  );
}

function IdleCallInner() {
  return (
    <span className="relative z-[2] inline-flex max-w-full items-center justify-center gap-2 px-3">
      <Mic className="h-[15px] w-[15px] shrink-0 text-gray-700" strokeWidth={2.1} aria-hidden="true" />
      <span className="truncate text-[13px] font-semibold tracking-tight text-gray-800 lg:text-[14px]">
        Talk to Taha
      </span>
    </span>
  );
}

function CaptionBubble({
  shellRef,
  caption,
  captionRole,
  enabled,
}: {
  shellRef: RefObject<HTMLDivElement | null>;
  caption: string;
  captionRole: CaptionRole;
  enabled: boolean;
}) {
  const [box, setBox] = useState<{
    bottom: number;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    if (!enabled || !caption) {
      setBox(null);
      return;
    }

    const update = () => {
      const el = shellRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const width = Math.min(window.innerWidth - 32, 300);
      setBox({
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
  }, [enabled, caption, shellRef]);

  if (!box || !caption || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="pointer-events-none fixed z-[125] select-none"
      style={{
        bottom: box.bottom,
        left: box.left,
        width: box.width,
        transform: "translateX(-50%)",
      }}
      aria-live="polite"
    >
      <div className="relative rounded-2xl border border-[#e8e8e8] bg-white px-3.5 py-3 text-left shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
            captionRole === "assistant" ? "text-[#0071e3]" : "text-gray-400"
          }`}
        >
          {captionEyebrow(captionRole)}
        </p>
        {/* No per-token AnimatePresence — streaming captions were double-painting on iOS Chrome */}
        <p className="mt-1 text-[13px] leading-relaxed text-gray-800">{caption}</p>
        <span
          className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[#e8e8e8] bg-white"
          aria-hidden="true"
        />
      </div>
    </div>,
    document.body
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
      transition={{ duration: 0.28, ease: softEase }}
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
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: softEase }}
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
          className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#0071e3] text-[15px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
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
          className="mt-2 flex h-11 w-full items-center justify-center rounded-full text-[14px] font-medium text-gray-500 transition-opacity hover:opacity-70"
        >
          Not now
        </button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-400">
          {iosMicHelpText()}
        </p>
      </motion.div>
    </div>,
    document.body
  );
}

function statusCopy(status: CallStatus) {
  if (status === "connecting") return "Connecting...";
  if (status === "listening") return "Listening...";
  if (status === "thinking") return "Thinking...";
  if (status === "speaking") return "Talking...";
  if (status === "ending") return "Ending...";
  return "Talk to Taha";
}

function captionEyebrow(role: CaptionRole) {
  if (role === "user") return "You";
  if (role === "assistant") return "Taha";
  return "Live";
}

function isIOSDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

type IosBrowserKind = "safari" | "chrome" | "google-app" | "other";

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
  const [captionRole, setCaptionRole] = useState<CaptionRole>(null);
  const [volume, setVolume] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [micPromptOpen, setMicPromptOpen] = useState(false);
  const [micBusy, setMicBusy] = useState(false);
  const [micHint, setMicHint] = useState(
    "Talk to Taha needs your mic so you can have a live voice conversation."
  );
  const activeRef = useRef(false);
  const endingRef = useRef(false);

  const resetIdle = useCallback(() => {
    activeRef.current = false;
    endingRef.current = false;
    setStatus("idle");
    setCaption("");
    setCaptionRole(null);
    setVolume(0);
  }, []);

  const openMicPrompt = useCallback((hint?: string) => {
    if (hint) setMicHint(hint);
    setMicPromptOpen(true);
  }, []);

  const beginVapiCall = useCallback(async () => {
    const vapi = vapiRef.current;
    if (!vapi) return false;

    setStatus("connecting");
    setCaption("");
    setCaptionRole(null);
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

  const startCallWithMic = useCallback(async (): Promise<"started" | "denied" | "failed"> => {
    setStatus("connecting");
    const permission = await requestMicrophoneAccess();
    if (!permission.ok) {
      resetIdle();
      return permission.reason === "denied" ? "denied" : "failed";
    }

    const warmup = permission.stream;
    const iosBrowser = getIosBrowserKind();

    try {
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
        window.setTimeout(() => releaseStream(warmup), 1500);
      } else {
        releaseStream(warmup);
      }
    }
  }, [beginVapiCall, resetIdle]);

  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    const onCallStart = () => {
      activeRef.current = true;
      endingRef.current = false;
      setStatus("listening");
      setMicPromptOpen(false);
      setMicBusy(false);
    };

    const onCallEnd = () => {
      if (isIOSDevice()) {
        setIOSAudioSession("playback");
        setIOSAudioSession("auto");
      }
      if (endingRef.current) {
        window.setTimeout(() => resetIdle(), 280);
      } else {
        resetIdle();
      }
    };

    const onSpeechStart = () => {
      if (!activeRef.current || endingRef.current) return;
      setStatus("speaking");
    };

    const onSpeechEnd = () => {
      if (!activeRef.current || endingRef.current) return;
      setStatus("listening");
    };

    const onVolume = (level: number) => {
      setVolume(Math.min(1, Math.max(0, level)));
    };

    const onMessage = (message: TranscriptMessage) => {
      if (!message || typeof message !== "object") return;
      if (endingRef.current) return;

      void handleVapiMessage(message, { vapi });

      if (message.type === "transcript" && message.transcript) {
        setCaption(message.transcript);
        if (message.role === "user") {
          setCaptionRole("user");
          if (message.transcriptType === "final") setStatus("thinking");
        }
        if (message.role === "assistant") {
          setCaptionRole("assistant");
          if (message.transcriptType === "partial") setStatus("speaking");
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
    if (endingRef.current || status === "idle") return;
    endingRef.current = true;
    setStatus("ending");
    setCaption("");
    setCaptionRole(null);
    setVolume(0);

    window.setTimeout(() => {
      try {
        vapiRef.current?.stop();
      } catch {
        /* ignore */
      }
      if (isIOSDevice()) {
        setIOSAudioSession("playback");
        setIOSAudioSession("auto");
      }
      // If call-end doesn't fire, still settle.
      window.setTimeout(() => {
        if (endingRef.current) resetIdle();
      }, 420);
    }, 220);
  }, [resetIdle, status]);

  const clearToast = useCallback(() => setToast(null), []);

  const inCall = status !== "idle";

  const value = useMemo(
    () => ({
      status,
      caption,
      captionRole,
      volume,
      toast,
      inCall,
      startCall,
      endCall,
      clearToast,
    }),
    [status, caption, captionRole, volume, toast, inCall, startCall, endCall, clearToast]
  );

  return (
    <TalkContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[210] -translate-x-1/2">
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
          if (status === "connecting") resetIdle();
        }}
      />
    </TalkContext.Provider>
  );
}

type Pin = { top: number; left: number };

/**
 * One slot. One size. On call, the same box is portaled to position:fixed
 * using top+left from the slot (not right) so nothing shifts sideways.
 */
export function TalkToTahaCTA({ className = "" }: { className?: string }) {
  const { status, caption, captionRole, volume, inCall, startCall, endCall } = useTalk();
  const reduceMotion = useReducedMotion();
  const height = useCtaHeight();
  const slotRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const idleHostRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pin, setPin] = useState<Pin | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const measureSlot = useCallback((): Pin | null => {
    const el = slotRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left };
  }, []);

  const handleStart = () => {
    const next = measureSlot();
    if (next) setPin(next);
    void startCall();
  };

  // If the call starts elsewhere (mic sheet), pin from the slot once.
  useLayoutEffect(() => {
    if (!inCall) {
      setPin(null);
      return;
    }
    if (!pin) {
      const next = measureSlot();
      if (next) setPin(next);
    }
  }, [inCall, pin, measureSlot]);

  const box = ctaBoxStyle(height);
  const pinned = Boolean(inCall && pin);

  const shellClass = inCall
    ? `talk-shell relative flex overflow-visible rounded-full border bg-white shadow-sm ${shellToneClass(status)}`
    : "relative flex overflow-visible rounded-full border border-gray-200 bg-white shadow-sm transition-[box-shadow,border-color] duration-300 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/35 focus-visible:ring-offset-2";

  const shell = (
    <div
      ref={shellRef}
      role={inCall ? "status" : undefined}
      aria-live={inCall ? "polite" : undefined}
      className={shellClass}
      style={
        pinned && pin
          ? {
              ...box,
              position: "fixed",
              top: pin.top,
              left: pin.left,
              zIndex: 200,
            }
          : box
      }
    >
      {inCall ? (
        <ActiveCallInner
          status={status}
          volume={volume}
          onEnd={endCall}
          reduceMotion={reduceMotion}
        />
      ) : (
        <button
          ref={idleHostRef}
          type="button"
          onClick={handleStart}
          className="relative flex h-full w-full items-center justify-center rounded-full"
        >
          <SpecularEdge
            hostRef={idleHostRef}
            radius={999}
            lineColor="#0071e3"
            baseColor="#c8c8c8"
            intensity={1}
            shineSize={12}
            shineFade={36}
            thickness={1}
            proximity={220}
          />
          <IdleCallInner />
        </button>
      )}
    </div>
  );

  return (
    <div ref={slotRef} className={`relative shrink-0 ${className}`} style={box}>
      {inCall ? (
        <CaptionBubble
          shellRef={shellRef}
          caption={caption}
          captionRole={captionRole}
          enabled={status !== "ending"}
        />
      ) : null}

      {/*
        Idle: shell lives in the slot.
        Active: same shell is portaled to position:fixed at the slot’s top/left;
        the slot stays as an empty same-size placeholder (no layout shift).
      */}
      {pinned && mounted ? createPortal(shell, document.body) : shell}
    </div>
  );
}

/** @deprecated Prefer TalkToTahaProvider + TalkToTahaCTA */
export function TalkToTaha() {
  return null;
}
