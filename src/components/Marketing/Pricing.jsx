import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '49',
      period: 'month',
      description: 'Perfect for individual coaches',
      features: [
        'AI coaching assistant',
        'Up to 25 players',
        'Session planning tools',
        'Basic analytics',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      price: '99',
      period: 'month',
      description: 'For serious coaches and academies',
      features: [
        'Everything in Starter',
        'Unlimited players',
        'Visual session builder',
        'Advanced analytics',
        'Game review tools',
        'Player surveys',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Club',
      price: '299',
      period: 'month',
      description: 'For clubs and organizations',
      features: [
        'Everything in Professional',
        'Multi-coach accounts',
        'Custom branding',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ]
    }
  ];

  return (
    <section id="pricing" className="marketing-section">
      <h2 className="section-title">Simple, Transparent Pricing</h2>
      <div className="feature-grid">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="feature-card"
            style={{
              border: plan.popular ? '2px solid #22c55e' : undefined,
              position: 'relative'
            }}
          >
            {plan.popular && (
              <div
                style={{
                  position: 'absolute',
                  top: '-1rem',
                  right: '2rem',
                  background: '#22c55e',
                  color: '#0a0a0a',
                  padding: '0.5rem 1.5rem',
                  fontFamily: 'Bebas Neue',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em'
                }}
              >
                MOST POPULAR
              </div>
            )}
            <h3 className="feature-title" style={{ marginBottom: '0.5rem' }}>
              {plan.name}
            </h3>
            <p style={{ color: '#a0a0a0', marginBottom: '2rem', fontSize: '0.95rem' }}>
              {plan.description}
            </p>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '4rem', fontFamily: 'Bebas Neue' }}>
                ${plan.price}
              </span>
              <span style={{ color: '#a0a0a0', fontSize: '1.2rem' }}>
                /{plan.period}
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              {plan.features.map((feature, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    color: '#a0a0a0'
                  }}
                >
                  <Check size={20} style={{ color: '#22c55e', flexShrink: 0 }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className={plan.popular ? 'cta-primary' : 'cta-secondary'}
              style={{
                width: '100%',
                textAlign: 'center',
                padding: '1rem 2rem',
                fontSize: '1rem',
                marginLeft: 0
              }}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;
