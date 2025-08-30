"use client";

import { useState, useEffect } from "react";
import { useEventStore } from "@/store/events";
import { useNexus } from "@/hooks/useNexus";

export function AnalyticsDashboard() {
  const { events } = useEventStore();
  const { trackEvent } = useNexus();
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h");
  const [eventStats, setEventStats] = useState<Record<string, number>>({});

  useEffect(() => {
    // Calculate event statistics
    const stats: Record<string, number> = {};
    events.forEach(event => {
      stats[event.type] = (stats[event.type] || 0) + 1;
    });
    setEventStats(stats);

    // Track dashboard view
    trackEvent("analytics_dashboard_view", {
      time_range: selectedTimeRange,
      total_events: events.length,
      unique_event_types: Object.keys(stats).length,
      timestamp: new Date().toISOString(),
    });
  }, [events, selectedTimeRange, trackEvent]);

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    trackEvent("analytics_time_range_change", {
      time_range: range,
      previous_range: selectedTimeRange,
      timestamp: new Date().toISOString(),
    });
  };

  const handleExportData = () => {
    trackEvent("analytics_data_export", {
      time_range: selectedTimeRange,
      total_events: events.length,
      timestamp: new Date().toISOString(),
    });
    
    // Create CSV export
    const csvContent = [
      ["Event Type", "Timestamp", "Data"],
      ...events.map(event => [
        event.type,
        event.timestamp,
        JSON.stringify(event.data)
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-export-${selectedTimeRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const timeRanges = [
    { value: "1h", label: "Last Hour" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
  ];

  const topEvents = Object.entries(eventStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Analytics Dashboard</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleExportData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{events.length}</div>
          <div className="text-sm text-blue-600">Total Events</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{Object.keys(eventStats).length}</div>
          <div className="text-sm text-green-600">Event Types</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {events.length > 0 ? Math.round(events.length / Object.keys(eventStats).length) : 0}
          </div>
          <div className="text-sm text-purple-600">Avg Events/Type</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Top Event Types</h4>
          <div className="space-y-2">
            {topEvents.map(([eventType, count]) => (
              <div key={eventType} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{eventType}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Events</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {events.slice(-5).reverse().map((event, index) => (
              <div key={index} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{event.type}</span>
                  <span className="text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-600 truncate">
                  {JSON.stringify(event.data).substring(0, 50)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Event Timeline</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 text-center">
            {events.length > 0 ? (
              <div className="space-y-2">
                {events.slice(-10).reverse().map((event, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-900">{event.type}</span>
                    <span className="text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No events recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
