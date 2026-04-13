import { useEffect, useState } from 'react';
import { getStarsCount } from '../utils/utils';

const CACHE_KEY = 'github_stars_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const DEFAULT_STARS = 33200;

const readCachedStars = () => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) {
      return null;
    }

    const parsed = JSON.parse(cachedData);
    if (!parsed || !parsed.count || parsed.count === 'NAN') {
      return null;
    }

    return {
      count: parsed.count,
      isFresh: Date.now() - parsed.timestamp < CACHE_DURATION
    };
  } catch {
    return null;
  }
};

const writeCachedStars = count => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        count,
        timestamp: Date.now()
      })
    );
  } catch {
    // Ignore storage write failures and keep the in-memory value.
  }
};

export const useStars = () => {
  const [stars, setStars] = useState(() => readCachedStars()?.count || DEFAULT_STARS);

  useEffect(() => {
    const cached = readCachedStars();
    if (cached?.isFresh) {
      return undefined;
    }

    let isMounted = true;

    const fetchStars = async () => {
      const count = await getStarsCount();
      if (!isMounted || !count || count === 'NAN') {
        return;
      }

      writeCachedStars(count);
      setStars(count);
    };

    fetchStars();

    return () => {
      isMounted = false;
    };
  }, []);

  return stars;
};
