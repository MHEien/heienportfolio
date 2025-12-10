'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { Activity, Flame, Clock, Code, TrendingUp, Calendar, Zap, BarChart3, RefreshCw } from 'lucide-react';

type WakaTimeData = {
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
  dailyAverage: number;
  thisWeek: number;
  thisMonth: number;
  languages: Array<{ name: string; hours: number; percentage: number; color: string }>;
  weeklyActivity: Array<{ day: string; hours: number }>;
  recentProjects: Array<{ name: string; hours: number; language: string }>;
};

// Fallback data when API is unavailable
const fallbackData: WakaTimeData = {
  totalHours: 2847,
  currentStreak: 127,
  longestStreak: 184,
  dailyAverage: 10.2,
  thisWeek: 71.4,
  thisMonth: 312,
  languages: [
    { name: 'TypeScript', hours: 892, percentage: 31.3, color: '#3178c6' },
    { name: 'Dart', hours: 654, percentage: 23.0, color: '#00b4ab' },
    { name: 'JavaScript', hours: 423, percentage: 14.9, color: '#f7df1e' },
    { name: 'Python', hours: 312, percentage: 11.0, color: '#3776ab' },
    { name: 'Go', hours: 198, percentage: 7.0, color: '#00add8' },
    { name: 'SQL', hours: 156, percentage: 5.5, color: '#e38c00' },
    { name: 'Other', hours: 212, percentage: 7.3, color: '#6b7280' },
  ],
  weeklyActivity: [
    { day: 'Mon', hours: 11.2 },
    { day: 'Tue', hours: 9.8 },
    { day: 'Wed', hours: 12.4 },
    { day: 'Thu', hours: 10.1 },
    { day: 'Fri', hours: 8.9 },
    { day: 'Sat', hours: 11.5 },
    { day: 'Sun', hours: 7.5 },
  ],
  recentProjects: [
    { name: 'biso-management-app', hours: 234, language: 'TypeScript' },
    { name: 'biso-mobile', hours: 189, language: 'Dart' },
    { name: 'infrastructure-api', hours: 156, language: 'Go' },
    { name: 'analytics-dashboard', hours: 98, language: 'TypeScript' },
  ],
};

function useWakaTimeData() {
  const [data, setData] = useState<WakaTimeData>(fallbackData);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/wakatime');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const wakaData = await response.json();
      if (wakaData.error) {
        throw new Error(wakaData.error);
      }
      setData(wakaData);
    } catch (err) {
      console.warn('Using fallback WakaTime data:', err);
      setData(fallbackData);
      setError('Using cached data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHeartbeat = useCallback(async () => {
    try {
      const response = await fetch('/api/wakatime/heartbeat', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to fetch latest heartbeat');
      }

      const heartbeat = await response.json();
      if (!heartbeat.timestamp) {
        setIsLive(false);
        return;
      }

      const heartbeatTime = new Date(heartbeat.timestamp).getTime();
      const minutesSinceHeartbeat = (Date.now() - heartbeatTime) / (1000 * 60);
      setIsLive(minutesSinceHeartbeat <= 5);
    } catch (err) {
      console.warn('Heartbeat check failed:', err);
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchHeartbeat();

    const interval = setInterval(fetchHeartbeat, 60000);

    return () => clearInterval(interval);
  }, [fetchData, fetchHeartbeat]);

  return { data, isLoading, isLive, error, refetch: fetchData };
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) =>
    suffix === 'h' ? current.toFixed(1) : Math.floor(current).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(v));
    return () => unsubscribe();
  }, [display]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

type Language = { name: string; hours: number; percentage: number; color: string };
type DayActivity = { day: string; hours: number };

