"use client";

import { useState, useEffect } from "react";
import { useNexus } from "@/hooks/useNexus";
import { EventLog } from "@/components/EventLog";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

export default function Dashboard() {
  const { trackEvent } = useNexus();
  const [selectedMetric, setSelectedMetric] = useState("users");
  const [timeRange, setTimeRange] = useState("7d");
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    trackEvent("page_view", {
      page: "dashboard",
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
    });

    // Simulate chart data
    setChartData(Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000)));
  }, [trackEvent]);

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
    trackEvent("metric_change", {
      metric,
      previous_metric: selectedMetric,
      timestamp: new Date().toISOString(),
    });
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    trackEvent("time_range_change", {
      range,
      previous_range: timeRange,
      timestamp: new Date().toISOString(),
    });
  };

  const handleExportData = () => {
    trackEvent("data_export", {
      metric: selectedMetric,
      time_range: timeRange,
      timestamp: new Date().toISOString(),
    });
    alert("Data exported successfully!");
  };

  const metrics = [
    { id: "users", label: "Active Users", value: "12,847", change: "+12%" },
    { id: "revenue", label: "Revenue", value: "$45,231", change: "+8%" },
    { id: "orders", label: "Orders", value: "1,234", change: "+15%" },
    { id: "conversion", label: "Conversion Rate", value: "3.2%", change: "+2%" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your key metrics and performance</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleMetricChange(metric.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <span className="text-green-600 text-sm font-medium">{metric.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metric
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => handleMetricChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="users">Active Users</option>
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
                <option value="conversion">Conversion Rate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleExportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Chart: {selectedMetric}</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Chart visualization for {selectedMetric}</p>
              <p className="text-sm text-gray-400">Data points: {chartData.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-8">
          <AnalyticsDashboard />
        </div>

        {/* Event Log */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Events</h3>
          <EventLog />
        </div>
      </div>
    </div>
  );
}
