import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <div
        className="hero-bg"
        style={{ backgroundImage: 'url(/images/coach-player.png)' }}
      ></div>
      <div className="hero-content">
        <h1 className="hero-title">
          Every Player Deserves<br />
          Their Own Journey
        </h1>
        <p className="hero-subtitle">
          A new era of training. Personalized programs that grow with every rep,<br />
          every session, every breakthrough. Built for the grind. Made for greatness.
        </p>
        <div>
          <Link to="/register" className="cta-primary">
            Start Their Journey
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
