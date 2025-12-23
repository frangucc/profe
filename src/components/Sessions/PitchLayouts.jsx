import React from 'react';

export const FullPitch = ({ fieldBgColor, fieldLineColor }) => (
  <svg width="600" height="900" viewBox="-10 -10 620 920" className="w-full h-full">
    {/* Field background */}
    <rect x="-10" y="-10" width="620" height="920" fill={fieldBgColor} />

    {/* Border */}
    <rect x="20" y="20" width="560" height="860" fill="none" stroke={fieldLineColor} strokeWidth="3" />

    {/* Center line */}
    <line x1="20" y1="450" x2="580" y2="450" stroke={fieldLineColor} strokeWidth="3" />

    {/* Center circle */}
    <circle cx="300" cy="450" r="80" fill="none" stroke={fieldLineColor} strokeWidth="3" />
    <circle cx="300" cy="450" r="5" fill={fieldLineColor} />

    {/* Top penalty area */}
    <rect x="140" y="20" width="320" height="140" fill="none" stroke={fieldLineColor} strokeWidth="3" />

    {/* Top goal area */}
    <rect x="220" y="20" width="160" height="60" fill="none" stroke={fieldLineColor} strokeWidth="3" />

    {/* Top penalty arc */}
    <path d="M 220 160 Q 300 200 380 160" fill="none" stroke={fieldLineColor} strokeWidth="3" />
    <circle cx="300" cy="125" r="5" fill={fieldLineColor} />

    {/* Bottom penalty area */}
    <rect x="140" y="740" width="320" height="140" fill="none" stroke={fieldLineColor} strokeWidth="3" />

    {/* Bottom goal area */}
    <rect x="220" y="820" width="160" height="60" fill="none" stroke={fieldLineColor} strokeWidth="3" />

    {/* Bottom penalty arc */}
    <path d="M 220 740 Q 300 700 380 740" fill="none" stroke={fieldLineColor} strokeWidth="3" />
    <circle cx="300" cy="775" r="5" fill={fieldLineColor} />

    {/* Top goal */}
    <rect x="260" y="0" width="80" height="20" fill="none" stroke={fieldLineColor} strokeWidth="2" />

    {/* Bottom goal */}
    <rect x="260" y="880" width="80" height="20" fill="none" stroke={fieldLineColor} strokeWidth="2" />

    {/* Corner arcs */}
    <path d="M 20 35 Q 20 20 35 20" fill="none" stroke={fieldLineColor} strokeWidth="2" />
    <path d="M 565 20 Q 580 20 580 35" fill="none" stroke={fieldLineColor} strokeWidth="2" />
    <path d="M 20 865 Q 20 880 35 880" fill="none" stroke={fieldLineColor} strokeWidth="2" />
    <path d="M 565 880 Q 580 880 580 865" fill="none" stroke={fieldLineColor} strokeWidth="2" />
  </svg>
);

export const AttackHalf = ({ fieldBgColor, fieldLineColor }) => (
  <svg width="600" height="500" viewBox="-10 -10 620 520" className="w-full h-full">
    {/* Field background */}
    <rect x="-10" y="-10" width="620" height="520" fill={fieldBgColor} />

    {/* Border - top and sides extending to bottom edge */}
    <line x1="20" y1="20" x2="580" y2="20" stroke={fieldLineColor} strokeWidth="3" />
    <line x1="20" y1="20" x2="20" y2="510" stroke={fieldLineColor} strokeWidth="3" />
    <line x1="580" y1="20" x2="580" y2="510" stroke={fieldLineColor} strokeWidth="3" />

    {/* Full center circle - exactly 50% visible, center on bottom edge */}
    <circle cx="300" cy="510" r="80" fill="none" stroke={fieldLineColor} strokeWidth="3" />
    {/* Half dot on bottom edge */}
    <circle cx="300" cy="510" r="5" fill={fieldLineColor} />

    {/* Top penalty area */}
    <rect x="140" y="20" width="320" height="140" fill="none" stroke={fieldLineColor} strokeWidth="3" />

    {/* Top goal area */}
    <rect x="220" y="20" width="160" height="60" fill="none" stroke={fieldLineColor} strokeWidth="3" />

    {/* Top penalty arc */}
    <path d="M 220 160 Q 300 200 380 160" fill="none" stroke={fieldLineColor} strokeWidth="3" />
    <circle cx="300" cy="125" r="5" fill={fieldLineColor} />

    {/* Top goal */}
    <rect x="260" y="0" width="80" height="20" fill="none" stroke={fieldLineColor} strokeWidth="2" />

    {/* Top corner arcs */}
    <path d="M 20 35 Q 20 20 35 20" fill="none" stroke={fieldLineColor} strokeWidth="2" />
    <path d="M 565 20 Q 580 20 580 35" fill="none" stroke={fieldLineColor} strokeWidth="2" />
  </svg>
);

