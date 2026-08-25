import { liveIntelService } from './liveIntelService';
import { issueService } from './issueService';

const THROTTLE_KEY = 'civic_resolve_last_auto_scrape_v10';
const THROTTLE_MS = 30 * 60 * 1000; // 30 minutes

const DEFAULT_LOCATION = {
  city: "Silchar",
  district: "Cachar",
  state: "Assam",
  country: "India",
  latitude: 24.8333,
  longitude: 92.7789
};

function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve({ lat: DEFAULT_LOCATION.latitude, lng: DEFAULT_LOCATION.longitude });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({ lat: DEFAULT_LOCATION.latitude, lng: DEFAULT_LOCATION.longitude }),
      { timeout: 6000 }
    );
  });
}

function shouldScrape(): boolean {
  try {
    const last = localStorage.getItem(THROTTLE_KEY);
    if (!last) return true;
    return Date.now() - parseInt(last, 10) > THROTTLE_MS;
  } catch {
    return true;
  }
}

function markScraped() {
  try {
    localStorage.setItem(THROTTLE_KEY, Date.now().toString());
  } catch { /* ignore */ }
}

export function clearScrapeThrottle() {
  try {
    localStorage.removeItem(THROTTLE_KEY);
    console.log('[AutoScrape] Throttle cleared — will run on next call.');
  } catch { /* ignore */ }
}

export function getLastScrapeTime(): Date | null {
  try {
    const last = localStorage.getItem(THROTTLE_KEY);
    return last ? new Date(parseInt(last, 10)) : null;
  } catch {
    return null;
  }
}

export async function runAutoScrape(): Promise<void> {
  if (!shouldScrape()) {
    console.log('[AutoScrape] Throttled — last ran < 30 min ago. Skipping.');
    return;
  }

  console.log('[AutoScrape] Starting background web scrape...');

  try {
    issueService.clearStaleAiIssues();

    const { lat, lng } = await getUserLocation();
    console.log(`[AutoScrape] Location resolved: (${lat.toFixed(4)}, ${lng.toFixed(4)})`);

    const scopes: ('local' | 'state' | 'national')[] = ['local', 'state', 'national'];
    let allInsights: any[] = [];

    for (const scope of scopes) {
      try {
        console.log(`[AutoScrape] Fetching insights for scope: ${scope}`);
        const insights = await liveIntelService.analyzeLiveIntel(lat, lng, scope);
        if (insights && insights.length > 0) {
          allInsights = [...allInsights, ...insights];
        }
      } catch (err) {
        console.warn(`[AutoScrape] Scope ${scope} failed:`, err);
      }
    }

    if (allInsights.length > 0) {
      await issueService.addCivicInsights(allInsights, lat, lng);
      console.log(`[AutoScrape] Posted ${allInsights.length} AI-detected issues to the Feed.`);
      // Notify any listening components (e.g. Feed) that new posts are ready
      window.dispatchEvent(new CustomEvent('ai-posts-ready'));
    } else {
      console.log('[AutoScrape] No insights returned from any live scrape.');
    }

    markScraped();
  } catch (err) {
    console.warn('[AutoScrape] Failed silently:', err);
  }
}
