import React from 'react';
import { Link } from 'react-router-dom';
import '../../marketing.css';

function MarketingLayout({ children }) {
  return (
    <div className="marketing-site">
      <nav className="marketing-nav">
        <Link to="/main" className="nav-logo">
          PROFE
        </Link>
        <ul className="nav-links">
          <li><Link to="/main#features">Features</Link></li>
          <li><Link to="/main#how-it-works">How It Works</Link></li>
          <li><Link to="/main#pricing">Pricing</Link></li>
          <li><Link to="/login">Sign In</Link></li>
        </ul>
      </nav>
      {children}
    </div>
  );
}

export default MarketingLayout;
