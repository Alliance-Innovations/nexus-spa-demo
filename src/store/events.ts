import { create } from 'zustand';

type Event = {
  id: string;
  type: string;
  eventData: Record<string, unknown>;
  timestamp: number;
};

type EventStore = {
  events: Event[];
  addEvent: (type: string, eventData: Record<string, unknown>) => void;
  clearEvents: () => void;
};

// Create the store with proper state management
const eventStore = create<EventStore>((set, get) => ({
  events: [],
  addEvent: (type, eventData) => {
    // Prevent adding duplicate events in rapid succession
    const currentState = get();
    const now = Date.now();
    const recentEvents = currentState.events.filter(
      event => event.type === type && (now - event.timestamp) < 100
    );
    
    // If we have too many recent events of the same type, don't add more
    if (recentEvents.length > 10) {
      console.warn('Too many events of type:', type, 'skipping...');
      return;
    }
    
    set((state) => ({
      events: [...state.events, {
        id: Math.random().toString(36).substring(2),
        type,
        eventData,
        timestamp: now,
      }],
    }));
  },
  clearEvents: () => set({ events: [] }),
}));

export const useEventStore = eventStore;