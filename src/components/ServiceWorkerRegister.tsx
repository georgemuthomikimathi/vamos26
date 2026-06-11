"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV === "development") return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => {
        /* optional — PWA still works via manifest */
      });
  }, []);

  return null;
}
