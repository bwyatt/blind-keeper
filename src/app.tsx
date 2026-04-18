import { useState, useEffect, useMemo, useRef } from 'preact/hooks';
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
        <button
          class={`tab${activeTab === 'grid' ? ' tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'grid'}
          onClick={() => setActiveTab('grid')}
        >
          Bosses
        </button>
        <button
          class={`tab${activeTab === 'history' ? ' tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          disabled={!activeRun}
        >
          History
        </button>
        <button
          class={`tab${activeTab === 'runs' ? ' tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'runs'}
          onClick={() => setActiveTab('runs')}
        >
          Runs
        </button>
        <button
          class={`tab${activeTab === 'about' ? ' tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'about'}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </nav>

      <div class="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <main class="main-content" role="tabpanel">
        {activeTab === 'grid' && !activeRun && (
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

        {activeTab === 'grid' && activeRun && (
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

        {activeTab === 'history' && activeRun && (
          <History
            run={activeRun}
            onUndo={undoLastEntry}
            onEditEntry={editEntry}
            editingIndex={editingEntryIndex}
            onSetEditingIndex={setEditingEntryIndex}
          />
        )}

        {activeTab === 'runs' && (
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
        )}

        {activeTab === 'about' && <About />}
      </main>
    </div>
  );
}
