/** Block upstream API calls after daily quota / rate-limit errors. */
let blockedUntil = 0;
let lastReason: string | undefined;

export function isApiQuotaBlocked(): boolean {
  return Date.now() < blockedUntil;
}

export function blockApiQuota(reason: string, ms = 60 * 60_000): void {
  blockedUntil = Date.now() + ms;
  lastReason = reason;
}

export function getApiQuotaBlockReason(): string | undefined {
  return isApiQuotaBlocked() ? lastReason : undefined;
}

export function isDailyQuotaError(error?: string): boolean {
  if (!error) return false;
  return /request limit|requests per day|daily|quota|http_429/i.test(error);
}
