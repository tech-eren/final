import { GoogleGenAI } from '@google/genai';

/**
 * Resolves GPS coordinates to a human-readable city/district name
 * using the free OpenStreetMap Nominatim API (no API key required).
 */
interface GeoLocation {
  city: string;
  district: string;
  state: string;
  country: string;
}

async function reverseGeocode(lat: number, lng: number): Promise<GeoLocation> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'CivicResolveApp/1.0' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error('Nominatim failed');
    const data = await res.json();
    const addr = data.address || {};
    return {
      city: addr.city || addr.town || addr.municipality || '',
      district: addr.county || addr.state_district || '',
      state: addr.state || 'Assam',
      country: addr.country || 'India'
    };
  } catch {
    console.warn('Reverse geocoding failed, falling back to Silchar');
    return { city: 'Silchar', district: 'Cachar', state: 'Assam', country: 'India' };
  }
}

export const liveIntelService = {
  /**
   * Scrapes live internet data and uses AI to extract civic insights.
   * @param userLat  Browser GPS latitude  (optional, falls back to Silchar)
   * @param userLng  Browser GPS longitude (optional, falls back to Silchar)
   * @returns Parsed array of CivicInsight objects
   */
  analyzeLiveIntel: async (userLat?: number, userLng?: number, scope: 'local' | 'state' | 'national' = 'local'): Promise<any[]> => {
    // Smart scope-aware defaults in case reverseGeocode fails
    const scopeDefaults = { local: 'Silchar', state: 'Assam', national: 'India' };
    let locationQuery = scopeDefaults[scope];
    let resolvedGeo = { city: 'Silchar', district: 'Cachar', state: 'Assam', country: 'India' };
    try {
      const response = await fetch(`/api/analyze-live-intel?location=${encodeURIComponent(locationQuery)}`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const parsed = await response.json();
      
      // Tag all extracted insights with the scope they were found under and sanitize fields
      return parsed.map((item: any) => {
        // Fallback: If AI hallucinates a giant string into a location field, wipe it out
        const safeString = (val: any) => typeof val === 'string' && val.length > 30 ? null : val;
        return { 
          ...item, 
          city: safeString(item.city) || geo.city,
          district: safeString(item.district) || geo.district,
          state: safeString(item.state) || geo.state,
          country: safeString(item.country) || geo.country,
          scope 
        };
      });
    } catch (error: any) {
      console.error(`[AutoScrape] Scope ${scope} failed:`, error);
      return [];
    }
  },
};
