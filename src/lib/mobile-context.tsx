"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const MOBILE_BP = 768;

const MobileContext = createContext(false);

export function MobileProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return <MobileContext.Provider value={isMobile}>{children}</MobileContext.Provider>;
}

export function useIsMobile() {
  return useContext(MobileContext);
}