export const DefenseHalf = ({ fieldBgColor, fieldLineColor }) => (
  <svg width="600" height="500" viewBox="-10 -10 620 520" className="w-full h-full">
    {/* Field background */}
    <rect x="-10" y="-10" width="620" height="520" fill={fieldBgColor} />

    {/* Border - bottom and sides extending to top edge */}
    <line x1="20" y1="480" x2="580" y2="480" stroke={fieldLineColor} strokeWidth="3" />
    <line x1="20" y1="-10" x2="20" y2="480" stroke={fieldLineColor} strokeWidth="3" />
    <line x1="580" y1="-10" x2="580" y2="480" stroke={fieldLineColor} strokeWidth="3" />

    {/* Full center circle - exactly 50% visible, center on top edge */}
    <circle cx="300" cy="-10" r="80" fill="none" stroke={fieldLineColor} strokeWidth="3" />
    {/* Half dot on top edge */}
    <circle cx="300" cy="-10" r="5" fill={fieldLineColor} />

    {/* Bottom penalty area */}
    <rect x="140" y="340" width="320" height="140" fill="none" stroke={fieldLineColor} strokeWidth="3" />

    {/* Bottom goal area */}
    <rect x="220" y="420" width="160" height="60" fill="none" stroke={fieldLineColor} strokeWidth="3" />

    {/* Bottom penalty arc */}
    <path d="M 220 340 Q 300 300 380 340" fill="none" stroke={fieldLineColor} strokeWidth="3" />
    <circle cx="300" cy="375" r="5" fill={fieldLineColor} />

    {/* Bottom goal */}
    <rect x="260" y="480" width="80" height="20" fill="none" stroke={fieldLineColor} strokeWidth="2" />

    {/* Bottom corner arcs */}
    <path d="M 20 465 Q 20 480 35 480" fill="none" stroke={fieldLineColor} strokeWidth="2" />
    <path d="M 565 480 Q 580 480 580 465" fill="none" stroke={fieldLineColor} strokeWidth="2" />
  </svg>
);

export const TrainingGrid = ({ fieldBgColor, fieldLineColor }) => (
  <svg width="900" height="600" viewBox="-10 -10 920 620" className="w-full h-full">
    {/* Field background */}
    <rect x="-10" y="-10" width="920" height="620" fill={fieldBgColor} />

    {/* Border */}
    <rect x="20" y="20" width="860" height="560" fill="none" stroke={fieldLineColor} strokeWidth="3" />

    {/* Vertical thirds - dashed */}
    <line x1="313" y1="20" x2="313" y2="580" stroke={fieldLineColor} strokeWidth="2" strokeDasharray="10,5" />
    <line x1="587" y1="20" x2="587" y2="580" stroke={fieldLineColor} strokeWidth="2" strokeDasharray="10,5" />

    {/* Left side - Top mini goal */}
    <rect x="0" y="150" width="20" height="100" fill="none" stroke={fieldLineColor} strokeWidth="2" />

    {/* Left side - Bottom mini goal */}
    <rect x="0" y="350" width="20" height="100" fill="none" stroke={fieldLineColor} strokeWidth="2" />

    {/* Right side - Top mini goal */}
    <rect x="880" y="150" width="20" height="100" fill="none" stroke={fieldLineColor} strokeWidth="2" />

    {/* Right side - Bottom mini goal */}
    <rect x="880" y="350" width="20" height="100" fill="none" stroke={fieldLineColor} strokeWidth="2" />
  </svg>
);
