"use client";

import type Vapi from "@vapi-ai/web";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import styles from "./ClinicVoiceDemo.module.scss";

type CallState = "idle" | "connecting" | "active" | "ending" | "error" | "unavailable";
type Activity = "listening" | "speaking";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY?.trim();
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID?.trim();

const stateCopy: Record<CallState, { status: string; caption: string }> = {
  idle: { status: "Ready", caption: "Ready when you are" },
  connecting: { status: "Connecting", caption: "Connecting to the assistant…" },
  active: { status: "Live", caption: "Listening…" },
  ending: { status: "Ending", caption: "Ending the call…" },
  error: { status: "Try again", caption: "Could not connect" },
  unavailable: { status: "Unavailable", caption: "Voice assistant unavailable" },
};

export function ClinicVoiceDemo() {
  const clientRef = useRef<Vapi | null>(null);
  const mountedRef = useRef(true);
  const [callState, setCallState] = useState<CallState>(publicKey && assistantId ? "idle" : "unavailable");
  const [activity, setActivity] = useState<Activity>("listening");
  const [hint, setHint] = useState(
    publicKey && assistantId
      ? "Start a call and allow microphone access."
      : "The live demo is not configured for this environment.",
  );
  const [micLevel, setMicLevel] = useState(0);
  const [voiceLevel, setVoiceLevel] = useState(0);

  const resetLevels = useCallback(() => {
    setMicLevel(0);
    setVoiceLevel(0);
  }, []);

  const stopCall = useCallback(async () => {
    const client = clientRef.current;
    if (!client) {
      return;
    }

    setCallState("ending");
    resetLevels();

    try {
      await client.stop();
    } finally {
      client.removeAllListeners();
      clientRef.current = null;
      if (mountedRef.current) {
        setCallState("idle");
        setActivity("listening");
        setHint("Call ended. Start another call whenever you’re ready.");
      }
    }
  }, [resetLevels]);

  const startCall = useCallback(async () => {
    if (!publicKey || !assistantId) {
      setCallState("unavailable");
      return;
    }

    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCallState("unavailable");
      setHint("Use HTTPS or localhost in a browser with microphone support.");
      return;
    }

    setCallState("connecting");
    setHint("Allow microphone access when your browser asks.");

    try {
      const { default: VapiClient } = await import("@vapi-ai/web");
      const client = new VapiClient(publicKey);
      clientRef.current = client;

      client.on("call-start", () => {
        if (!mountedRef.current) return;
        setCallState("active");
        setActivity("listening");
        setHint("Speak naturally. End the call whenever you’re finished.");
      });
      client.on("call-end", () => {
        client.removeAllListeners();
        clientRef.current = null;
        if (!mountedRef.current) return;
        setCallState("idle");
        setActivity("listening");
        resetLevels();
        setHint("Call ended. Start another call whenever you’re ready.");
      });
      client.on("speech-start", () => {
        if (mountedRef.current) setActivity("speaking");
      });
      client.on("speech-end", () => {
        if (mountedRef.current) setActivity("listening");
      });
      client.on("local-volume-level", (volume) => {
        if (mountedRef.current) setMicLevel(Math.min(1, Math.max(0, volume)));
      });
      client.on("volume-level", (volume) => {
        if (mountedRef.current) setVoiceLevel(Math.min(1, Math.max(0, volume)));
      });
      client.on("error", () => {
        client.removeAllListeners();
        clientRef.current = null;
        if (!mountedRef.current) return;
        setCallState("error");
        resetLevels();
        setHint("Check microphone permission and try again.");
      });

      const call = await client.start(assistantId);
      if (!call && mountedRef.current) {
        client.removeAllListeners();
        clientRef.current = null;
        setCallState("error");
        setHint("Could not start the call. Please try again.");
      }
    } catch {
      clientRef.current?.removeAllListeners();
      clientRef.current = null;
      if (mountedRef.current) {
        setCallState("error");
        resetLevels();
        setHint("Check microphone permission and try again.");
      }
    }
  }, [resetLevels]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const client = clientRef.current;
      clientRef.current = null;
      client?.removeAllListeners();
      void client?.stop();
    };
  }, []);

  const isActive = callState === "active";
  const isBusy = callState === "connecting" || callState === "ending";
  const caption = isActive
    ? activity === "speaking"
      ? "Assistant is speaking…"
      : "Listening…"
    : stateCopy[callState].caption;
  const orbStyle = {
    "--mic-level": micLevel,
    "--voice-level": voiceLevel,
  } as CSSProperties;

  return (
    <section className={styles.stage} aria-label="Live Clinic Booking Assistant demo">
      <div className={styles.assistant}>
        <header className={styles.identity}>
          <h2>Clinic booking assistant</h2>
          <p>Voice assistant</p>
        </header>

        <span className={styles.status} role="status">
          {stateCopy[callState].status}
        </span>

        <div
          className={styles.orbControl}
          data-state={callState}
          data-activity={activity}
          style={orbStyle}
        >
          <div className={styles.orb} aria-hidden="true">
            <svg className={styles.orbSurface} viewBox="0 0 300 300" fill="none">
              <defs>
                <linearGradient id="clinic-orb-base" x2="0.7" y2="1">
                  <stop stopColor="#d1fae5" />
                  <stop offset="0.5" stopColor="#34d399" />
                  <stop offset="1" stopColor="#059669" />
                </linearGradient>
                <filter id="clinic-orb-blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="25" />
                </filter>
                <filter id="clinic-orb-grain" x="0" y="0" width="100%" height="100%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.85"
                    numOctaves="3"
                    stitchTiles="stitch"
                  />
                  <feColorMatrix type="saturate" values="0" />
                  <feComponentTransfer>
                    <feFuncR type="linear" slope="2.6" intercept="-0.8" />
                    <feFuncG type="linear" slope="2.6" intercept="-0.8" />
                    <feFuncB type="linear" slope="2.6" intercept="-0.8" />
                  </feComponentTransfer>
                </filter>
              </defs>
              <path fill="url(#clinic-orb-base)" d="M0 0h300v300H0z" />
              <g className={styles.clouds} filter="url(#clinic-orb-blur)">
                <ellipse cx="65" cy="155" rx="96" ry="109" fill="#047857" />
                <ellipse cx="120" cy="31" rx="112" ry="73" fill="#a7f3d0" />
                <ellipse cx="228" cy="99" rx="74" ry="87" fill="#ecfdf5" />
                <ellipse cx="262" cy="298" rx="75" ry="72" fill="#064e3b" />
                <ellipse cx="97" cy="282" rx="73" ry="24" fill="#6ee7b7" />
              </g>
              <path
                fill="#888"
                filter="url(#clinic-orb-grain)"
                opacity="0.6"
                style={{ mixBlendMode: "soft-light" }}
                d="M0 0h300v300H0z"
              />
            </svg>
          </div>
          <span className={styles.connectingArc} aria-hidden="true" />
          <button
            className={`${styles.callButton} ${isActive ? styles.endCall : ""}`}
            type="button"
            onClick={isActive ? stopCall : startCall}
            disabled={isBusy || callState === "unavailable"}
            aria-label={isActive ? "End voice call" : "Start voice call"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.6 2h-3A1.6 1.6 0 0 0 2 3.6C2 13.8 10.2 22 20.4 22a1.6 1.6 0 0 0 1.6-1.6v-3a1.6 1.6 0 0 0-1.4-1.6l-3.1-.4a1.6 1.6 0 0 0-1.4.5l-1.9 1.9a15.4 15.4 0 0 1-8-8l1.9-1.9a1.6 1.6 0 0 0 .5-1.4L8.2 3.4A1.6 1.6 0 0 0 6.6 2Z" />
            </svg>
          </button>
        </div>

        <p className={styles.caption} aria-live="polite">
          {caption}
        </p>
        <p className={styles.hint}>{hint}</p>
        <p className={styles.notice}>
          You will speak with a live AI booking assistant. Please share only information needed to
          book your visit.
        </p>
      </div>
    </section>
  );
}
