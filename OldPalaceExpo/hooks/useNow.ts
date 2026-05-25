import { useEffect, useRef, useState } from 'react';

/**
 * Returns a reactive `Date` that updates on a fixed interval.
 *
 * Why this exists: four screens (guest dashboard, activities, dining,
 * entertainer) all had identical `useState(new Date())` + `useEffect`
 * setInterval patterns. Centralising here ensures they all tick in sync
 * and the logic lives in exactly one place.
 *
 * @param intervalMs  How often to refresh. Default: 60 000 ms (1 minute).
 *                    Pass 1 000 for a live seconds-display.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  // Keep intervalMs in a ref so changing it doesn't reset the interval
  const intervalRef = useRef(intervalMs);
  intervalRef.current = intervalMs;

  useEffect(() => {
    // Align first tick to the next whole minute boundary so all screens
    // that use the default 60s interval update simultaneously.
    const msUntilNextMinute =
      intervalMs === 60_000
        ? 60_000 - (Date.now() % 60_000)
        : intervalMs;

    const initial = setTimeout(() => {
      setNow(new Date());
      const id = setInterval(() => setNow(new Date()), intervalRef.current);
      return () => clearInterval(id);
    }, msUntilNextMinute);

    return () => clearTimeout(initial);
  }, [intervalMs]);

  return now;
}
