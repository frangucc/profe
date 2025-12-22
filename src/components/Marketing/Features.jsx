import React from 'react';
import { Brain, Zap, LineChart, Users, Image, FileText } from 'lucide-react';

function Features() {
  const features = [
    {
      icon: <Brain size={64} />,
      title: 'AI Coaching Assistant',
      description: 'Intelligent intake system that listens to your coaching philosophy and helps organize your principles using deep soccer knowledge.'
    },
    {
      icon: <Zap size={64} />,
      title: 'Session Planning',
      description: 'Create detailed training sessions with AI-powered suggestions based on your team\'s needs, age group, and playing style.'
    },
    {
      icon: <Image size={64} />,
      title: 'Visual Session Builder',
      description: 'Generate professional animations and diagrams for your training sessions. Share interactive modules with your players.'
    },
    {
      icon: <LineChart size={64} />,
      title: 'Fitness & Psychology Plans',
      description: 'Build comprehensive fitness programs and psychology development plans tailored to each player and position.'
    },
    {
      icon: <FileText size={64} />,
      title: 'Game Analysis',
      description: 'Review games and player performances with structured reflection tools. Capture insights and track development over time.'
    },
    {
      icon: <Users size={64} />,
      title: 'Player Surveys',
      description: 'Intake player feedback, goals, and development needs through customizable surveys and assessments.'
    }
  ];

  return (
    <section id="features" className="marketing-section">
      <h2 className="section-title">Everything a Modern Coach Needs</h2>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              {feature.icon}
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
