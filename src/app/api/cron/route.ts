import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: Request) {
  // Only allow local requests
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip');
  if (ip && ip !== '127.0.0.1' && ip !== 'localhost' && ip !== '::1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { stdout } = await execAsync('openclaw cron list --json', { timeout: 10000 });
    const data = JSON.parse(stdout);
    const jobs = data.jobs || [];

    const events = jobs.map((job: any) => {
      let time = '09:00';
      const schedule = job.schedule || {};
      
      // Parse schedule
      if (schedule.kind === 'cron' && schedule.expr) {
        const parts = schedule.expr.split(' ');
        if (parts.length >= 2) {
          const hour = parts[1].padStart(2, '0');
          const minute = parts[0].padStart(2, '0');
          time = `${hour}:${minute}`;
        }
      } else if (schedule.kind === 'every') {
        time = '09:00'; // Hourly jobs show at 9am marker
      }

      const state = job.state || {};
      const status = state.lastStatus === 'ok' ? 'active' : 'paused';

      return {
        id: job.id,
        title: job.name || job.id,
        description: `${schedule.kind === 'cron' ? schedule.expr : schedule.kind === 'every' ? 'every ' + (schedule.everyMs / 3600000) + 'h' : 'custom'} | Last: ${state.lastStatus || 'never'}`,
        time,
        frequency: 'daily',
        assignee: 'terminator',
        status,
        lastStatus: state.lastStatus,
        nextRun: state.nextRunAtMs,
      };
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Failed to fetch cron jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch cron jobs', events: [] }, { status: 500 });
  }
}
