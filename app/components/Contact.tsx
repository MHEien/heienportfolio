'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Github, Linkedin, Send, MapPin, Clock, Coffee } from 'lucide-react';

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/MHEien', color: 'hover:text-foreground' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/markusheien', color: 'hover:text-[#0077b5]' },
  { name: 'Email', icon: Mail, href: 'mailto:markus@hdsoftware.no', color: 'hover:text-accent-primary' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-primary/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-secondary border border-(--border-subtle) font-mono text-sm mb-8">
            <span className="text-accent-secondary">@</span>
            <span className="text-foreground-muted">contact</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Let&apos;s </span>
            <span className="gradient-text">Build</span>
            <span className="text-foreground"> Together</span>
          </h2>

          <p className="text-lg text-foreground-muted max-w-xl mx-auto mb-12">
            Open to enterprise projects, consulting, and collaboration. Currently architecting infrastructure at BISO
            while exploring new challenges.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="p-6 rounded-2xl bg-background-secondary/50 border border-(--border-subtle)">
            <MapPin className="w-6 h-6 text-accent-primary mx-auto mb-3" />
            <div className="font-mono text-sm text-foreground">Remote-First</div>
            <div className="text-xs text-foreground-muted">Worldwide</div>
          </div>
          <div className="p-6 rounded-2xl bg-background-secondary/50 border border-(--border-subtle)">
            <Clock className="w-6 h-6 text-accent-secondary mx-auto mb-3" />
            <div className="font-mono text-sm text-foreground">Response Time</div>
            <div className="text-xs text-foreground-muted">&lt; 24 hours</div>
          </div>
          <div className="p-6 rounded-2xl bg-background-secondary/50 border border-(--border-subtle)">
            <Coffee className="w-6 h-6 text-accent-primary mx-auto mb-3" />
            <div className="font-mono text-sm text-foreground">Availability</div>
            <div className="text-xs text-accent-secondary">Open to projects</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-4 mb-12"
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-14 h-14 rounded-xl bg-background-secondary border border-(--border-subtle) flex items-center justify-center text-foreground-muted transition-all ${link.color}`}
            >
              <link.icon className="w-6 h-6" />
            </motion.a>
          ))}
        </motion.div>

        <motion.a
          href="mailto:markus@hdsoftware.no"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-linear-to-r from-accent-primary to-accent-secondary text-background font-mono font-bold transition-all hover:shadow-lg hover:shadow-accent-primary/20"
        >
          <Send className="w-5 h-5" />
          <span>markus@hdsoftware.no</span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-24 pt-8 border-t border-(--border-subtle)"
        >
          <p className="font-mono text-sm text-foreground-muted">
            <span className="text-accent-primary">$</span> echo &quot;Built with Next.js, Tailwind CSS, and Framer Motion&quot;
          </p>
          <p className="font-mono text-xs text-foreground-muted/50 mt-2">
            © {new Date().getFullYear()} heien.dev — All rights reserved
          </p>
        </motion.div>
      </div>
    </section>
  );
}
