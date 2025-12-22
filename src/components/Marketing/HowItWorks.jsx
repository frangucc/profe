import React from 'react';

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Share Your Philosophy',
      description: 'Our AI assistant interviews you about your coaching principles, preferred tactics, and team objectives. We learn what makes your approach unique.'
    },
    {
      number: '02',
      title: 'Build Your Program',
      description: 'Create session plans, fitness routines, and psychology frameworks using AI-powered templates matched to your philosophy and player development goals.'
    },
    {
      number: '03',
      title: 'Visualize & Share',
      description: 'Generate professional animations and interactive modules. Share directly with players through our platform or export for team meetings.'
    },
    {
      number: '04',
      title: 'Review & Refine',
      description: 'Analyze games, track player progress, and gather feedback through surveys. Continuously improve your program with data-driven insights.'
    }
  ];

  return (
    <section id="how-it-works" className="marketing-section" style={{ background: '#0f0f0f' }}>
      <h2 className="section-title">How It Works</h2>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step">
            <div>
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
            <div className="step-image"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
