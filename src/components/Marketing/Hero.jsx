import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          AI-Powered<br />
          Coaching<br />
          Platform
        </h1>
        <p className="hero-subtitle">
          Build championship programs with intelligent session planning,<br />
          visual training modules, and player development tools
        </p>
        <div>
          <Link to="/register" className="cta-primary">
            Start Free Trial
          </Link>
          <Link to="#how-it-works" className="cta-secondary">
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
