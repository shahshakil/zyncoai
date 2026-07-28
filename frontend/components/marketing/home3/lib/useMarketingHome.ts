"use client";

import { useEffect, useState } from "react";
import type { MarketingHomePayload } from "@/components/marketing/home3/lib/types";

type State = {
  data: MarketingHomePayload | null;
  loading: boolean;
  error: string | null;
};

export function useMarketingHome() {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/marketing/home", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed: ${res.status}`);
        }

        const data = (await res.json()) as MarketingHomePayload;
        if (!mounted) return;

        setState({
          data,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        if (!mounted) return;
        setState({
          data: null,
          loading: false,
          error: err?.message ?? "Unknown error",
        });
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
