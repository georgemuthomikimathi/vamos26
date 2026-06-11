type NotificationPayload = {
  title: string;
  body: string;
  tag: string;
  url?: string;
};

export async function showMatchNotification(payload: NotificationPayload): Promise<void> {
  if (typeof window === "undefined") return;
  if (Notification.permission !== "granted") return;

  const options: NotificationOptions = {
    body: payload.body,
    icon: "/images/icon-192.png",
    badge: "/images/icon-192.png",
    tag: payload.tag,
    data: { url: payload.url ?? "/#live" },
    // vibrate is supported in SW/contexts that allow it
    ...(typeof window !== "undefined" ? {} : {}),
  };

  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(payload.title, options);
      return;
    } catch {
      /* fall through */
    }
  }

  try {
    new Notification(payload.title, options);
  } catch {
    /* user revoked or unsupported */
  }
}
