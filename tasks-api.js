// Tasks API - programmatic access to task board
// Run: node tasks-api.js

const STORAGE_KEY = "terminator-task-board";

function getTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function addTask({ title, description, assignee, priority }) {
  const tasks = getTasks();
  const task = {
    id: Date.now().toString(),
    title,
    description,
    status: "todo",
    assignee,
    priority: priority || "medium",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  tasks.unshift(task);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  return task;
}

// Add starter tasks
addTask({
  title: "Set up Convex database",
  description: "Migrate from localStorage to Convex for real-time sync",
  assignee: "terminator",
  priority: "high",
});

addTask({
  title: "Research AI disruption in staffing",
  description: "Deep dive on how AI is affecting the staffing/recruitment industry",
  assignee: "terminator",
  priority: "medium",
});

addTask({
  title: "Value Shift Framework content",
  description: "Build content series on how AI transforms jobs across industries",
  assignee: "ammar",
  priority: "high",
});

addTask({
  title: "Morning news debrief",
  description: "Daily 8:30 AM news summary via iMessage",
  assignee: "terminator",
  priority: "medium",
});

console.log("Starter tasks added!");
