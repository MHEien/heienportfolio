'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Server,
  Database,
  Globe,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Layers,
  Cloud,
  GitBranch,
  Zap,
  Shield,
  TrendingUp,
} from 'lucide-react';

const beforeArchitecture = {
  title: 'WordPress Monolith',
  subtitle: 'Legacy Infrastructure',
  problems: [
    'Single point of failure',
    'Poor scalability',
    'Slow page loads (3-5s)',
    'Manual deployments',
    'No mobile app',
    'Limited customization',
  ],
  components: [
    { name: 'WordPress', icon: Globe, type: 'monolith' },
    { name: 'MySQL', icon: Database, type: 'database' },
    { name: 'Shared Hosting', icon: Server, type: 'server' },
  ],
};

const afterArchitecture = {
  title: 'Microservices Architecture',
  subtitle: 'Modern Infrastructure',
  benefits: [
    'High availability (99.9%)',
    'Auto-scaling',
    'Sub-second loads (<500ms)',
    'CI/CD pipelines',
    'Native mobile apps',
    'Full customization',
  ],
  components: [
    { name: 'Next.js Frontend', icon: Globe, type: 'frontend', color: 'accent-primary' },
    { name: 'Flutter Mobile', icon: Smartphone, type: 'mobile', color: 'accent-secondary' },
    { name: 'API Gateway', icon: Layers, type: 'gateway', color: 'accent-primary' },
    { name: 'Microservices', icon: GitBranch, type: 'services', color: 'accent-secondary' },
    { name: 'PostgreSQL', icon: Database, type: 'database', color: 'accent-primary' },
    { name: 'Cloud Infrastructure', icon: Cloud, type: 'cloud', color: 'accent-secondary' },
  ],
};

const metrics = [
  { label: 'Page Load Time', before: '3.5s', after: '0.4s', improvement: '88%', icon: Zap },
  { label: 'Uptime', before: '95%', after: '99.9%', improvement: '+5%', icon: Shield },
  { label: 'Deploy Time', before: '2h', after: '5min', improvement: '96%', icon: TrendingUp },
  { label: 'Mobile Users', before: '0', after: '2.5K+', improvement: '∞', icon: Smartphone },
];

