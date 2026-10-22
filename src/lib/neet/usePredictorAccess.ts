"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPredictorClient } from "@/lib/supabase/predictorClient";

export type AccessStatus = "loading" | "signed-out" | "locked" | "unlocked";

/** Whether the signed-in visitor has paid to unlock the full predictor report. */
export function usePredictorAccess() {
  const supabase = useMemo(() => createPredictorClient(), []);
  const [status, setStatus] = useState<AccessStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);

  const checkUnlock = useCallback(
    async (userId: string) => {
      const { data } = await supabase.from("predictor_unlocks").select("user_id").eq("user_id", userId).maybeSingle();
      setStatus(data ? "unlocked" : "locked");
    },
    [supabase]
  );

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        setEmail(session.user.email ?? null);
        checkUnlock(session.user.id);
      } else {
        setEmail(null);
        setStatus("signed-out");
      }
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setEmail(session.user.email ?? null);
        checkUnlock(session.user.id);
      } else {
        setEmail(null);
        setStatus("signed-out");
      }
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase, checkUnlock]);

  /** Re-checks unlock status for the current user — call after a payment succeeds. */
  const refresh = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await checkUnlock(user.id);
  }, [supabase, checkUnlock]);

  return { status, email, supabase, refresh };
}
