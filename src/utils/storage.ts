// Chrome Storage API Wrapper

import { LexiLensSettings, DEFAULT_SETTINGS } from '@/types';

const STORAGE_KEY = 'lexilens_settings';

/**
 * Deep merge utility to safely merge defaults with stored settings
 */
function deepMerge(target: any, source: any): any {
  if (typeof source !== 'object' || source === null) {
    return target;
  }

  // If target isn't an object (but source is), source wins (except if valid default exists? No, just overwrite)
  if (typeof target !== 'object' || target === null) {
    // Actually if target is a primitive default and source is an object (rare mismatch), 
    // we usually trust source if it's user data, but here we are merging defaults (target) with user (source).
    // If defaults say "enabled: false" and user says "enabled: true", we want true.
    return source;
  }

  if (Array.isArray(target)) {
    return Array.isArray(source) ? source : target;
  }

  const output = { ...target };

  Object.keys(source).forEach(key => {
    if (source[key] !== null && typeof source[key] === 'object') {
      if (key in target) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      output[key] = source[key];
    }
  });

  return output;
}

/**
 * Get settings from Chrome storage
 */
export async function getSettings(): Promise<LexiLensSettings> {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get([STORAGE_KEY], (result) => {
        if (result[STORAGE_KEY]) {
          // Deep merge with defaults
          resolve(deepMerge(DEFAULT_SETTINGS, result[STORAGE_KEY]));
        } else {
          resolve(DEFAULT_SETTINGS);
        }
      });
    } else {
      // Fallback to localStorage for development
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        resolve(deepMerge(DEFAULT_SETTINGS, JSON.parse(stored)));
      } else {
        resolve(DEFAULT_SETTINGS);
      }
    }
  });
}

/**
 * Save settings to Chrome storage
 */
export async function saveSettings(settings: LexiLensSettings): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ [STORAGE_KEY]: settings }, () => {
        resolve();
      });
    } else {
      // Fallback to localStorage for development
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      resolve();
    }
  });
}

/**
 * Listen for settings changes from other tabs/contexts
 */
export function onSettingsChange(callback: (settings: LexiLensSettings) => void): () => void {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[STORAGE_KEY]) {
        callback(deepMerge(DEFAULT_SETTINGS, changes[STORAGE_KEY].newValue));
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  } else {
    // Fallback for development - use storage event
    const listener = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        callback(deepMerge(DEFAULT_SETTINGS, JSON.parse(e.newValue)));
      }
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<void> {
  return saveSettings(DEFAULT_SETTINGS);
}
