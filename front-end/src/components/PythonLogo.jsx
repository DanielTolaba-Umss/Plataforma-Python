import React from 'react';

export function PythonLogo({ className = '' }) {
  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* White circular background */}
        <circle cx="50" cy="50" r="45" fill="white" />
        {/* Main Python shape */}
        <path
          d="M49.5 10C25.3 10 27 18.5 27 18.5V27H50V30H17.5C17.5 30 10 28.5 10 50C10 71.5 16.5 70 16.5 70H25V60.5C25 60.5 24.5 50 35 50H57.5C57.5 50 67.5 50 67.5 40V20C67.5 20 70 10 49.5 10Z"
          fill="rgba(12,4,97,0.992)"
        />
        <path
          d="M50.5 90C74.7 90 73 81.5 73 81.5V73H50V70H82.5C82.5 70 90 71.5 90 50C90 28.5 83.5 30 83.5 30H75V39.5C75 39.5 75.5 50 65 50H42.5C42.5 50 32.5 50 32.5 60V80C32.5 80 30 90 50.5 90Z"
          fill="rgb(255,212,56)"
        />
        {/* Eyes */}
        <circle cx="35" cy="20" r="3.5" fill="white" />
        <circle cx="65" cy="80" r="3.5" fill="white" />
        {/* Code pattern overlay */}
        <g opacity="0.15">
          <path
            d="M30 25H45M30 35H40M55 65H70M60 75H75"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M20 60H35M25 65H30"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
        {/* Subtle glow effect */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#paint0_radial)"
          fillOpacity="0.2"
        />
        {/* Gradient definitions */}
        <defs>
          <radialGradient
            id="paint0_radial"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(50 50) rotate(90) scale(50)"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
