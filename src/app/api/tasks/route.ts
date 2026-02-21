import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const TASKS_FILE = join(process.cwd(), 'tasks.json');

// Only allow local requests
function isLocalRequest(request: Request): boolean {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip');
  return !ip || ip === '127.0.0.1' || ip === 'localhost' || ip === '::1';
}

export async function GET() {
  if (!isLocalRequest(new Request('http://localhost'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    const tasks = JSON.parse(data);
    return NextResponse.json({ tasks });
  } catch (error) {
    // If file doesn't exist, return empty array
    return NextResponse.json({ tasks: [] });
  }
}

export async function POST(request: Request) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { tasks } = body;
    
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save tasks:', error);
    return NextResponse.json({ error: 'Failed to save tasks' }, { status: 500 });
  }
}