function ArchitectureNode({
  component,
  index,
  isAfter = false,
}: {
  component: (typeof beforeArchitecture.components)[0] | (typeof afterArchitecture.components)[0];
  index: number;
  isAfter?: boolean;
}) {
  const Icon = component.icon;
  const color = 'color' in component ? component.color : 'foreground-muted';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
        isAfter
          ? 'bg-background-tertiary/80 border-accent-primary/20 hover:border-accent-primary/50'
          : 'bg-background-tertiary/50 border-(--border-subtle) hover:border-foreground-muted/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isAfter ? `bg-${color}/10` : 'bg-foreground-muted/10'
          }`}
        >
          <Icon className={`w-5 h-5 ${isAfter ? `text-${color}` : 'text-foreground-muted'}`} />
        </div>
        <span className={`font-mono text-sm ${isAfter ? 'text-foreground' : 'text-foreground-muted'}`}>
          {component.name}
        </span>
      </div>
      {isAfter && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-secondary"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

export default function BISOTransformation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeView, setActiveView] = useState<'before' | 'after'>('after');

  return (
    <section id="biso" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent-secondary/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-secondary border border-(--border-subtle) font-mono text-sm mb-6">
            <span className="text-accent-primary">case_study</span>
            <span className="text-foreground-muted">::</span>
            <span className="text-accent-secondary">enterprise_migration</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-foreground">The </span>
            <span className="gradient-text">BISO</span>
            <span className="text-foreground"> Transformation</span>
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Migrating a legacy WordPress monolith to a modern microservices architecture, culminating in a unified
            Single Management App.
          </p>
        </motion.div>

        {/* Toggle buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex p-1 rounded-xl bg-background-secondary border border-(--border-subtle)">
            <button
              onClick={() => setActiveView('before')}
              className={`px-6 py-3 rounded-lg font-mono text-sm transition-all ${
                activeView === 'before'
                  ? 'bg-error/20 text-error border border-error/30'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <XCircle className="w-4 h-4 inline mr-2" />
              Before
            </button>
            <button
              onClick={() => setActiveView('after')}
              className={`px-6 py-3 rounded-lg font-mono text-sm transition-all ${
                activeView === 'after'
                  ? 'bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 inline mr-2" />
              After
            </button>
          </div>
        </motion.div>

        {/* Architecture comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Before/After Architecture */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: activeView === 'before' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeView === 'before' ? 20 : -20 }}
              transition={{ duration: 0.4 }}
              className={`p-8 rounded-2xl border ${
                activeView === 'before'
                  ? 'bg-error/5 border-error/20'
                  : 'bg-accent-secondary/5 border-accent-secondary/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                {activeView === 'before' ? (
                  <XCircle className="w-6 h-6 text-error" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-accent-secondary" />
                )}
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {activeView === 'before' ? beforeArchitecture.title : afterArchitecture.title}
                  </h3>
                  <p className="text-sm text-foreground-muted font-mono">
                    {activeView === 'before' ? beforeArchitecture.subtitle : afterArchitecture.subtitle}
                  </p>
                </div>
              </div>

              {/* Architecture nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {(activeView === 'before' ? beforeArchitecture.components : afterArchitecture.components).map(
                  (component, index) => (
                    <ArchitectureNode
                      key={component.name}
                      component={component}
                      index={index}
                      isAfter={activeView === 'after'}
                    />
                  )
                )}
              </div>

              {/* Problems/Benefits list */}
              <div className="space-y-2">
                {(activeView === 'before' ? beforeArchitecture.problems : afterArchitecture.benefits).map(
                  (item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2"
                    >
                      {activeView === 'before' ? (
                        <XCircle className="w-4 h-4 text-error shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-accent-secondary shrink-0" />
                      )}
                      <span className="text-sm text-foreground-muted">{item}</span>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Visual Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-2xl bg-background-secondary/50 border border-(--border-subtle) relative overflow-hidden"
          >
            <div className="absolute inset-0 grid-bg opacity-50" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-foreground mb-6 font-mono">
                {activeView === 'before' ? '// legacy_architecture' : '// modern_architecture'}
              </h3>

              {activeView === 'before' ? (
                /* Before Diagram */
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-32 h-32 rounded-2xl bg-error/10 border-2 border-error/30 flex flex-col items-center justify-center"
                  >
                    <Globe className="w-8 h-8 text-error mb-2" />
                    <span className="font-mono text-xs text-error">WordPress</span>
                    <span className="font-mono text-[10px] text-foreground-muted">Monolith</span>
                  </motion.div>
                  <div className="w-px h-8 bg-error/30" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-24 h-24 rounded-xl bg-error/10 border border-error/20 flex flex-col items-center justify-center"
                  >
                    <Database className="w-6 h-6 text-error mb-1" />
                    <span className="font-mono text-xs text-error">MySQL</span>
                  </motion.div>
                  <div className="w-px h-8 bg-error/30" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-20 h-20 rounded-lg bg-error/10 border border-error/20 flex flex-col items-center justify-center"
                  >
                    <Server className="w-5 h-5 text-error mb-1" />
                    <span className="font-mono text-[10px] text-error">Shared</span>
                  </motion.div>
                </div>
              ) : (
                /* After Diagram */
                <div className="space-y-6">
                  {/* Frontend Layer */}
                  <div className="flex justify-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-4 py-3 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-center gap-2"
                    >
                      <Globe className="w-5 h-5 text-accent-primary" />
                      <span className="font-mono text-xs text-accent-primary">Next.js</span>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="px-4 py-3 rounded-xl bg-accent-secondary/10 border border-accent-secondary/30 flex items-center gap-2"
                    >
                      <Smartphone className="w-5 h-5 text-accent-secondary" />
                      <span className="font-mono text-xs text-accent-secondary">Flutter</span>
                    </motion.div>
                  </div>

                  {/* Connection lines */}
                  <div className="flex justify-center">
                    <div className="w-32 h-px bg-linear-to-r from-accent-primary/50 to-accent-secondary/50" />
                  </div>

                  {/* API Gateway */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center"
                  >
                    <div className="px-6 py-3 rounded-xl bg-linear-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/30 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-accent-primary" />
                      <span className="font-mono text-xs text-foreground">API Gateway</span>
                    </div>
                  </motion.div>

                  {/* Microservices */}
                  <div className="flex justify-center gap-2">
                    {['Auth', 'Data', 'Files', 'Analytics'].map((service, i) => (
                      <motion.div
                        key={service}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="px-3 py-2 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20"
                      >
                        <span className="font-mono text-[10px] text-accent-secondary">{service}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Database Layer */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-center"
                  >
                    <div className="px-6 py-3 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-center gap-2">
                      <Database className="w-5 h-5 text-accent-primary" />
                      <span className="font-mono text-xs text-accent-primary">PostgreSQL + Redis</span>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Metrics comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-2xl bg-background-secondary/50 border border-(--border-subtle) hover:border-accent-primary/30 transition-all group"
            >
              <metric.icon className="w-6 h-6 text-accent-primary mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-mono text-foreground-muted mb-3">{metric.label}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-error line-through">{metric.before}</span>
                <ArrowRight className="w-4 h-4 text-foreground-muted" />
                <span className="text-lg font-bold text-accent-secondary">{metric.after}</span>
              </div>
              <div className="inline-flex px-2 py-1 rounded-full bg-accent-secondary/10 text-xs font-mono text-accent-secondary">
                {metric.improvement} faster
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Single Management App highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 p-8 rounded-2xl bg-linear-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 text-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            <span className="gradient-text">Single Management App</span>
          </h3>
          <p className="text-foreground-muted max-w-2xl mx-auto mb-6">
            The culmination of this transformation: a unified dashboard that controls all BISO operations—from content
            management to analytics, user administration to deployment pipelines.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Web Dashboard', 'Mobile App', 'API Console', 'Analytics', 'User Management'].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 rounded-full bg-background-secondary border border-(--border-subtle) font-mono text-sm text-foreground-muted"
              >
                {feature}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
