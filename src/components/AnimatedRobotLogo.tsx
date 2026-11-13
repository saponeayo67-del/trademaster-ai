import React, { useId } from 'react';

interface AnimatedRobotLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AnimatedRobotLogo: React.FC<AnimatedRobotLogoProps> = ({
  size = 'lg',
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const sizeClasses =
    size === 'sm'
      ? 'w-11 h-11 sm:w-12 sm:h-12'
      : size === 'md'
      ? 'w-20 h-20'
      : 'w-28 h-28 sm:w-32 sm:h-32';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses} ${className}`}
      aria-label="Logo animé TRADEMASTER AI"
    >
      {/* Ambient neon blue & purple backdrop aura */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-blue-600/30 via-purple-600/30 to-cyan-400/25 blur-xl pointer-events-none" />

      <svg
        viewBox="0 0 120 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible relative z-10"
      >
        <defs>
          {/* Neon gradients */}
          <linearGradient id={`frameGrad-${uid}`} x1="18" y1="14" x2="102" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <linearGradient id={`brainGrad-${uid}`} x1="36" y1="22" x2="84" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>

          <radialGradient id={`domeGlow-${uid}`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={`bodyGrad-${uid}`} x1="38" y1="84" x2="82" y2="116" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id={`eyeGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <filter id={`glow-${uid}`} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="2.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ground levitation shadow */}
        <ellipse
          cx="60"
          cy="121"
          rx="24"
          ry="4.5"
          fill="#6366f1"
          fillOpacity="0.35"
          className="animate-shadow-pulse"
        />

        {/* Floating Robot Group */}
        <g className="animate-robot-float">
          {/* Top Antenna */}
          <line
            x1="60"
            y1="8"
            x2="60"
            y2="18"
            stroke={`url(#frameGrad-${uid})`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="7"
            r="3.5"
            fill="#22d3ee"
            filter={`url(#glow-${uid})`}
            className="animate-pulse"
          />

          {/* Left & Right Ear Nodes */}
          <rect
            x="17"
            y="49"
            width="7"
            height="18"
            rx="3.5"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="1.8"
          />
          <circle cx="20.5" cy="58" r="1.8" fill="#a855f7" filter={`url(#glow-${uid})`} />

          <rect
            x="96"
            y="49"
            width="7"
            height="18"
            rx="3.5"
            fill="#0f172a"
            stroke="#c084fc"
            strokeWidth="1.8"
          />
          <circle cx="99.5" cy="58" r="1.8" fill="#22d3ee" filter={`url(#glow-${uid})`} />

          {/* Robot Head Outer Shell */}
          <rect
            x="24"
            y="18"
            width="72"
            height="64"
            rx="22"
            fill="#090d1a"
            stroke={`url(#frameGrad-${uid})`}
            strokeWidth="2.4"
          />

          {/* Transparent Glass Cranium Chamber (Brain Container) */}
          <path
            d="M32 45 C32 27, 43 21, 60 21 C77 21, 88 27, 88 45 Z"
            fill={`url(#domeGlow-${uid})`}
            stroke="#38bdf8"
            strokeOpacity="0.4"
            strokeWidth="1"
          />

          {/* Glowing Luminous Pulsing Brain Inside Head */}
          <g className="animate-brain-pulse">
            {/* Left Brain Lobe */}
            <path
              d="M58.5 44 C51 44, 44 43.5, 41 39.5 C38.5 36.2, 40 31.5, 43.5 30 C44.8 26.5, 49.5 24.5, 53.5 26 C55.5 24.5, 58 25, 58.8 27.5 Z"
              fill={`url(#brainGrad-${uid})`}
              fillOpacity="0.92"
              stroke="#e0f2fe"
              strokeOpacity="0.7"
              strokeWidth="0.9"
            />
            {/* Right Brain Lobe */}
            <path
              d="M61.5 44 C69 44, 76 43.5, 79 39.5 C81.5 36.2, 80 31.5, 76.5 30 C75.2 26.5, 70.5 24.5, 66.5 26 C64.5 24.5, 62 25, 61.2 27.5 Z"
              fill={`url(#brainGrad-${uid})`}
              fillOpacity="0.92"
              stroke="#f5d0fe"
              strokeOpacity="0.7"
              strokeWidth="0.9"
            />
            {/* Neural circuit lines & synapse nodes */}
            <path
              d="M45 35 Q49 32 54 35 M47 39 Q52 38 56 41 M75 35 Q71 32 66 35 M73 39 Q68 38 64 41"
              stroke="#ffffff"
              strokeOpacity="0.75"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <circle cx="48" cy="33" r="1.4" fill="#67e8f9" />
            <circle cx="72" cy="33" r="1.4" fill="#f0abfc" />
            <circle cx="60" cy="36" r="1.8" fill="#ffffff" />
          </g>

          {/* Dark Eye Visor Strip */}
          <rect
            x="33"
            y="49"
            width="54"
            height="23"
            rx="11.5"
            fill="#020617"
            stroke="#6366f1"
            strokeOpacity="0.55"
            strokeWidth="1.2"
          />

          {/* Blinking Neon Eyes */}
          <g className="animate-robot-blink" filter={`url(#glow-${uid})`}>
            {/* Left Eye */}
            <rect
              x="42"
              y="55"
              width="11"
              height="11"
              rx="5.5"
              fill={`url(#eyeGrad-${uid})`}
            />
            <circle cx="45.5" cy="58" r="1.8" fill="#ffffff" fillOpacity="0.9" />

            {/* Right Eye */}
            <rect
              x="67"
              y="55"
              width="11"
              height="11"
              rx="5.5"
              fill={`url(#eyeGrad-${uid})`}
            />
            <circle cx="70.5" cy="58" r="1.8" fill="#ffffff" fillOpacity="0.9" />
          </g>

          {/* Subtle Cyber Mouth / Status Bar */}
          <path
            d="M54 76 Q60 79 66 76"
            stroke="#38bdf8"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* Neck Connector */}
          <rect x="53" y="82" width="14" height="5" rx="2" fill="#312e81" />

          {/* Mini Floating Arms */}
          <rect
            x="30"
            y="90"
            width="7"
            height="16"
            rx="3.5"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <rect
            x="83"
            y="90"
            width="7"
            height="16"
            rx="3.5"
            fill="#0f172a"
            stroke="#c084fc"
            strokeWidth="1.5"
          />

          {/* Compact Futuristic Torso */}
          <rect
            x="40"
            y="86"
            width="40"
            height="24"
            rx="10"
            fill={`url(#bodyGrad-${uid})`}
            stroke={`url(#frameGrad-${uid})`}
            strokeWidth="2"
          />

          {/* Glowing Core Reactor */}
          <polygon
            points="60,92 66,98 60,104 54,98"
            fill="#22d3ee"
            filter={`url(#glow-${uid})`}
            className="animate-pulse"
          />
        </g>
      </svg>
    </div>
  );
};
