'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Briefcase, Code2, Zap, Clock, Flame } from 'lucide-react';

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 aurora-ring" />
      <div className="absolute inset-0 orbital-lines opacity-70" />

      <motion.div style={{ y, opacity, scale }} className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-3 rounded-full bg-background-secondary/70 border border-(--border-subtle) shadow-[0_10px_60px_rgba(112,225,255,0.2)]"
            >
              <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground-muted">Full-stack Vanguard</span>
              <span className="text-sm text-accent-primary">Norway · BISO</span>
            </motion.div>

            <div className="space-y-5">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight"
              >
                <span className="block text-foreground">Engineering a unified digital nervous system</span>
                <span className="block gradient-text text-glow-primary">for students, teams, and future me.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-lg md:text-xl text-foreground-muted max-w-3xl leading-relaxed"
              >
                IT manager turned product architect. I build the rails that let BISO run—from cloud to Flutter to the systems
                that will outlive my tenure. This is my personal command deck: opinionated, unapologetic, and obsessively crafted.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.45 + index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="holo-card rounded-2xl p-5 border border-(--border-subtle)"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}/15 flex items-center justify-center`}> 
                      <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-accent-secondary" />
                  </div>
                  <div className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-foreground-muted font-mono tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => scrollToSection('projects')}
                className="group relative overflow-hidden px-6 py-3 rounded-full bg-linear-to-r from-accent-primary to-accent-secondary text-background font-semibold shadow-[0_15px_50px_rgba(112,225,255,0.35)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Enter the launchpad
                  <ArrowDown className="w-4 h-4 rotate-90 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
              </button>
              <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-background-tertiary/80 border border-(--border-subtle)">
                <Clock className="w-4 h-4 text-accent-primary" />
                <span className="font-mono text-xs text-foreground-muted">10+ hrs / day of flow</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[28px] bg-linear-to-br from-accent-primary/10 via-background-tertiary to-accent-secondary/10 blur-3xl" />
            <div className="relative holo-card rounded-[24px] p-8 border border-(--border-subtle) backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-mono text-xs text-foreground-muted uppercase tracking-[0.3em]">Mission Log</p>
                  <p className="text-lg font-semibold">Self-taught · Ship fast · Stay resilient</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent-primary/15 border border-accent-primary/40 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent-primary" />
                </div>
              </div>
              <div className="space-y-4">
                {["Designed a unified admin for 40+ BISO repos", "Migrated WordPress to a microservices universe", "Built Flutter + Next apps that feel native everywhere"].map((item, idx) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent-secondary/15 border border-accent-secondary/40 flex items-center justify-center text-xs text-accent-secondary font-semibold">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="divider-glow my-6" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Currently exploring</p>
                  <p className="text-lg font-semibold text-foreground">Platform orchestration · AI copilots</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-background-secondary/70 border border-(--border-subtle)">
                  <Flame className="w-4 h-4 text-accent-secondary" />
                  <span className="font-mono text-xs text-foreground-muted">Always-on curiosity</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col items-center gap-2 mt-14"
        >
          <span className="text-sm font-mono text-foreground-muted">scroll to explore the operating system</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full border border-(--border-accent) flex items-center justify-center shadow-[0_10px_40px_rgba(255,127,237,0.25)]"
          >
            <ArrowDown className="w-5 h-5 text-accent-primary" />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
