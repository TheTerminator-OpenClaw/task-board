"use client";

import { useState, useEffect, useCallback } from "react";

type TaskStatus = "todo" | "in_progress" | "done";
type Assignee = "ammar" | "terminator";
type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: Assignee;
  createdAt: number;
  updatedAt: number;
  priority?: Priority;
}

const statusColumns: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "bg-gray-100" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-50" },
  { id: "done", label: "Done", color: "bg-green-50" },
];

const assigneeColors: Record<Assignee, string> = {
  ammar: "bg-orange-100 text-orange-800",
  terminator: "bg-purple-100 text-purple-800",
};

const priorityColors: Record<Priority, string> = {
  low: "bg-gray-200 text-gray-600",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const STORAGE_KEY = "terminator-task-board";

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "ammar" as Assignee,
    priority: "medium" as Priority,
  });

  // Load tasks from API (persistent storage)
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        }
      })
      .catch(console.error);
  }, []);

  // Save tasks to API (persistent storage) whenever they change
  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: newTasks }),
    }).catch(console.error);
  }, []);

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || undefined,
      status: "todo",
      assignee: newTask.assignee,
      priority: newTask.priority,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    saveTasks([task, ...tasks]);
    setNewTask({ title: "", description: "", assignee: "ammar", priority: "medium" });
    setShowAddForm(false);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const newTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus, updatedAt: Date.now() } : t
    );
    saveTasks(newTasks);
  };

  const handleAssigneeChange = (taskId: string, newAssignee: Assignee) => {
    const newTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, assignee: newAssignee, updatedAt: Date.now() } : t
    );
    saveTasks(newTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const newTasks = tasks.filter((t) => t.id !== taskId);
    saveTasks(newTasks);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  const ammarTasks = tasks.filter(t => t.assignee === "ammar" && t.status !== "done").length;
  const terminatorTasks = tasks.filter(t => t.assignee === "terminator" && t.status !== "done").length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
            <p className="text-gray-500 mt-1">Track tasks for Ammar & Terminator</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showAddForm ? "Cancel" : "+ Add Task"}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold">
                A
              </div>
              <div>
                <p className="text-sm text-orange-700">Ammar</p>
                <p className="text-2xl font-bold text-orange-900">{ammarTasks} tasks</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold">
                T
              </div>
              <div>
                <p className="text-sm text-purple-700">Terminator</p>
                <p className="text-2xl font-bold text-purple-900">{terminatorTasks} tasks</p>
              </div>
            </div>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">New Task</h2>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description (optional)..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value as Assignee })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ammar">Ammar</option>
                    <option value="terminator">Terminator</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Task
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {statusColumns.map((column) => (
            <div key={column.id} className={`rounded-xl p-4 ${column.color}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">{column.label}</h2>
                <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>
              <div className="space-y-3">
                {getTasksByStatus(column.id).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    onDelete={handleDeleteTask}
                    formatDate={formatDate}
                  />
                ))}
                {getTasksByStatus(column.id).length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onStatusChange,
  onAssigneeChange,
  onDelete,
  formatDate,
}: {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onAssigneeChange: (id: string, assignee: Assignee) => void;
  onDelete: (id: string) => void;
  formatDate: (timestamp: number) => string;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 flex-1">{task.title}</h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <select
          value={task.assignee}
          onChange={(e) => onAssigneeChange(task.id, e.target.value as Assignee)}
          className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${assigneeColors[task.assignee]}`}
        >
          <option value="ammar">Ammar</option>
          <option value="terminator">Terminator</option>
        </select>
        
        {task.priority && (
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{formatDate(task.updatedAt)}</span>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border-0 cursor-pointer"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}
