export function useAnalytics() {
  const trackEvent = (type: string, element: string) => {
    // Create a custom event for other parts of the app if needed
    const customEvent = new CustomEvent('analytics-event', {
      detail: {
        id: Math.random().toString(36).substring(2),
        type,
        element,
        timestamp: Date.now(),
      },
    });
    window.dispatchEvent(customEvent);
    console.log("window", window.umami);
  };

  return { trackEvent };
}
