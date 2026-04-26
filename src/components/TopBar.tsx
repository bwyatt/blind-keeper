import type { Run } from '../types.ts';

interface TopBarProps {
  run: Run | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onDecrementAnte: () => void;
}

export function TopBar({
  run,
  theme,
  onToggleTheme,
  onDecrementAnte,
}: TopBarProps) {
  return (
    <header class="top-bar">
      <div class="top-bar__title">Blind Keeper</div>
      <div class="top-bar__center">
        {run && (
          <>
            <span class="top-bar__run-name">{run.name}</span>
            <span class="top-bar__ante">Ante {run.currentAnte}</span>
          </>
        )}
      </div>
      <div class="top-bar__actions">
        <button
          class="btn btn--icon"
          onClick={onDecrementAnte}
          disabled={!run || run.anteDecrements >= 2}
          aria-label="Decrement ante"
        >
          −1
        </button>
        <button
          class="btn btn--icon"
          onClick={onToggleTheme}
          aria-label={
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
          }
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