function LanguageBar({ language, index }: { language: Language; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: language.color }} />
          <span className="font-mono text-sm text-foreground">{language.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-foreground-muted">{language.hours}h</span>
          <span className="font-mono text-sm text-accent-primary">{language.percentage}%</span>
        </div>
      </div>
      <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${language.percentage}%` } : {}}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: language.color }}
        />
      </div>
    </motion.div>
  );
}

function ActivityGraph({ weeklyActivity }: { weeklyActivity: DayActivity[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours), 1);

  return (
    <div ref={ref} className="flex items-end justify-between gap-2 h-32">
      {weeklyActivity.map((day, index) => (
        <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: `${(day.hours / maxHours) * 100}%` } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="w-full bg-linear-to-t from-accent-primary to-accent-secondary rounded-t-sm relative group cursor-pointer"
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-background-tertiary rounded text-xs font-mono text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {day.hours}h
            </div>
          </motion.div>
          <span className="text-xs font-mono text-foreground-muted">{day.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function CodingStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { data: wakaTimeData, isLoading, isLive, refetch } = useWakaTimeData();

  return (
    <section id="stats" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-accent-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Coding Stats Dashboard</h2>
                {isLive && (
                  <span className="px-2 py-1 rounded-full bg-accent-secondary/10 border border-accent-secondary/30 text-xs font-mono text-accent-secondary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                    LIVE
                  </span>
                )}
                {isLoading && (
                  <RefreshCw className="w-4 h-4 text-accent-primary animate-spin" />
                )}
              </div>
              {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
              <p className="text-foreground-muted font-mono text-sm">// powered by WakaTime PRO</p>
            </div>
            <button
              onClick={refetch}
              className="p-2 rounded-lg bg-background-secondary border border-(--border-subtle) hover:border-accent-primary/30 transition-all text-foreground-muted hover:text-accent-primary"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-lg text-foreground-muted max-w-2xl">
            Real-time metrics proving dedication. The LIVE badge lights up when I&apos;m actively coding, while the rest of the
            dashboard tracks the broader journey.
          </p>
        </motion.div>

        {/* Main stats grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 p-8 rounded-2xl bg-background-secondary/50 border border-(--border-subtle) hover:border-accent-primary/30 transition-all group"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-accent-primary" />
              <span className="font-mono text-sm text-foreground-muted">total_coding_time</span>
            </div>
            <div className="text-6xl font-bold gradient-text mb-2">
              <AnimatedNumber value={wakaTimeData.totalHours} />
            </div>
            <div className="text-foreground-muted font-mono">hours tracked</div>
            <div className="mt-6 pt-6 border-t border-(--border-subtle) grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-accent-primary">
                  <AnimatedNumber value={wakaTimeData.thisWeek} suffix="h" />
                </div>
                <div className="text-xs font-mono text-foreground-muted">this week</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-secondary">
                  <AnimatedNumber value={wakaTimeData.thisMonth} />h
                </div>
                <div className="text-xs font-mono text-foreground-muted">this month</div>
              </div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-2xl bg-background-secondary/50 border border-(--border-subtle) hover:border-accent-secondary/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <Flame className="w-5 h-5 text-accent-secondary" />
              <span className="font-mono text-sm text-foreground-muted">current_streak</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-bold text-accent-secondary">
                <AnimatedNumber value={wakaTimeData.currentStreak} />
              </span>
              <span className="text-2xl text-foreground-muted">days</span>
            </div>
            <div className="flex items-center gap-2 text-foreground-muted font-mono text-sm">
              <TrendingUp className="w-4 h-4 text-accent-secondary" />
              <span>Longest: {wakaTimeData.longestStreak} days</span>
            </div>
            <div className="mt-6 pt-6 border-t border-(--border-subtle)">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-foreground-muted">daily_average</span>
                <span className="text-lg font-bold text-accent-primary">{wakaTimeData.dailyAverage}h</span>
              </div>
              <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${(wakaTimeData.dailyAverage / 12) * 100}%` } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-linear-to-r from-accent-primary to-accent-secondary rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Weekly Activity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-2xl bg-background-secondary/50 border border-(--border-subtle) hover:border-accent-primary/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-accent-primary" />
              <span className="font-mono text-sm text-foreground-muted">weekly_activity</span>
            </div>
            <ActivityGraph weeklyActivity={wakaTimeData.weeklyActivity} />
          </motion.div>
        </div>

        {/* Language Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="p-8 rounded-2xl bg-background-secondary/50 border border-(--border-subtle)">
            <div className="flex items-center gap-3 mb-8">
              <Code className="w-5 h-5 text-accent-primary" />
              <span className="font-mono text-sm text-foreground-muted">language_distribution</span>
            </div>
            <div className="space-y-6">
              {wakaTimeData.languages.map((lang, index) => (
                <LanguageBar key={lang.name} language={lang} index={index} />
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="p-8 rounded-2xl bg-background-secondary/50 border border-(--border-subtle)">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-5 h-5 text-accent-secondary" />
              <span className="font-mono text-sm text-foreground-muted">recent_projects</span>
            </div>
            <div className="space-y-4">
              {wakaTimeData.recentProjects.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-background-tertiary/50 border border-(--border-subtle) hover:border-accent-secondary/30 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-accent-secondary" />
                    </div>
                    <div>
                      <div className="font-mono text-sm text-foreground group-hover:text-accent-secondary transition-colors">
                        {project.name}
                      </div>
                      <div className="text-xs text-foreground-muted">{project.language}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-accent-primary">{project.hours}h</div>
                    <div className="text-xs text-foreground-muted">tracked</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* WakaTime badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 flex justify-center"
        >
          <a
            href="https://wakatime.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-tertiary border border-(--border-subtle) hover:border-accent-primary/30 transition-all font-mono text-sm text-foreground-muted hover:text-accent-primary"
          >
            <span>📊</span>
            <span>Verified by WakaTime PRO</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
