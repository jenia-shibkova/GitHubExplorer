/** 1234 -> "1.2k", 999 -> "999", 1200000 -> "1.2M" */
export function formatCount(count: number): string {
  if (count < 1000) return String(count);
  if (count < 1_000_000) return `${trimTrailingZero(count / 1000)}k`;
  return `${trimTrailingZero(count / 1_000_000)}M`;
}

function trimTrailingZero(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}

/**
 * GitHub's avatar CDN resizes on request via `?s=<px>` — asking for the
 * rendered size (×2 for retina) instead of the full-resolution original
 * avoids downloading/decoding an oversized image for a 40–60px thumbnail.
 */
export function withAvatarSize(avatarUrl: string, size: number): string {
  try {
    const url = new URL(avatarUrl);
    url.searchParams.set('s', String(size * 2));
    return url.toString();
  } catch {
    return avatarUrl; // malformed URL — fall back to the original rather than throw
  }
}

/** "2024-01-15T10:00:00Z" -> "Updated 3 days ago" style relative label. */
export function formatRelativeDate(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = Math.max(0, now - then);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diffMs < hour) return 'just now';
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs < month) return `${Math.floor(diffMs / day)}d ago`;
  if (diffMs < year) return `${Math.floor(diffMs / month)}mo ago`;
  return `${Math.floor(diffMs / year)}y ago`;
}
