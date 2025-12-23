import React from 'react';
import MarketingLayout from './MarketingLayout';
import Hero from './Hero';
import { MessageSquare, Database, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <MarketingLayout>
      <Hero />

      {/* Single Feature Section */}
      <section className="marketing-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '2rem' }}>
            Built For Champions
          </h2>
          <p style={{ fontSize: '1.3rem', color: '#a0a0a0', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
            Every great athlete has their own story. Their own strengths. Their own path to excellence.
            Now you can build personalized training programs, skill development modules, and progress tracking
            that evolves with every player's unique journey.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <MessageSquare size={48} style={{ margin: '0 auto 1.5rem', color: '#22c55e' }} />
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', marginBottom: '1rem' }}>
              Know Your Player
            </h3>
            <p style={{ color: '#a0a0a0', lineHeight: '1.7' }}>
              Every position. Every skill level. Every age group. Build programs that speak to who they are and where they're headed.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Database size={48} style={{ margin: '0 auto 1.5rem', color: '#22c55e' }} />
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', marginBottom: '1rem' }}>
              Train With Purpose
            </h3>
            <p style={{ color: '#a0a0a0', lineHeight: '1.7' }}>
              From fundamentals to elite performance. Structured plans that adapt to their progress, push their limits, and celebrate their wins.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <BarChart3 size={48} style={{ margin: '0 auto 1.5rem', color: '#22c55e' }} />
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', marginBottom: '1rem' }}>
              Watch Them Rise
            </h3>
            <p style={{ color: '#a0a0a0', lineHeight: '1.7' }}>
              Track every milestone. Measure real growth. See the transformation from first touch to game-changing performance.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
          <Link to="/register" className="cta-primary">
            Begin The Journey
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}

export default LandingPage;
