import React from 'react';

export type SiriMood =
  | 'walk'
  | 'wave'
  | 'jump'
  | 'dance'
  | 'sad'
  | 'salto'
  | 'point-chart'
  | 'point-support'
  | 'touch-support';

interface SiriRobotProps {
  mood?: SiriMood;
  facing?: 'left' | 'right';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  speechBubble?: string | null;
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-9 h-10',
  sm: 'w-12 h-14',
  md: 'w-16 h-20',
  lg: 'w-20 h-24',
};

export const SiriRobot: React.FC<SiriRobotProps> = ({
  mood = 'walk',
  facing = 'right',
  size = 'md',
  speechBubble,
  className = '',
}) => {
  const isWalking = mood === 'walk';
  const isWaving = mood === 'wave' || mood === 'walk';
  const isJumping = mood === 'jump';
  const isDancing = mood === 'dance';
  const isSad = mood === 'sad' || mood === 'point-support';
  const isSalto = mood === 'salto';
  const isPointing =
    mood === 'point-chart' ||
    mood === 'point-support' ||
    mood === 'touch-support';

  const bodyAnimClass = isSalto
    ? 'animate-siri-salto'
    : isJumping
    ? 'animate-siri-jump'
    : isDancing
    ? 'animate-siri-dance'
    : isSad
    ? 'animate-siri-sad'
    : 'animate-siri-walk';

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      aria-label="Siri le robot"
    >
      {speechBubble && (
        <div className="mb-1 px-2 py-0.5 rounded-full bg-[#0A0A12]/95 border border-[#FFD700]/70 text-[9px] sm:text-[10px] font-bold text-[#FFD700] whitespace-nowrap shadow-[0_0_12px_rgba(255,215,0,0.45)] animate-bounce">
          {speechBubble}
        </div>
      )}

      <div
        className={`${SIZE_MAP[size]} ${bodyAnimClass} transition-transform duration-300`}
        style={{
          transform: facing === 'left' ? 'scaleX(-1)' : undefined,
        }}
      >
        <svg
          viewBox="0 0 96 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_6px_14px_rgba(255,215,0,0.28)]"
        >
          <defs>
            <linearGradient id="siriGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF5A8" />
              <stop offset="45%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFAA00" />
            </linearGradient>
            <linearGradient id="siriWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="siriVisorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#090D18" />
              <stop offset="100%" stopColor="#14192E" />
            </linearGradient>
            <filter id="siriBlueGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ground Shadow */}
          <ellipse
            cx="48"
            cy="106"
            rx="20"
            ry="3.5"
            fill="#FFD700"
            opacity="0.28"
            className="animate-shadow-pulse"
          />

          {/* Blinking Antenna */}
          <line
            x1="48"
            y1="19"
            x2="48"
            y2="8"
            stroke="url(#siriGoldGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <g className="animate-siri-antenna">
            <circle cx="48" cy="6.5" r="4.8" fill="#00E5FF" />
            <circle cx="48" cy="6.5" r="2.2" fill="#FFFFFF" />
          </g>

          {/* Gold Helmet Dome */}
          <path
            d="M23 35 C23 20 34 15 48 15 C62 15 73 20 73 35"
            fill="url(#siriGoldGrad)"
            stroke="#FFF3B0"
            strokeWidth="1.2"
          />
          {/* Gold Headset Earcups */}
          <rect
            x="16"
            y="32"
            width="8"
            height="17"
            rx="4"
            fill="url(#siriGoldGrad)"
            stroke="#0A0A12"
            strokeWidth="1"
          />
          <rect
            x="72"
            y="32"
            width="8"
            height="17"
            rx="4"
            fill="url(#siriGoldGrad)"
            stroke="#0A0A12"
            strokeWidth="1"
          />
          <circle cx="20" cy="40.5" r="2" fill="#00E5FF" />
          <circle cx="76" cy="40.5" r="2" fill="#00E5FF" />

          {/* White Robot Head */}
          <rect
            x="22"
            y="24"
            width="52"
            height="34"
            rx="15"
            fill="url(#siriWhiteGrad)"
            stroke="url(#siriGoldGrad)"
            strokeWidth="2.2"
          />

          {/* Dark Face Visor */}
          <rect
            x="28"
            y="31"
            width="40"
            height="21"
            rx="9"
            fill="url(#siriVisorGrad)"
            stroke="#00E5FF"
            strokeOpacity="0.45"
            strokeWidth="1"
          />

          {/* Luminous Blue Eyes (#00E5FF) */}
          {isDancing || isJumping ? (
            /* Joyful happy arcs ^^ */
            <g filter="url(#siriBlueGlow)">
              <path
                d="M34 42 Q38.5 36 43 42"
                stroke="#00E5FF"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M53 42 Q57.5 36 62 42"
                stroke="#00E5FF"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M44 46 Q48 50 52 46"
                stroke="#FFD700"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : isSad ? (
            /* Sad droopy blue eyes + frown */
            <g filter="url(#siriBlueGlow)">
              <ellipse cx="38.5" cy="41.5" rx="3.8" ry="3.2" fill="#00E5FF" />
              <ellipse cx="57.5" cy="41.5" rx="3.8" ry="3.2" fill="#00E5FF" />
              <line
                x1="34"
                y1="36.5"
                x2="42"
                y2="38.5"
                stroke="#00E5FF"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="62"
                y1="36.5"
                x2="54"
                y2="38.5"
                stroke="#00E5FF"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M44 48.5 Q48 45 52 48.5"
                stroke="#FFAA00"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : (
            /* Bright glowing blinking eyes + cute smile */
            <g filter="url(#siriBlueGlow)">
              <g className="animate-robot-blink">
                <ellipse cx="38.5" cy="40.5" rx="4.2" ry="4.8" fill="#00E5FF" />
                <ellipse cx="57.5" cy="40.5" rx="4.2" ry="4.8" fill="#00E5FF" />
                <circle cx="40" cy="38.5" r="1.4" fill="#FFFFFF" />
                <circle cx="59" cy="38.5" r="1.4" fill="#FFFFFF" />
              </g>
              <path
                d="M44.5 47 Q48 49.5 51.5 47"
                stroke="#00E5FF"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* White & Gold Cute Rounded Body */}
          <rect
            x="29"
            y="60"
            width="38"
            height="27"
            rx="12"
            fill="url(#siriWhiteGrad)"
            stroke="url(#siriGoldGrad)"
            strokeWidth="2"
          />
          {/* Chest Gold Core */}
          <circle cx="48" cy="73.5" r="6" fill="url(#siriGoldGrad)" />
          <circle cx="48" cy="73.5" r="3" fill="#00E5FF" />

          {/* Left Arm (Waves hello when waving/walking) */}
          <g className={isWaving ? 'animate-siri-wave' : ''}>
            <rect
              x="16"
              y="62"
              width="11"
              height="7"
              rx="3.5"
              fill="url(#siriWhiteGrad)"
              stroke="url(#siriGoldGrad)"
              strokeWidth="1.5"
            />
            <circle cx="16" cy="65.5" r="4" fill="url(#siriGoldGrad)" />
          </g>

          {/* Right Arm (Points finger toward chart or support!) */}
          <g
            transform={
              isPointing
                ? mood === 'point-support' || mood === 'touch-support'
                  ? 'rotate(32 69 65)'
                  : 'rotate(-24 69 65)'
                : isDancing
                ? 'rotate(-35 69 65)'
                : undefined
            }
          >
            <rect
              x="69"
              y="62"
              width="12"
              height="7"
              rx="3.5"
              fill="url(#siriWhiteGrad)"
              stroke="url(#siriGoldGrad)"
              strokeWidth="1.5"
            />
            {/* Pointing finger glow */}
            <circle cx="81" cy="65.5" r="4" fill="url(#siriGoldGrad)" />
            {isPointing && (
              <path
                d="M84 65.5 L92 65.5"
                stroke="#00E5FF"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Walking White & Gold Legs */}
          <g className={isWalking ? 'animate-siri-leg-l' : ''}>
            <rect
              x="35"
              y="86"
              width="9"
              height="13"
              rx="4.5"
              fill="url(#siriWhiteGrad)"
              stroke="url(#siriGoldGrad)"
              strokeWidth="1.5"
            />
            <rect x="33" y="96" width="12" height="5" rx="2.5" fill="url(#siriGoldGrad)" />
          </g>

          <g className={isWalking ? 'animate-siri-leg-r' : ''}>
            <rect
              x="52"
              y="86"
              width="9"
              height="13"
              rx="4.5"
              fill="url(#siriWhiteGrad)"
              stroke="url(#siriGoldGrad)"
              strokeWidth="1.5"
            />
            <rect x="51" y="96" width="12" height="5" rx="2.5" fill="url(#siriGoldGrad)" />
          </g>
        </svg>
      </div>
    </div>
  );
};
