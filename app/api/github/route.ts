import { NextResponse } from 'next/server';

const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_DURATION = 300; // 5 minutes

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  html_url: string;
  private: boolean;
  fork: boolean;
  size: number;
  owner: {
    login: string;
    type: string; // 'User' or 'Organization'
  };
};

type ProcessedRepo = {
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
  url: string;
};

// Language colors mapping
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Dart: '#00b4ab',
  Python: '#3776ab',
  Go: '#00add8',
  Rust: '#dea584',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  HTML: '#e34c26',
  CSS: '#1572b6',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4f5d95',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
};

function estimateLinesOfCode(sizeKB: number, language: string | null): number {
  // Rough estimation: 1KB ≈ 25-50 lines depending on language
  const multipliers: Record<string, number> = {
    TypeScript: 35,
    JavaScript: 40,
    Python: 45,
    Go: 30,
    Dart: 35,
    HTML: 25,
    CSS: 30,
    default: 35,
  };
  const multiplier = language ? (multipliers[language] || multipliers.default) : multipliers.default;
  return Math.round(sizeKB * multiplier);
}

function determineComplexity(repo: GitHubRepo): 'low' | 'medium' | 'high' | 'enterprise' {
  const loc = estimateLinesOfCode(repo.size, repo.language);
  const hasMultipleTopics = repo.topics.length >= 3;
  
  // Enterprise: Large codebase with significant activity
  if (loc > 30000 || (loc > 15000 && hasMultipleTopics)) {
    return 'enterprise';
  }
  // High: Medium-large codebase or well-documented
  if (loc > 8000 || (loc > 4000 && hasMultipleTopics)) {
    return 'high';
  }
  // Medium: Small-medium codebase
  if (loc > 2000) {
    return 'medium';
  }
  // Low: Small projects
  return 'low';
}

function categorizeRepo(repo: GitHubRepo, orgs: string[]): 'biso' | 'personal' {
  // If repo belongs to an organization in our list, it's BISO
  if (repo.owner?.type === 'Organization' && orgs?.some(org => 
    org.toLowerCase() === repo.owner.login.toLowerCase()
  )) {
    return 'biso';
  }
  
  const name = (repo.name || '').toLowerCase();
  const description = (repo.description || '').toLowerCase();
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  
  // Check for BISO-related keywords
  const bisoKeywords = ['biso', 'enterprise', 'management', 'crm', 'erp', 'inventory', 'analytics'];
  
  if (bisoKeywords.some(keyword => 
    name.includes(keyword) || 
    description.includes(keyword) || 
    topics.includes(keyword)
  )) {
    return 'biso';
  }
  
  return 'personal';
}

async function fetchUserRepos(token: string, username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;
  
  while (true) {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated&type=owner`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: CACHE_DURATION },
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const pageRepos: GitHubRepo[] = await response.json();
    repos.push(...pageRepos);
    
    if (pageRepos.length < perPage) {
      break;
    }
    page++;
  }
  
  return repos;
}

async function fetchOrgRepos(token: string, org: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;
  
  while (true) {
    const response = await fetch(
      `${GITHUB_API_BASE}/orgs/${org}/repos?per_page=${perPage}&page=${page}&sort=updated&type=all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: CACHE_DURATION },
      }
    );
    
    // If org doesn't exist or no access, return empty array
    if (!response.ok) {
      console.warn(`Could not fetch repos for org ${org}: ${response.status}`);
      return [];
    }
    
    const pageRepos: GitHubRepo[] = await response.json();
    repos.push(...pageRepos);
    
    if (pageRepos.length < perPage) {
      break;
    }
    page++;
  }
  
  return repos;
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || 'heien';
  // Add your organization names here (comma-separated in env, or default)
  const orgsEnv = process.env.GITHUB_ORGS || 'biso-no';
  const orgs = orgsEnv.split(',').map(o => o.trim()).filter(Boolean);

  if (!token) {
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    );
  }

  try {
    // Fetch repositories from user and all organizations in parallel
    const [userRepos, ...orgReposArrays] = await Promise.all([
      fetchUserRepos(token, username),
      ...orgs.map(org => fetchOrgRepos(token, org)),
    ]);
    
    // Combine all repos
    const allRepos = [...userRepos, ...orgReposArrays.flat()];
    
    // Remove duplicates by repo id
    const uniqueRepos = allRepos.filter(
      (repo, index, self) => index === self.findIndex(r => r.id === repo.id)
    );
    
    // Filter out forks and process repos
    const processedRepos: ProcessedRepo[] = uniqueRepos
      .filter((repo: GitHubRepo) => !repo.fork)
      .map((repo: GitHubRepo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || 'No description available',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        complexity: determineComplexity(repo),
        category: categorizeRepo(repo, orgs),
        topics: repo.topics,
        lastUpdated: repo.updated_at,
        linesOfCode: estimateLinesOfCode(repo.size, repo.language),
        url: repo.html_url,
      }))
      .sort((a: ProcessedRepo, b: ProcessedRepo) => {
        // Sort by complexity (enterprise first), then by LOC
        const complexityOrder: Record<string, number> = { enterprise: 4, high: 3, medium: 2, low: 1 };
        const complexityDiff = complexityOrder[b.complexity] - complexityOrder[a.complexity];
        if (complexityDiff !== 0) return complexityDiff;
        return b.linesOfCode - a.linesOfCode;
      });

    // Calculate stats
    const stats = {
      totalRepos: processedRepos.length,
      bisoCount: processedRepos.filter(r => r.category === 'biso').length,
      personalCount: processedRepos.filter(r => r.category === 'personal').length,
      totalLOC: processedRepos.reduce((sum, r) => sum + r.linesOfCode, 0),
      totalStars: processedRepos.reduce((sum, r) => sum + r.stars, 0),
      languages: Object.entries(
        processedRepos.reduce((acc, repo) => {
          if (repo.language !== 'Unknown') {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>)
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({
          name,
          count,
          color: languageColors[name] || '#6b7280',
        })),
    };

    return NextResponse.json(
      { repositories: processedRepos, stats, languageColors },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
        },
      }
    );
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
