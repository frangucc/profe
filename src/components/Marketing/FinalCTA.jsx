import React from 'react';
import { Link } from 'react-router-dom';

function FinalCTA() {
  return (
    <section className="marketing-section" style={{ background: '#0f0f0f', textAlign: 'center' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>
          Ready to Transform<br />Your Coaching?
        </h2>
        <p className="hero-subtitle" style={{ marginBottom: '3rem' }}>
          Join hundreds of coaches using AI to build better programs,<br />
          develop players faster, and win more games
        </p>
        <Link to="/register" className="cta-primary">
          Start Your Free Trial
        </Link>
        <p style={{ marginTop: '2rem', color: '#666', fontSize: '0.9rem' }}>
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}

export default FinalCTA;
