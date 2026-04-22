import { useState, useEffect, useMemo, useRef, useCallback } from 'preact/hooks';
import { useAppState } from './hooks/useAppState.ts';
import { useAnteActions } from './hooks/useAnteActions.ts';
import { useTheme } from './hooks/useTheme.ts';
import { getEligibleBosses } from './engine/availability.ts';
import { TopBar } from './components/TopBar.tsx';
import { BossGrid } from './components/BossGrid.tsx';
import { RunManager } from './components/RunManager.tsx';
import { History } from './components/History.tsx';
import { BossPillList } from './components/BossPillList.tsx';
import { About } from './components/About.tsx';
import './app.css';

type Tab = 'grid' | 'history' | 'runs' | 'about';

const ALL_TABS: Tab[] = ['grid', 'history', 'runs', 'about'];
const TAB_LABELS: Record<Tab, string> = {
  grid: 'Bosses',
  history: 'History',
  runs: 'Runs',
  about: 'About',
};

export function App() {
  const {
    state,
    activeRun,
    createRun,
    switchRun,
    endRun,
    deleteRun,
    clearCompleted,
    clearAll,
    updateRun,
  } = useAppState();
  const { addEntry, undoLastEntry, editEntry, decrementAnte } =
    useAnteActions(activeRun, updateRun, endRun);
  const { theme, toggleTheme } = useTheme();

  const [rerolledBosses, setRerolledBosses] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('grid');
  const [editingEntryIndex, setEditingEntryIndex] = useState<number | null>(
    null,
  );

  // Clear rerolledBosses when activeRun or ante changes
  useEffect(() => {
    setRerolledBosses([]);
  }, [activeRun?.id, activeRun?.currentAnte]);

  const eligibleBosses = useMemo(() => {
    if (!activeRun) return [];
    return getEligibleBosses(activeRun.entries, activeRun.currentAnte);
  }, [activeRun?.entries, activeRun?.currentAnte]);

  const handleFace = (bossId: string) => {
    addEntry(bossId, rerolledBosses);
    setRerolledBosses([]);
  };

  const handleReroll = (bossId: string) => {
    setRerolledBosses((prev) => [...prev, bossId]);
  };

  const disabledTabs = useMemo<Set<Tab>>(
    () => (activeRun ? new Set() : new Set<Tab>(['history'])),
    [activeRun],
  );

  const handleTabKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const navigableTabs = ALL_TABS.filter((t) => !disabledTabs.has(t));
      const currentIndex = navigableTabs.indexOf(activeTab);
      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % navigableTabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + navigableTabs.length) % navigableTabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = navigableTabs.length - 1;
      }

      if (nextIndex !== currentIndex) {
        const nextTab = navigableTabs[nextIndex];
        setActiveTab(nextTab);
        document.getElementById(`tab-${nextTab}`)?.focus();
      }
    },
    [activeTab, disabledTabs],
  );

  // aria-live announcement
  const prevAnteRef = useRef(activeRun?.currentAnte ?? null);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const currentAnte = activeRun?.currentAnte ?? null;
    if (currentAnte !== null && prevAnteRef.current !== null && currentAnte !== prevAnteRef.current) {
      setAnnouncement(`Ante ${currentAnte}`);
    }
    prevAnteRef.current = currentAnte;
  }, [activeRun?.currentAnte]);

  return (
    <div class="app">
      <TopBar
        run={activeRun}
        theme={theme}
        onToggleTheme={toggleTheme}
        onDecrementAnte={decrementAnte}
      />

      <nav class="tab-bar" role="tablist" aria-label="Main navigation">
        {ALL_TABS.map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            class={`tab${activeTab === tab ? ' tab--active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`tabpanel-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            disabled={disabledTabs.has(tab)}
            onClick={() => setActiveTab(tab)}
            onKeyDown={handleTabKeyDown}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </nav>

      <div class="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <main class="main-content">
        <div
          role="tabpanel"
          id="tabpanel-grid"
          aria-labelledby="tab-grid"
          tabIndex={activeTab === 'grid' ? 0 : -1}
          hidden={activeTab !== 'grid'}
        >
          {!activeRun && (
            <div class="welcome">
              <h1>Welcome to Blind Keeper</h1>
              <p>Track your Balatro boss blinds across runs.</p>
              <button
                class="btn btn--primary"
                onClick={() => setActiveTab('runs')}
                aria-label="Create a new run"
              >
                New Run
              </button>
            </div>
          )}

          {activeRun && (
            <>
              <BossPillList
                label="Faced"
                items={activeRun.entries.map((e) => ({
                  id: e.facedBoss,
                  subtitle: `(${e.anteNumber})`,
                }))}
              />
              <BossPillList
                label="Rerolled"
                items={rerolledBosses.map((id) => ({ id }))}
              />
              <BossGrid
                eligibleBosses={eligibleBosses}
                rerolledBosses={rerolledBosses}
                onFace={handleFace}
                onReroll={handleReroll}
              />
            </>
          )}
        </div>

        <div
          role="tabpanel"
          id="tabpanel-history"
          aria-labelledby="tab-history"
          tabIndex={activeTab === 'history' ? 0 : -1}
          hidden={activeTab !== 'history'}
        >
          {activeRun && (
            <History
              run={activeRun}
              onUndo={undoLastEntry}
              onEditEntry={editEntry}
              editingIndex={editingEntryIndex}
              onSetEditingIndex={setEditingEntryIndex}
            />
          )}
        </div>

        <div
          role="tabpanel"
          id="tabpanel-runs"
          aria-labelledby="tab-runs"
          tabIndex={activeTab === 'runs' ? 0 : -1}
          hidden={activeTab !== 'runs'}
        >
          <RunManager
            state={state}
            onCreateRun={createRun}
            onSwitchRun={(id) => {
              switchRun(id);
              setActiveTab('grid');
            }}
            onEndRun={endRun}
            onDeleteRun={deleteRun}
            onClearCompleted={clearCompleted}
            onClearAll={clearAll}
            activeRunId={state.activeRunId}
          />
        </div>

        <div
          role="tabpanel"
          id="tabpanel-about"
          aria-labelledby="tab-about"
          tabIndex={activeTab === 'about' ? 0 : -1}
          hidden={activeTab !== 'about'}
        >
          <About />
        </div>
      </main>
    </div>
  );
}
