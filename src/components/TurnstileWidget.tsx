"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onTokenChange: (token: string | null) => void;
}

export function TurnstileWidget({ onTokenChange }: TurnstileWidgetProps) {
  const [turnstileError, setTurnstileError] = useState<ReactNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const getLoadError = () => (
    <span>
      Verification could not load. Please call us on{" "}
      <a
        href={`tel:${siteConfig.phoneRaw}`}
        className="underline hover:text-[#0F2A4A]"
      >
        {siteConfig.phone}
      </a>{" "}
      instead.
    </span>
  );

  const getFailedError = () => (
    <span>
      Verification failed. Please try again, or call us on{" "}
      <a
        href={`tel:${siteConfig.phoneRaw}`}
        className="underline hover:text-[#0F2A4A]"
      >
        {siteConfig.phone}
      </a>{" "}
      instead.
    </span>
  );

  useEffect(() => {
    if (!siteKey) return;

    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const startTime = Date.now();

    const clearTimer = () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const renderWidget = () => {
      if (!isMounted) return;

      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              if (isMounted) {
                onTokenChange(token);
                setTurnstileError(null);
              }
            },
            "expired-callback": () => {
              if (isMounted) {
                onTokenChange(null);
                setTurnstileError("Verification expired. Please verify again.");
                if (widgetIdRef.current && window.turnstile) {
                  window.turnstile.reset(widgetIdRef.current);
                }
              }
            },
            "error-callback": () => {
              if (isMounted) {
                onTokenChange(null);
                setTurnstileError(getFailedError());
                if (widgetIdRef.current && window.turnstile) {
                  window.turnstile.reset(widgetIdRef.current);
                }
              }
            },
          });
          clearTimer();
        } catch (err) {
          console.error(err instanceof Error ? err.name : "Error");
          if (isMounted) {
            onTokenChange(null);
            setTurnstileError(getLoadError());
          }
          clearTimer();
        }
      } else if (!widgetIdRef.current && Date.now() - startTime >= 10000) {
        if (isMounted) {
          setTurnstileError(getLoadError());
        }
        clearTimer();
      }
    };

    intervalId = setInterval(renderWidget, 200);
    renderWidget();

    return () => {
      isMounted = false;
      clearTimer();
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey, onTokenChange]);

  const displayedError = !siteKey ? getLoadError() : turnstileError;

  return (
    <div className="my-2 min-h-[65px] flex flex-col justify-center">
      <div ref={containerRef} />
      {displayedError && (
        <div className="text-red-600 text-xs sm:text-sm font-medium mt-1.5">
          {displayedError}
        </div>
      )}
    </div>
  );
}
