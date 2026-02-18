"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const defaultSchedule: Omit<ScheduledEvent, "nextRun">[] = [
  { id: "1", title: "Morning News Debrief", description: "Send AI/Tech/Crypto news summary", time: "08:30", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "2", title: "Trading Update", description: "Check crypto/stock prices", time: "12:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "3", title: "Evening Trading Check", description: "Final trading review", time: "20:00", frequency: "daily", assignee: "terminator", status: "active" },
  { id: "4", title: "Weekly Content Review", description: "Review Value Shift", time: "10:00", frequency: "weekly", dayOfWeek: 1, assignee: "ammar", status: "active" },
];

export default function CalendarPage() {
  const pathname = usePathname();
  const [schedule, setSchedule] = useState<ScheduledEvent[]>([]);
  const [view, setView] = useState<"today" | "week">("today");

  useEffect(() => {
    const stored = localStorage.getItem(SCHEDULE_STORAGE);
    if (stored) { try { setSchedule(JSON.parse(stored)); } catch { setSchedule(defaultSchedule as ScheduledEvent[]); } }
    else { setSchedule(defaultSchedule as ScheduledEvent[]); }
  }, []);

  const saveSchedule = (s: ScheduledEvent[]) => { setSchedule(s); localStorage.setItem(SCHEDULE_STORAGE, JSON.stringify(s)); };
  const toggleStatus = (id: string) => saveSchedule(schedule.map(e => e.id === id ? { ...e, status: e.status === "active" ? "paused" : "active" } : e));

  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayEvents = schedule.filter(e => e.status === "active" && e.frequency === "daily").sort((a, b) => a.time.localeCompare(b.time));
  const currentHour = now.getHours();

  const weekEvents: { day: number; events: ScheduledEvent[] }[] = Array.from({ length: 7 }, (_, i) => {
    const day = (now.getDay() + i) % 7;
    return { day, events: schedule.filter(e => e.status === "active" && (e.frequency === "daily" || e.dayOfWeek === day)) };
  });

  const navItems = [
    { href: "/", label: "Tasks", icon: "📋" },
    { href: "/calendar", label: "Calendar", icon: "📅" },
    { href: "/team", label: "Team", icon: "👥" },
  ];

  const activeCount = schedule.filter(e => e.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <h1 className="text-xl font-bold text-white mb-6 px-2">Mission Control</h1>
        <nav className="space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === item.href ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="space-y-3">
            <div className="bg-gray-700 rounded-lg p-3"><p className="text-xs text-gray-400">Scheduled</p><p className="text-xl font-bold">{activeCount}</p></div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div><h2 className="text-2xl font-bold text-white">Calendar</h2><p className="text-gray-400 mt-1">Scheduled tasks & cron jobs</p></div>
          <div className="flex gap-2">
            <button onClick={() => setView("today")} className={`px-4 py-2 rounded-lg ${view === "today" ? "bg-blue-600" : "bg-gray-700"}`}>Today</button>
            <button onClick={() => setView("week")} className={`px-4 py-2 rounded-lg ${view === "week" ? "bg-blue-600" : "bg-gray-700"}`}>Week</button>
          </div>
        </div>

        {view === "today" ? (
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Today's Schedule</h3>
            <div className="space-y-2">
              {todayEvents.map(event => (
                <div key={event.id} className={`flex items-center justify-between p-3 rounded-lg ${parseInt(event.time.split(":")[0]) <= currentHour ? "bg-gray-700/50" : "bg-gray-700"}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-mono w-16">{event.time}</span>
                    <div><p className="font-medium">{event.title}</p><p className="text-sm text-gray-400">{event.description}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${event.assignee === "ammar" ? "bg-orange-900 text-orange-200" : "bg-purple-900 text-purple-200"}`}>{event.assignee === "ammar" ? "Ammar" : "Terminator"}</span>
                    <button onClick={() => toggleStatus(event.id)} className={`text-xs px-2 py-1 rounded ${event.status === "active" ? "bg-green-900 text-green-200" : "bg-gray-600"}`}>{event.status}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {weekEvents.map((day, idx) => (
              <div key={idx}>
                <div className={`text-center py-2 rounded-t-lg font-medium ${idx === 0 ? "bg-blue-600" : "bg-gray-700"}`}>{dayNames[day.day]}</div>
                <div className="bg-gray-800 rounded-b-lg p-2 space-y-1 min-h-[200px]">
                  {day.events.length === 0 ? <p className="text-xs text-gray-500 text-center">—</p> : day.events.map(e => (<div key={e.id} className="bg-gray-700 rounded p-1 text-xs"><span className="font-mono">{e.time}</span> {e.title}</div>))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
