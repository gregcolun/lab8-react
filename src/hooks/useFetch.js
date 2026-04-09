import { useEffect, useState } from "react";

const memoryCache = new Map();
const SESSION_PREFIX = "meal-cache:";

function getStoredEntry(storageKey) {
  try {
    const rawValue = sessionStorage.getItem(storageKey);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

function setStoredEntry(storageKey, entry) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(entry));
  } catch {
  }
}

function readCache(cacheKey) {
  const now = Date.now();
  const storageKey = `${SESSION_PREFIX}${cacheKey}`;
  const memoryEntry = memoryCache.get(cacheKey);

  if (memoryEntry) {
    if (memoryEntry.expiresAt > now) {
      return memoryEntry.data;
    }
    memoryCache.delete(cacheKey);
  }

  const storedEntry = getStoredEntry(storageKey);
  if (!storedEntry) {
    return null;
  }

  if (storedEntry.expiresAt <= now) {
    sessionStorage.removeItem(storageKey);
    return null;
  }

  memoryCache.set(cacheKey, storedEntry);
  return storedEntry.data;
}

function writeCache(cacheKey, data, ttl) {
  const entry = {
    data,
    expiresAt: Date.now() + ttl
  };

  memoryCache.set(cacheKey, entry);
  setStoredEntry(`${SESSION_PREFIX}${cacheKey}`, entry);
}

export function useFetch(url, options = {}) {
  const {
    enabled = true,
    ttl = 5 * 60 * 1000,
    cacheKey
  } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !url) {
      setLoading(false);
      setError(null);
      setData(null);
      return;
    }

    const effectiveCacheKey = cacheKey || url;
    const cachedData = readCache(effectiveCacheKey);

    if (cachedData !== null) {
      setData(cachedData);
      setLoading(false);
      setError(null);
      return;
    }

    const abortController = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    fetch(url, { signal: abortController.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Cererea a eșuat. Încearcă din nou.");
        }
        return response.json();
      })
      .then((json) => {
        if (!active) {
          return;
        }
        setData(json);
        setLoading(false);
        writeCache(effectiveCacheKey, json, ttl);
      })
      .catch((requestError) => {
        if (!active || requestError.name === "AbortError") {
          return;
        }
        setError(requestError.message || "A apărut o eroare.");
        setLoading(false);
      });

    return () => {
      active = false;
      abortController.abort();
    };
  }, [url, enabled, ttl, cacheKey]);

  return { data, loading, error };
}

