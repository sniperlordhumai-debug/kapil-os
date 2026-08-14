"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BootScreen } from "./BootScreen";

/**
 * Client shell that mounts the BootScreen and removes it once
 * initialization completes, is skipped, or a hard safety timeout is hit.
 *
 * The hard timeout is a guarantee: the boot screen can NEVER get permanently
 * stuck, even if the JS timer is throttled or an animation fails.
 */
export function ClientShell() {
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    // Hard safety net — force-dismiss the boot screen after 4s max.
    const safety = setTimeout(() => setBootDone(true), 4000);
    return () => clearTimeout(safety);
  }, []);

  return (
    <AnimatePresence>{!bootDone && <BootScreen onDone={() => setBootDone(true)} />}</AnimatePresence>
  );
}
