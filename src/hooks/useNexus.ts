import { useEventStore } from "../store/events";

declare global {
  interface Window {
    nexus?: {
      track: (type: string, data: Record<string, unknown>) => void;
    };
  }
}

export function useNexus() {
  const { addEvent } = useEventStore();

  const trackEvent = (type: string, eventData: Record<string, unknown>) => {
    addEvent(type, eventData);

    if (window.nexus) {
      window.nexus.track(type, eventData);
    } else {
      console.warn("nexus is not loaded yet");
    }
  };

  return { trackEvent };
}
