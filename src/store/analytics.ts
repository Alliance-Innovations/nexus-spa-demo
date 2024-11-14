import { create } from 'zustand';

type Event = {
  id: string;
  type: string;
  eventData: Record<string, unknown>;
  timestamp: number;
};

type AnalyticsStore = {
  events: Event[];
  addEvent: (type: string, eventData: Record<string, unknown>) => void;
  clearEvents: () => void;
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  events: [],
  addEvent: (type, eventData) => set((state) => ({
    events: [...state.events, {
      id: Math.random().toString(36).substring(2),
      type,
      eventData,
      timestamp: Date.now(),
    }],
  })),
  clearEvents: () => set({ events: [] }),
}));