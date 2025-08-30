import { useEventStore } from "../store/events";
import { useCallback } from "react";

declare global {
  interface Window {
    nexus?: {
      track: (type: string, data: Record<string, unknown>) => void;
    };
  }
}

export function useNexus() {
  const { addEvent } = useEventStore();

  const trackEvent = useCallback((type: string, eventData: Record<string, unknown>) => {
    // Prevent infinite loops by checking if this is a duplicate event
    console.log('Tracking event:', type, eventData);
    
    addEvent(type, eventData);

    if (typeof window !== 'undefined' && window.nexus) {
      window.nexus.track(type, eventData);
    } else if (typeof window !== 'undefined') {
      console.warn("nexus is not loaded yet");
    }
  }, [addEvent]);

  return { trackEvent };
}
