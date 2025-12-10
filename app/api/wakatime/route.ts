import { NextResponse } from 'next/server';

// WakaTime API endpoints
const WAKATIME_API_BASE = 'https://wakatime.com/api/v1';

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300;

type WakaTimeStats = {
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
  dailyAverage: number;
  thisWeek: number;
  thisMonth: number;
  languages: Array<{
    name: string;
    hours: number;
    percentage: number;
    color: string;
  }>;
  weeklyActivity: Array<{
    day: string;
    hours: number;
  }>;
  recentProjects: Array<{
    name: string;
    hours: number;
    language: string;
  }>;
};

// Language colors mapping
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Dart: '#00b4ab',
  Python: '#3776ab',
  Go: '#00add8',
  Rust: '#dea584',
  SQL: '#e38c00',
  HTML: '#e34c26',
  CSS: '#1572b6',
  SCSS: '#c6538c',
  JSON: '#292929',
  Markdown: '#083fa1',
  YAML: '#cb171e',
  Shell: '#89e051',
  Bash: '#89e051',
  Docker: '#384d54',
  Other: '#6b7280',
};

function getLanguageColor(language: string): string {
  return languageColors[language] || languageColors.Other;
}

function secondsToHours(seconds: number): number {
  return Math.round((seconds / 3600) * 10) / 10;
}

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
    // Fetch multiple endpoints in parallel
    const [statsResponse, allTimeResponse, summaryResponse] = await Promise.all([
      // Last 7 days stats
      fetch(`${WAKATIME_API_BASE}/users/current/stats/last_7_days`, {
        headers: { Authorization: authHeader },
        next: { revalidate: CACHE_DURATION },
      }),
      // All time stats
      fetch(`${WAKATIME_API_BASE}/users/current/all_time_since_today`, {
        headers: { Authorization: authHeader },
        next: { revalidate: CACHE_DURATION },
      }),
      // Last 30 days summary for monthly data
      fetch(`${WAKATIME_API_BASE}/users/current/summaries?range=last_30_days`, {
        headers: { Authorization: authHeader },
        next: { revalidate: CACHE_DURATION },
      }),
    ]);

    if (!statsResponse.ok || !allTimeResponse.ok || !summaryResponse.ok) {
      throw new Error('Failed to fetch WakaTime data');
    }

    const [statsData, allTimeData, summaryData] = await Promise.all([
      statsResponse.json(),
      allTimeResponse.json(),
      summaryResponse.json(),
    ]);

    // Process languages from last 7 days
    const languages = (statsData.data?.languages || [])
      .slice(0, 7)
      .map((lang: { name: string; total_seconds: number; percent: number }) => ({
        name: lang.name,
        hours: secondsToHours(lang.total_seconds),
        percentage: Math.round(lang.percent * 10) / 10,
        color: getLanguageColor(lang.name),
      }));

    // Process weekly activity from summaries
    const weeklyActivity = (summaryData.data || [])
      .slice(-7)
      .map((day: { range: { date: string }; grand_total: { total_seconds: number } }) => {
        const date = new Date(day.range.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        return {
          day: dayName,
          hours: secondsToHours(day.grand_total?.total_seconds || 0),
        };
      });

    // Process recent projects
    const recentProjects = (statsData.data?.projects || [])
      .slice(0, 4)
      .map((project: { name: string; total_seconds: number }) => {
        // Find the primary language for this project (simplified)
        const primaryLang = statsData.data?.languages?.[0]?.name || 'Unknown';
        return {
          name: project.name,
          hours: secondsToHours(project.total_seconds),
          language: primaryLang,
        };
      });

    // Calculate monthly hours from summaries
    const monthlySeconds = (summaryData.data || []).reduce(
      (acc: number, day: { grand_total: { total_seconds: number } }) =>
        acc + (day.grand_total?.total_seconds || 0),
      0
    );

    // Calculate current streak (simplified - counts consecutive days with activity)
    let currentStreak = 0;
    const sortedDays = [...(summaryData.data || [])].reverse();
    for (const day of sortedDays) {
      if (day.grand_total?.total_seconds > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    const wakaTimeStats: WakaTimeStats = {
      totalHours: secondsToHours(allTimeData.data?.total_seconds || 0),
      currentStreak: currentStreak,
      longestStreak: statsData.data?.best_day?.total_seconds
        ? Math.max(currentStreak, 30) // Placeholder - WakaTime API doesn't provide longest streak directly
        : currentStreak,
      dailyAverage: secondsToHours(statsData.data?.daily_average || 0),
      thisWeek: secondsToHours(statsData.data?.total_seconds || 0),
      thisMonth: secondsToHours(monthlySeconds),
      languages,
      weeklyActivity,
      recentProjects,
    };

    return NextResponse.json(wakaTimeStats, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('WakaTime API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch WakaTime data' },
      { status: 500 }
    );
  }
}
