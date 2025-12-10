import Navigation from './components/Navigation';
import Hero from './components/Hero';
import CodingStats from './components/CodingStats';
import BISOTransformation from './components/BISOTransformation';
import PassionProjects from './components/PassionProjects';
import Contact from './components/Contact';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main sections */}
      <Hero />
      <CodingStats />
      <BISOTransformation />
      <PassionProjects />
      <Contact />
    </main>
  );
}
