import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { AppState, Text } from 'react-native';
import { useResolvedTheme } from '@/theme/colors';
import { styles } from './styles';

const PROBE_URL = 'https://api.github.com';
const PROBE_TIMEOUT_MS = 4000;
const POLL_INTERVAL_MS = 8000;

/**
 * Ground truth for connectivity: an actual request to the API this app
 * depends on, not the OS's own notion of "connected". We went back and
 * forth on NetInfo's built-in state (`isConnected`, `isInternetReachable`)
 * and hit real false positives *and* false negatives on the iOS Simulator
 * in both directions — its reachability detection just isn't trustworthy
 * there. A direct fetch sidesteps that entirely: if this succeeds, we can
 * reach GitHub, which is the only thing the banner actually claims.
 */
async function probeIsOnline(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    await fetch(PROBE_URL, { method: 'HEAD', signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const { colors } = useResolvedTheme();

  useEffect(() => {
    let cancelled = false;
    // Multiple checks can end up in flight at once (poll tick, a NetInfo
    // event, foreground return all firing close together), each with up to
    // PROBE_TIMEOUT_MS before it resolves. Without this guard, a stale probe
    // that was started while still offline can resolve *after* a newer one
    // that already found us back online, clobbering the correct state and
    // leaving the banner stuck. Only the most recently issued check's
    // result is allowed to apply.
    let latestRequestId = 0;
    const check = () => {
      const requestId = ++latestRequestId;
      probeIsOnline().then(online => {
        if (!cancelled && requestId === latestRequestId) {
          setIsOffline(!online);
        }
      });
    };

    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);

    // We tried trusting `isConnected === false` directly as an instant,
    // no-verification-needed "definitely offline" shortcut — it backfired:
    // NetInfo's listener fires immediately on subscription with whatever it
    // currently has, and right after mount/reload that can be a not-yet-
    // settled `isConnected: false` before the native module's first real
    // measurement completes. Trusting it directly flipped the banner on
    // *and* invalidated the real fetch probe already in flight, discarding
    // its correct "online" answer as "stale" — stuck until the next poll
    // tick. No field on NetInfo has proven reliable enough to act on
    // without verification; every event is just a cue to go check for real.
    const unsubscribeNetInfo = NetInfo.addEventListener(check);

    // JS timers are suspended while backgrounded, so a change that happens
    // while the app isn't foregrounded would otherwise sit unnoticed until
    // the next poll tick after return — recheck immediately instead.
    const appStateSub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') check();
    });

    return () => {
      cancelled = true;
      clearInterval(interval);
      unsubscribeNetInfo();
      appStateSub.remove();
    };
  }, []);

  if (!isOffline) return null;

  return (
    <Text style={[styles.banner, { backgroundColor: colors.danger }]}>
      You're offline — showing cached results
    </Text>
  );
}
