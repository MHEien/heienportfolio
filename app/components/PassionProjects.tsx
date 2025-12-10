'use client';

import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Star,
  GitFork,
  Code,
  Filter,
  Search,
  Layers,
  Zap,
  Building2,
  User,
  ChevronDown,
  ExternalLink,
  Activity,
  RefreshCw,
} from 'lucide-react';

type Repository = {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  complexity: 'low' | 'medium' | 'high' | 'enterprise';
  category: 'biso' | 'personal';
  topics: string[];
  lastUpdated: string;
  linesOfCode: number;
  url?: string;
};

type GitHubStats = {
  totalRepos: number;
  bisoCount: number;
  personalCount: number;
  totalLOC: number;
  totalStars: number;
};

// Fallback data when API is unavailable
const fallbackRepositories: Repository[] = [
  { id: 1, name: 'biso-management-app', description: 'Unified enterprise management dashboard', language: 'TypeScript', stars: 0, forks: 0, complexity: 'enterprise', category: 'biso', topics: ['nextjs', 'react', 'tailwind'], lastUpdated: '2024-01-15', linesOfCode: 45000 },
  { id: 2, name: 'biso-mobile', description: 'Cross-platform mobile application', language: 'Dart', stars: 0, forks: 0, complexity: 'enterprise', category: 'biso', topics: ['flutter', 'mobile'], lastUpdated: '2024-01-14', linesOfCode: 38000 },
  { id: 3, name: 'portfolio-v3', description: 'Personal portfolio website', language: 'TypeScript', stars: 45, forks: 12, complexity: 'high', category: 'personal', topics: ['nextjs', 'tailwind'], lastUpdated: '2024-01-15', linesOfCode: 8000 },
];

const fallbackStats: GitHubStats = {
  totalRepos: 70,
  bisoCount: 40,
  personalCount: 30,
  totalLOC: 250000,
  totalStars: 500,
};

