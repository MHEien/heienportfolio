'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Menu, X } from 'lucide-react';

const navItems = [
  { id: 'hero', label: 'init', icon: '~' },
  { id: 'stats', label: 'stats', icon: '$' },
  { id: 'biso', label: 'case_study', icon: '>' },
  { id: 'projects', label: 'projects', icon: '#' },
  { id: 'contact', label: 'contact', icon: '@' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(navItems[index].id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background-secondary/70 backdrop-blur-2xl border-b border-(--border-subtle) shadow-[0_10px_80px_rgba(0,0,0,0.35)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => scrollToSection('hero')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-11 h-11 rounded-xl bg-background-tertiary/80 border border-(--border-accent) overflow-hidden">
                <div className="absolute inset-0 aurora-ring opacity-60" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-accent-primary" />
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground-muted">Portfolio OS</span>
                <span className="block font-mono text-sm text-foreground">
                  heien<span className="text-accent-secondary">.control</span>
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 rounded-full bg-background/30 p-1 border border-(--border-subtle) shadow-[0_10px_80px_rgba(0,0,0,0.35)]">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 font-mono text-sm transition-all duration-300 rounded-full ${
                    activeSection === item.id
                      ? 'text-background'
                      : 'text-foreground-muted hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-foreground-muted/50">{item.icon}</span>
                  <span className="ml-1">{item.label}</span>
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-full -z-10 bg-linear-to-r from-accent-primary to-accent-secondary shadow-[0_8px_30px_rgba(112,225,255,0.35)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Status Indicator */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-tertiary/70 border border-(--border-subtle) shadow-[0_10px_50px_rgba(112,225,255,0.25)]">
                <div className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                <span className="font-mono text-xs text-accent-secondary">live system online</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground-muted hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-3 px-4 py-4 font-mono text-lg rounded-lg transition-all ${
                    activeSection === item.id
                      ? 'bg-accent-primary/10 border border-accent-primary/30 text-accent-primary'
                      : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
                  }`}
                >
                  <span className="text-foreground-muted/50">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
