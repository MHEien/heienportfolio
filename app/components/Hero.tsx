'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Briefcase, Code2, Zap, Clock } from 'lucide-react';

const stats = [
  { icon: Clock, value: '10+', label: 'Hours/Day Coding', color: 'accent-primary' },
  { icon: Code2, value: '70+', label: 'Repositories', color: 'accent-secondary' },
  { icon: Briefcase, value: 'BISO', label: 'Enterprise Client', color: 'accent-primary' },
  { icon: Zap, value: '2024', label: 'Full-Stack Journey', color: 'accent-secondary' },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-accent-primary/5 blur-[120px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-accent-secondary/5 blur-[120px]"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <motion.div style={{ y, opacity, scale }} className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        {/* Terminal-style header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-secondary border border-(--border-subtle) font-mono text-sm">
            <span className="text-foreground-muted">$</span>
            <span className="text-foreground-muted">whoami</span>
            <span className="text-accent-primary">→</span>
            <span className="text-accent-secondary">architect_of_infrastructure</span>
            <span className="w-2 h-4 bg-accent-primary cursor-blink" />
          </div>
        </motion.div>

        {/* Main heading with staggered animation */}
        <div className="space-y-4 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          >
            <span className="text-foreground">From </span>
            <span className="gradient-text text-glow-primary">Business</span>
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          >
            <span className="text-foreground">To </span>
            <span className="gradient-text text-glow-secondary">Full-Stack</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-foreground-muted max-w-2xl mb-16 leading-relaxed"
        >
          Self-taught developer who traded spreadsheets for source code.
          <br />
          <span className="text-accent-primary">Building infrastructure</span> that scales,{' '}
          <span className="text-accent-secondary">one commit at a time</span>.
        </motion.p>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative p-6 rounded-2xl bg-background-secondary/50 border border-(--border-subtle) hover:border-(--border-accent) transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <div className={`text-3xl font-bold text-${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-foreground-muted font-mono">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm font-mono text-foreground-muted">scroll_to_explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 rounded-full border border-(--border-accent) flex items-center justify-center"
          >
            <ArrowDown className="w-5 h-5 text-accent-primary" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
