"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "developer" | "writer" | "designer" | "researcher" | "analyst";
type Level = "lead" | "senior" | "mid" | "junior";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: Role;
  level: Level;
  department: string;
  reportsTo: string | null;
  description: string;
  responsibilities: string[];
  status: "active" | "available" | "busy";
  tasksCompleted: number;
  tasksFailed: number;
  color: string;
}

const TEAM_STORAGE = "terminator-team";

const defaultTeam: TeamMember[] = [
  // LEVEL 1 - CEO/Lead
  {
    id: "terminator",
    name: "Terminator",
    title: "AI Assistant Lead",
    role: "developer",
    level: "lead",
    department: "Executive",
    reportsTo: null,
    description: "Main AI assistant. Oversees all operations, makes high-level decisions, and manages sub-agents.",
    responsibilities: ["Strategic decisions", "Task orchestration", "Communication with Ammar", "Quality assurance", "Agent management"],
    status: "active",
    tasksCompleted: 150,
    tasksFailed: 2,
    color: "bg-purple-600",
  },
  
  // LEVEL 2 - Direct Reports to Terminator
  {
    id: "dev-agent",
    name: "Developer Agent",
    title: "Head of Engineering",
    role: "developer",
    level: "lead",
    department: "Engineering",
    reportsTo: "terminator",
    description: "Leads all development work. Responsible for code quality, architecture decisions, and technical direction.",
    responsibilities: ["System architecture", "Code reviews", "Technical strategy", "Development mentorship", "Bug resolution"],
    status: "available",
    tasksCompleted: 45,
    tasksFailed: 1,
    color: "bg-blue-600",
  },
  {
    id: "research-agent",
    name: "Research Agent",
    title: "Head of Research",
    role: "researcher",
    level: "lead",
    department: "Research",
    reportsTo: "terminator",
    description: "Leads research initiatives. Responsible for deep dives, competitive analysis, and information synthesis.",
    responsibilities: ["Research strategy", "Data analysis", "Report generation", "Trend identification", "Fact-checking"],
    status: "available",
    tasksCompleted: 32,
    tasksFailed: 0,
    color: "bg-green-600",
  },
  {
    id: "writer-agent",
    name: "Content Writer",
    title: "Head of Content",
    role: "writer",
    level: "lead",
    department: "Content",
    reportsTo: "terminator",
    description: "Leads all content creation. Responsible for written materials, newsletters, and communications.",
    responsibilities: ["Content strategy", "Writing & editing", "Brand voice", "Newsletter production", "Social media"],
    status: "available",
    tasksCompleted: 28,
    tasksFailed: 0,
    color: "bg-yellow-600",
  },
  {
    id: "trading-agent",
    name: "Trading Analyst",
    title: "Senior Trading Analyst",
    role: "analyst",
    level: "senior",
    department: "Finance",
    reportsTo: "terminator",
    description: "Monitors markets and provides trading insights. Directly responsible for portfolio performance.",
    responsibilities: ["Price monitoring", "Market analysis", "Portfolio tracking", "Signal generation", "Risk assessment"],
    status: "available",
    tasksCompleted: 85,
    tasksFailed: 3,
    color: "bg-red-600",
  },
  {
    id: "designer-agent",
    name: "UI Designer",
    title: "Senior Designer",
    role: "designer",
    level: "senior",
    department: "Design",
    reportsTo: "terminator",
    description: "Creates user interfaces and visual designs. Responsible for all visual output quality.",
    responsibilities: ["UI/UX design", "Prototyping", "Design systems", "Brand identity", "Frontend implementation"],
    status: "available",
    tasksCompleted: 15,
    tasksFailed: 1,
    color: "bg-pink-600",
  },
];

