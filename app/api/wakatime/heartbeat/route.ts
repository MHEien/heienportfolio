import { NextResponse } from 'next/server';

const WAKATIME_API_BASE = 'https://wakatime.com/api/v1';

export async function GET() {
  const apiKey = process.env.WAKATIME_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'WakaTime API key not configured' },
      { status: 500 }
    );
  }

  const authHeader = `Basic ${Buffer.from(apiKey).toString('base64')}`;

  try {
    const response = await fetch(
      `${WAKATIME_API_BASE}/users/current/heartbeats?date=today&show=1`,
      {
        headers: { Authorization: authHeader },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch latest heartbeat');
    }

    const { data } = await response.json();

    const latestHeartbeat = Array.isArray(data) && data.length > 0 ? data[0] : null;

    if (!latestHeartbeat) {
      return NextResponse.json(
        { error: 'No heartbeat data available' },
        { status: 404 }
      );
    }

    const timestamp = latestHeartbeat.time ? new Date(latestHeartbeat.time * 1000).toISOString() : null;

    return NextResponse.json(
      {
        timestamp,
        project: latestHeartbeat.project || null,
        language: latestHeartbeat.language || null,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('WakaTime heartbeat error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest heartbeat' },
      { status: 500 }
    );
  }
}