function useGitHubData() {
  const [repositories, setRepositories] = useState<Repository[]>(fallbackRepositories);
  const [stats, setStats] = useState<GitHubStats>(fallbackStats);
  const [languageColors, setLanguageColors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/github');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRepositories(data.repositories);
      setStats(data.stats);
      setLanguageColors(data.languageColors || {});
      setIsLive(true);
    } catch (err) {
      console.warn('Using fallback GitHub data:', err);
      setRepositories(fallbackRepositories);
      setStats(fallbackStats);
      setIsLive(false);
      setError('Using cached data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { repositories, stats, languageColors, isLoading, isLive, error, refetch: fetchData };
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  Dart: '#00b4ab',
  Go: '#00add8',
  Python: '#3776ab',
  Rust: '#dea584',
  Shell: '#89e051',
  Dockerfile: '#384d54',
};

const complexityConfig = {
  low: { label: 'Low', color: 'text-foreground-muted', bg: 'bg-foreground-muted/10', border: 'border-foreground-muted/20' },
  medium: { label: 'Medium', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  high: { label: 'High', color: 'text-accent-primary', bg: 'bg-accent-primary/10', border: 'border-accent-primary/20' },
  enterprise: { label: 'Enterprise', color: 'text-accent-secondary', bg: 'bg-accent-secondary/10', border: 'border-accent-secondary/20' },
};

function RepoCard({ repo, index, colors }: { repo: Repository; index: number; colors: Record<string, string> }) {
  const complexity = complexityConfig[repo.complexity];

  const handleClick = () => {
    if (repo.url) {
      window.open(repo.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={handleClick}
      className="group p-5 rounded-xl bg-background-secondary/50 border border-(--border-subtle) hover:border-accent-primary/30 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-accent-primary" />
          <span className="font-mono text-sm text-foreground group-hover:text-accent-primary transition-colors">
            {repo.name}
          </span>
        </div>
        <ExternalLink className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <p className="text-sm text-foreground-muted mb-4 line-clamp-2">{repo.description}</p>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[repo.language] || '#6b7280' }} />
          <span className="text-xs text-foreground-muted">{repo.language}</span>
        </div>
        {repo.stars > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-warning" />
            <span className="text-xs text-foreground-muted">{repo.stars}</span>
          </div>
        )}
        {repo.forks > 0 && (
          <div className="flex items-center gap-1">
            <GitFork className="w-3 h-3 text-foreground-muted" />
            <span className="text-xs text-foreground-muted">{repo.forks}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className={`px-2 py-1 rounded-full text-xs font-mono ${complexity.bg} ${complexity.color} ${complexity.border} border`}>
          {complexity.label}
        </div>
        <div className="flex items-center gap-1 text-xs text-foreground-muted">
          <Code className="w-3 h-3" />
          <span>{(repo.linesOfCode / 1000).toFixed(1)}k LOC</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function PassionProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { repositories, stats, languageColors: apiLanguageColors, isLoading, isLive, refetch } = useGitHubData();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'biso' | 'personal'>('all');
  const [complexityFilter, setComplexityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'enterprise'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'complexity' | 'loc' | 'stars'>('complexity');
  const [showFilters, setShowFilters] = useState(false);

  // Merge API language colors with fallback
  const mergedLanguageColors = { ...languageColors, ...apiLanguageColors };

  const filteredRepos = useMemo(() => {
    let result = [...repositories];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (repo: Repository) =>
          repo.name.toLowerCase().includes(query) ||
          repo.description.toLowerCase().includes(query) ||
          repo.topics.some((t: string) => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((repo: Repository) => repo.category === categoryFilter);
    }

    // Complexity filter
    if (complexityFilter !== 'all') {
      result = result.filter((repo: Repository) => repo.complexity === complexityFilter);
    }

    // Sort
    const complexityOrder: Record<string, number> = { low: 1, medium: 2, high: 3, enterprise: 4 };
    result.sort((a: Repository, b: Repository) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'complexity':
          return complexityOrder[b.complexity] - complexityOrder[a.complexity];
        case 'loc':
          return b.linesOfCode - a.linesOfCode;
        case 'stars':
          return b.stars - a.stars;
        default:
          return 0;
      }
    });

    return result;
  }, [repositories, searchQuery, categoryFilter, complexityFilter, sortBy]);

  return (
    <section id="projects" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-accent-secondary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent-secondary/10 border border-accent-secondary/30 flex items-center justify-center">
              <Layers className="w-6 h-6 text-accent-secondary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Passion Projects</h2>
                {isLive && (
                  <span className="px-2 py-1 rounded-full bg-accent-secondary/10 border border-accent-secondary/30 text-xs font-mono text-accent-secondary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                    LIVE
                  </span>
                )}
                {isLoading && (
                  <RefreshCw className="w-4 h-4 text-accent-secondary animate-spin" />
                )}
              </div>
              {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
              <p className="text-foreground-muted font-mono text-sm">// github_explorer v2.0</p>
            </div>
            <button
              onClick={refetch}
              className="p-2 rounded-lg bg-background-secondary border border-(--border-subtle) hover:border-accent-secondary/30 transition-all text-foreground-muted hover:text-accent-secondary"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-lg text-foreground-muted max-w-2xl">
            A high-tech interface to explore {stats.totalRepos}+ repositories. Filter by volume, complexity, and category to discover
            the depth of work behind the code.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-4 rounded-xl bg-background-secondary/50 border border-(--border-subtle)">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-accent-primary" />
              <span className="text-xs font-mono text-foreground-muted">BISO Repos</span>
            </div>
            <div className="text-2xl font-bold text-accent-primary">{stats.bisoCount}+</div>
          </div>
          <div className="p-4 rounded-xl bg-background-secondary/50 border border-(--border-subtle)">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-accent-secondary" />
              <span className="text-xs font-mono text-foreground-muted">Personal Repos</span>
            </div>
            <div className="text-2xl font-bold text-accent-secondary">{stats.personalCount}+</div>
          </div>
          <div className="p-4 rounded-xl bg-background-secondary/50 border border-(--border-subtle)">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-accent-primary" />
              <span className="text-xs font-mono text-foreground-muted">Total LOC</span>
            </div>
            <div className="text-2xl font-bold gradient-text">{(stats.totalLOC / 1000).toFixed(0)}k+</div>
          </div>
          <div className="p-4 rounded-xl bg-background-secondary/50 border border-(--border-subtle)">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-warning" />
              <span className="text-xs font-mono text-foreground-muted">Total Stars</span>
            </div>
            <div className="text-2xl font-bold text-warning">{stats.totalStars}</div>
          </div>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-background-secondary border border-(--border-subtle) focus:border-accent-primary/50 focus:outline-none font-mono text-sm text-foreground placeholder:text-foreground-muted transition-colors"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all font-mono text-sm ${
                showFilters
                  ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary'
                  : 'bg-background-secondary border-(--border-subtle) text-foreground-muted hover:text-foreground'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category filter */}
                  <div>
                    <label className="block text-xs font-mono text-foreground-muted mb-2">Category</label>
                    <div className="flex gap-2">
                      {(['all', 'biso', 'personal'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`flex-1 px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                            categoryFilter === cat
                              ? 'bg-accent-primary/20 border border-accent-primary/30 text-accent-primary'
                              : 'bg-background-tertiary border border-(--border-subtle) text-foreground-muted hover:text-foreground'
                          }`}
                        >
                          {cat === 'all' ? 'All' : cat === 'biso' ? 'BISO' : 'Personal'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Complexity filter */}
                  <div>
                    <label className="block text-xs font-mono text-foreground-muted mb-2">Complexity</label>
                    <div className="flex gap-2 flex-wrap">
                      {(['all', 'enterprise', 'high', 'medium', 'low'] as const).map((comp) => (
                        <button
                          key={comp}
                          onClick={() => setComplexityFilter(comp)}
                          className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                            complexityFilter === comp
                              ? 'bg-accent-secondary/20 border border-accent-secondary/30 text-accent-secondary'
                              : 'bg-background-tertiary border border-(--border-subtle) text-foreground-muted hover:text-foreground'
                          }`}
                        >
                          {comp === 'all' ? 'All' : comp.charAt(0).toUpperCase() + comp.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-xs font-mono text-foreground-muted mb-2">Sort By</label>
                    <div className="flex gap-2 flex-wrap">
                      {([
                        { key: 'complexity', label: 'Complexity' },
                        { key: 'loc', label: 'LOC' },
                        { key: 'stars', label: 'Stars' },
                        { key: 'name', label: 'Name' },
                      ] as const).map((sort) => (
                        <button
                          key={sort.key}
                          onClick={() => setSortBy(sort.key)}
                          className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                            sortBy === sort.key
                              ? 'bg-accent-primary/20 border border-accent-primary/30 text-accent-primary'
                              : 'bg-background-tertiary border border-(--border-subtle) text-foreground-muted hover:text-foreground'
                          }`}
                        >
                          {sort.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-2 mb-6"
        >
          <Activity className="w-4 h-4 text-accent-primary" />
          <span className="font-mono text-sm text-foreground-muted">
            Showing <span className="text-accent-primary">{filteredRepos.length}</span> of{' '}
            <span className="text-foreground">{repositories.length}</span> repositories
          </span>
        </motion.div>

        {/* Repository grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredRepos.map((repo, index) => (
              <RepoCard key={repo.id} repo={repo} index={index} colors={mergedLanguageColors} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredRepos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Zap className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <p className="text-foreground-muted font-mono">No repositories match your filters</p>
          </motion.div>
        )}

        {/* GitHub link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/heien"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-background-secondary border border-(--border-subtle) hover:border-accent-primary/30 transition-all font-mono text-sm text-foreground-muted hover:text-accent-primary group"
          >
            <GitBranch className="w-5 h-5" />
            <span>View Full GitHub Profile</span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
