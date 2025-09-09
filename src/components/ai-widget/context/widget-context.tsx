import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Mood, TimeSlot, Genre, WidgetSelection, TasteProfile } from '../types';

export type UIState = {
  open: boolean;
  showOnboarding: boolean;
  showMoodPanel: boolean;
  showTimePanel: boolean;
  processing: boolean;
};

export type WidgetState = {
  ui: UIState;
  selection: WidgetSelection;
  taste: TasteProfile;
};

export type WidgetAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SET_PROMPT'; prompt: string }
  | { type: 'SET_MOOD'; mood: Mood }
  | { type: 'SET_TIME'; time: TimeSlot }
  | { type: 'TOGGLE_GENRE'; genre: Genre }
  | { type: 'CLEAR_GENRES' }
  | { type: 'SET_ONBOARDING'; show: boolean }
  | { type: 'TOGGLE_MOOD_PANEL' }
  | { type: 'TOGGLE_TIME_PANEL' }
  | { type: 'SET_PROCESSING'; value: boolean }
  | { type: 'LIKE'; id: string }
  | { type: 'DISMISS'; id: string };

const ONBOARD_KEY = 'watchit:onboarded';

const initialState: WidgetState = {
  ui: { open: false, showOnboarding: false, showMoodPanel: false, showTimePanel: false, processing: false },
  selection: { genres: [] },
  taste: { moods: {}, genres: {}, durations: {}, likedIds: new Set(), dismissedIds: new Set() },
};

function reducer(state: WidgetState, action: WidgetAction): WidgetState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, ui: { ...state.ui, open: true } };
    case 'CLOSE':
      return { ...state, ui: { ...state.ui, open: false } };
    case 'SET_PROMPT':
      return { ...state, selection: { ...state.selection, prompt: action.prompt } };
    case 'SET_MOOD':
      return { ...state, selection: { ...state.selection, mood: action.mood }, taste: { ...state.taste, moods: { ...state.taste.moods, [action.mood]: (state.taste.moods[action.mood] ?? 0) + 1 } } };
    case 'SET_TIME':
      return { ...state, selection: { ...state.selection, time: action.time }, taste: { ...state.taste, durations: { ...state.taste.durations, [action.time]: (state.taste.durations[action.time] ?? 0) + 1 } } };
    case 'TOGGLE_GENRE': {
      const exists = state.selection.genres.includes(action.genre);
      const next = exists ? state.selection.genres.filter((g) => g !== action.genre) : [...state.selection.genres, action.genre];
      return { ...state, selection: { ...state.selection, genres: next }, taste: { ...state.taste, genres: { ...state.taste.genres, [action.genre]: (state.taste.genres[action.genre] ?? 0) + (exists ? -1 : 1) } } };
    }
    case 'CLEAR_GENRES':
      return { ...state, selection: { ...state.selection, genres: [] } };
    case 'SET_ONBOARDING':
      return { ...state, ui: { ...state.ui, showOnboarding: action.show } };
    case 'TOGGLE_MOOD_PANEL':
      return { ...state, ui: { ...state.ui, showMoodPanel: !state.ui.showMoodPanel, showTimePanel: false } };
    case 'TOGGLE_TIME_PANEL':
      return { ...state, ui: { ...state.ui, showTimePanel: !state.ui.showTimePanel, showMoodPanel: false } };
    case 'SET_PROCESSING':
      return { ...state, ui: { ...state.ui, processing: action.value } };
    case 'LIKE':
      return { ...state, taste: { ...state.taste, likedIds: new Set(state.taste.likedIds).add(action.id) } };
    case 'DISMISS':
      return { ...state, taste: { ...state.taste, dismissedIds: new Set(state.taste.dismissedIds).add(action.id) } };
    default:
      return state;
  }
}

const Ctx = createContext<{ state: WidgetState; dispatch: React.Dispatch<WidgetAction> } | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // show onboarding only first time
  useEffect(() => {
    try { if (!localStorage.getItem(ONBOARD_KEY)) dispatch({ type: 'SET_ONBOARDING', show: true }); } catch {}
  }, []);

  useEffect(() => {
    if (!state.ui.showOnboarding) {
      try { localStorage.setItem(ONBOARD_KEY, '1'); } catch {}
    }
  }, [state.ui.showOnboarding]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWidget() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWidget must be used within <WidgetProvider>');
  return ctx;
}
