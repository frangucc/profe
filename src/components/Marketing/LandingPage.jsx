import React from 'react';
import MarketingLayout from './MarketingLayout';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Pricing from './Pricing';
import FinalCTA from './FinalCTA';

function LandingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <footer style={{
        background: '#000',
        padding: '3rem',
        textAlign: 'center',
        color: '#666',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          PROFE
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          © 2024 ProFe. AI-Powered Soccer Coaching Platform.
        </p>
      </footer>
    </MarketingLayout>
  );
}

export default LandingPage;