export default function TeamPage() {
  const pathname = usePathname();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [expanded, setExpanded] = useState<boolean>(true);

  useEffect(() => {
    const stored = localStorage.getItem(TEAM_STORAGE);
    if (stored) {
      try { setTeam(JSON.parse(stored)); }
      catch { setTeam(defaultTeam); localStorage.setItem(TEAM_STORAGE, JSON.stringify(defaultTeam)); }
    } else {
      setTeam(defaultTeam);
      localStorage.setItem(TEAM_STORAGE, JSON.stringify(defaultTeam));
    }
  }, []);

  const saveTeam = (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    localStorage.setItem(TEAM_STORAGE, JSON.stringify(newTeam));
  };

  const navItems = [
    { href: "/", label: "Tasks", icon: "📋" },
    { href: "/calendar", label: "Calendar", icon: "📅" },
    { href: "/team", label: "Team", icon: "👥" },
  ];

  const terminator = team.find(m => m.id === "terminator");
  const directReports = team.filter(m => m.reportsTo === "terminator");
  const totalTasks = team.reduce((sum, m) => sum + m.tasksCompleted, 0);
  const totalFailed = team.reduce((sum, m) => sum + m.tasksFailed, 0);

  const fireAgent = (id: string) => {
    if (confirm("Are you sure you want to fire this agent? This cannot be undone.")) {
      saveTeam(team.filter(m => m.id !== id));
    }
  };

  const getSuccessRate = (member: TeamMember) => {
    const total = member.tasksCompleted + member.tasksFailed;
    if (total === 0) return 100;
    return Math.round((member.tasksCompleted / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
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
            <div className="bg-gray-700 rounded-lg p-3"><p className="text-xs text-gray-400">Team Members</p><p className="text-xl font-bold">{team.length}</p></div>
            <div className="bg-gray-700 rounded-lg p-3"><p className="text-xs text-gray-400">Success Rate</p><p className="text-xl font-bold text-green-400">{totalTasks + totalFailed > 0 ? Math.round((totalTasks / (totalTasks + totalFailed)) * 100) : 100}%</p></div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Team</h2>
          <p className="text-gray-400">Terminator's organization — click ▶ to show/hide reports</p>
        </div>

        {/* TERMINATOR - TOP OF ORG */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">Leadership</h3>
          
          {/* Terminator Card - Always Visible */}
          {terminator && (
            <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-xl border-2 border-purple-500 p-6 mb-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className={`w-20 h-20 ${terminator.color} rounded-full flex items-center justify-center text-white text-3xl font-bold ring-4 ring-purple-400`}>
                  {terminator.name.charAt(0)}
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-white">{terminator.name}</h3>
                    <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">LEAD</span>
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">active</span>
                  </div>
                  <p className="text-purple-200 text-lg">{terminator.title}</p>
                  <p className="text-gray-300 mt-2">{terminator.description}</p>
                  
                  {/* Stats */}
                  <div className="flex gap-6 mt-4">
                    <div><p className="text-xs text-gray-400">Tasks Done</p><p className="text-xl font-bold text-white">{terminator.tasksCompleted}</p></div>
                    <div><p className="text-xs text-gray-400">Success</p><p className="text-xl font-bold text-green-400">{getSuccessRate(terminator)}%</p></div>
                    <div><p className="text-xs text-gray-400">Direct Reports</p><p className="text-xl font-bold text-white">{directReports.length}</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expand/Collapse Button */}
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors mb-4"
          >
            <span className="text-xl">{expanded ? "▼" : "▶"}</span>
            <span>{expanded ? "Hide" : "Show"} Team ({directReports.length} agents)</span>
          </button>

          {/* DIRECT REPORTS - Grid */}
          {expanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {directReports.map(agent => {
                const successRate = getSuccessRate(agent);
                return (
                  <div key={agent.id} className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors overflow-hidden">
                    {/* Card Header */}
                    <div className="p-4 flex items-start gap-3">
                      <div className={`w-12 h-12 ${agent.color} rounded-full flex items-center justify-center text-white font-bold`}>
                        {agent.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-white">{agent.name}</h4>
                          <button 
                            onClick={() => fireAgent(agent.id)}
                            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 hover:bg-red-900/30 rounded"
                            title="Fire this agent"
                          >
                            🔥
                          </button>
                        </div>
                        <p className="text-sm text-gray-400">{agent.title}</p>
                      </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="px-4 pb-3 flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded ${agent.level === 'lead' ? 'bg-purple-900 text-purple-200' : agent.level === 'senior' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'}`}>
                        {agent.level}
                      </span>
                      <div className="flex gap-3 text-xs">
                        <span className="text-gray-400">{agent.tasksCompleted} tasks</span>
                        <span className={successRate >= 90 ? "text-green-400" : successRate >= 70 ? "text-yellow-400" : "text-red-400"}>
                          {successRate}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="px-4 pb-4">
                      <p className="text-xs text-gray-400">{agent.description}</p>
                    </div>
                    
                    {/* Responsibilities */}
                    <div className="px-4 pb-4">
                      <div className="flex flex-wrap gap-1">
                        {agent.responsibilities.slice(0, 3).map((resp, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">{resp}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Performance Table */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Performance</h3>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-4 py-3">Agent</th>
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-4 py-3">Role</th>
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-4 py-3">Level</th>
                  <th className="text-right text-xs font-medium text-gray-300 uppercase tracking-wider px-4 py-3">Tasks</th>
                  <th className="text-right text-xs font-medium text-gray-300 uppercase tracking-wider px-4 py-3">Success</th>
                  <th className="text-right text-xs font-medium text-gray-300 uppercase tracking-wider px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {team.filter(m => m.id !== "terminator").map(agent => (
                  <tr key={agent.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${agent.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                          {agent.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{agent.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{agent.role}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${agent.level === 'lead' ? 'bg-purple-900 text-purple-200' : agent.level === 'senior' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'}`}>
                        {agent.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-white">{agent.tasksCompleted}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={getSuccessRate(agent) >= 90 ? "text-green-400" : getSuccessRate(agent) >= 70 ? "text-yellow-400" : "text-red-400"}>
                        {getSuccessRate(agent)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => fireAgent(agent.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                        title="Fire"
                      >
                        🔥
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
