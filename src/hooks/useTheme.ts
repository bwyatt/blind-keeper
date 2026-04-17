import { useState, useCallback, useEffect } from 'preact/hooks';

type Theme = 'dark' | 'light';

const COOKIE_NAME = 'blind-keeper-theme';
const COOKIE_MAX_AGE = 31536000; // 1 year in seconds

function getCookie(name: string): string | undefined {
  const match = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`));
  return match?.split('=')[1];
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; SameSite=Lax; max-age=${COOKIE_MAX_AGE}`;
}

function detectTheme(): Theme {
  const fromCookie = getCookie(COOKIE_NAME);
  if (fromCookie === 'dark' || fromCookie === 'light') return fromCookie;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(detectTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setCookie(COOKIE_NAME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
