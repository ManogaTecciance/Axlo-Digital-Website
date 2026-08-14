'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/* --------------------------------------------------------------------------
   Display preferences.

   The site is dark-only. There is no theme preference, no light stylesheet
   and no switcher — `data-theme="dark"` is written once on <html> in the root
   layout and never changes. Sections still carry their own `data-theme="dark"`
   so the semantic token layer resolves inside them exactly as it does at the
   document level.

   Motion is the one display preference that remains, because it is an
   accessibility control rather than a style choice: the OS setting is honoured
   by default, and this lets someone quieten motion on this site specifically
   without changing their system.
   -------------------------------------------------------------------------- */

export type MotionPreference = 'system' | 'reduced';

const MOTION_KEY = 'axlo-motion';

type PreferencesContextValue = {
  motionPreference: MotionPreference;
  setMotionPreference: (value: MotionPreference) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

/**
 * Inline script that applies the stored motion preference before first paint,
 * so a reduced-motion visitor never sees a frame of the entrance animations.
 * Kept dependency-free and small enough to inline safely.
 */
export const themeInitScript = `(function(){try{
var m=localStorage.getItem('${MOTION_KEY}')||'system';
if(m==='reduced'){document.documentElement.setAttribute('data-motion','reduced');}
}catch(e){}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [motionPreference, setMotionPreferenceState] = useState<MotionPreference>('system');

  // Adopt whatever the pre-paint script already resolved.
  useEffect(() => {
    const stored = (localStorage.getItem(MOTION_KEY) as MotionPreference | null) ?? 'system';
    setMotionPreferenceState(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (motionPreference === 'reduced') {
      root.setAttribute('data-motion', 'reduced');
    } else {
      root.removeAttribute('data-motion');
    }
  }, [motionPreference]);

  const setMotionPreference = useCallback((value: MotionPreference) => {
    setMotionPreferenceState(value);
    try {
      localStorage.setItem(MOTION_KEY, value);
    } catch {
      /* storage unavailable — the preference simply does not persist */
    }
  }, []);

  const value = useMemo(
    () => ({ motionPreference, setMotionPreference }),
    [motionPreference, setMotionPreference],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used inside <ThemeProvider>');
  return context;
}
