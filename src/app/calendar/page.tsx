"use client";

import { useState, useEffect } from "react";

type Assignee = "ammar" | "terminator";

interface ScheduledEvent {
  id: string;
  title: string;
  description?: string;
  time: string;
  frequency: "daily" | "weekly" | "monthly" | "once";
  dayOfWeek?: number;
  assignee: Assignee;
  status: "active" | "paused";
}

const SCHEDULE_STORAGE = "terminator-schedule";

// All actual cron jobs
const defaultSchedule: ScheduledEvent[] = [
  // Daily - Morning
  { id: "1", title: "Morning News Debrief", description: "AI/Tech news at 8:30 AM", time: "08:30", frequency: "daily", assignee: "terminator", status: "active" },
  
  // Daily - Hourly
  { id: "2", title: "Hourly Trading Check", description: "Every hour, log to file", time: "09:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "3", title: "Hourly Trading Check", description: "Every hour, log to file", time: "10:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "4", title: "Hourly Trading Check", description: "Every hour, log to file", time: "11:00", frequency: "daily", assignee: "terminator", status: "active" },
  
  // Daily - Noon
  { id: "5", title: "Noon News Summary", description: "Read AI_News_Summary from Downloads, send via iMessage", time: "12:00", frequency: "daily", assignee: "terminator", status: "active" },
  
  // Daily - Afternoon
  { id: "6", title: "Hourly Trading Check", description: "Every hour, log to file", time: "13:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "7", title: "Hourly Trading Check", description: "Every hour, log to file", time: "14:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "8", title: "Hourly Trading Check", description: "Every hour, log to file", time: "15:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "9", title: "Hourly Trading Check", description: "Every hour, log to file", time: "16:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "10", title: "Hourly Trading Check", description: "Every hour, log to file", time: "17:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "11", title: "Hourly Trading Check", description: "Every hour, log to file", time: "18:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "12", title: "Hourly Trading Check", description: "Every hour, log to file", time: "19:00", frequency: "daily", assignee: "terminator", status: "active" },
  
  // Daily - Evening
  { id: "13", title: "Evening News Debrief", description: "AI/Tech news at 8 PM", time: "20:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "14", title: "8PM Trading Update", description: "Send trading update via iMessage", time: "20:00", frequency: "daily", assignee: "terminator", status: "active" },
  
  // Weekly
  { id: "15", title: "Weekly Content Review", description: "Review Value Shift", time: "10:00", frequency: "weekly", dayOfWeek: 1, assignee: "ammar", status: "active" },
];

export default function CalendarPage() {
  const [schedule, setSchedule] = useState<ScheduledEvent[]>([]);
  const [view, setView] = useState<"today" | "week">("today");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to fetch from API first, fall back to defaults
    async function fetchCronJobs() {
      try {
        const response = await fetch('/api/cron?key=mission-control-cron-sync');
        if (response.ok) {
          const data = await response.json();
          if (data.events && data.events.length > 0) {
            setSchedule(data.events);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.log('API fetch failed, using defaults:', e);
        setError('Using cached schedule');
      }
      
      // Fall back to stored or default
      const stored = localStorage.getItem(SCHEDULE_STORAGE);
      if (stored) { 
        try { setSchedule(JSON.parse(stored)); } 
        catch { setSchedule(defaultSchedule); } 
      }
      else { setSchedule(defaultSchedule); }
      setLoading(false);
    }
    
    fetchCronJobs();
  }, []);

  const saveSchedule = (s: ScheduledEvent[]) => { setSchedule(s); localStorage.setItem(SCHEDULE_STORAGE, JSON.stringify(s)); };
  const toggleStatus = (id: string) => saveSchedule(schedule.map(e => e.id === id ? { ...e, status: e.status === "active" ? "paused" : "active" } : e));

  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayEvents = schedule.sort((a, b) => a.time.localeCompare(b.time));
  const currentHour = now.getHours();

  const weekEvents: { day: number; events: ScheduledEvent[] }[] = Array.from({ length: 7 }, (_, i) => {
    const day = (now.getDay() + i) % 7;
    return { day, events: schedule.filter(e => e.status === "active" && (e.frequency === "daily" || e.dayOfWeek === day)) };
  });

  const activeCount = schedule.filter(e => e.status === "active").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Syncing with OpenClaw...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-500 mt-1">All cron jobs & scheduled tasks</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView("today")} className={`px-4 py-2 rounded-lg font-medium ${view === "today" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>Today</button>
            <button onClick={() => setView("week")} className={`px-4 py-2 rounded-lg font-medium ${view === "week" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>Week</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Active Events</p>
            <p className="text-2xl font-bold">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Today's Events</p>
            <p className="text-2xl font-bold">{todayEvents.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">This Week</p>
            <p className="text-2xl font-bold">{weekEvents.reduce((sum, d) => sum + d.events.length, 0)}</p>
          </div>
        </div>

        {view === "today" ? (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-4 text-lg">Today's Schedule</h3>
            <div className="space-y-2">
              {todayEvents.map(event => (
                <div key={event.id} className={`flex items-center justify-between p-3 rounded-lg ${parseInt(event.time.split(":")[0]) <= currentHour ? "bg-gray-100" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-mono w-16">{event.time}</span>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-400">{event.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${event.assignee === "ammar" ? "bg-orange-100 text-orange-800" : "bg-purple-100 text-purple-800"}`}>{event.assignee === "ammar" ? "Ammar" : "Terminator"}</span>
                    <button onClick={() => toggleStatus(event.id)} className={`text-xs px-2 py-1 rounded ${event.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-200"}`}>{event.status}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {weekEvents.map((day, idx) => (
              <div key={idx}>
                <div className={`text-center py-2 rounded-t-lg font-medium text-white ${idx === 0 ? "bg-blue-600" : "bg-gray-600"}`}>{dayNames[day.day]}</div>
                <div className="bg-white rounded-b-lg p-2 space-y-1 min-h-[200px] border border-t-0 border-gray-200">
                  {day.events.length === 0 ? <p className="text-xs text-gray-400 text-center">—</p> : day.events.map(e => (<div key={e.id} className="bg-gray-100 rounded p-1 text-xs"><span className="font-mono">{e.time}</span> {e.title}</div>))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
