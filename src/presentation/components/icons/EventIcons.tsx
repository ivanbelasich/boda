// Line-art icons for event sections
// All icons inherit currentColor and can be sized via className

interface IconProps {
  className?: string;
}

export function ChurchIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Cross on top */}
      <line x1="32" y1="4" x2="32" y2="14" />
      <line x1="28" y1="8" x2="36" y2="8" />
      {/* Church roof */}
      <path d="M32 14 L48 30 L16 30 Z" />
      {/* Church body */}
      <rect x="18" y="30" width="28" height="28" />
      {/* Door */}
      <path d="M28 58 L28 44 Q32 40 36 44 L36 58" />
      {/* Windows */}
      <circle cx="24" cy="38" r="3" />
      <circle cx="40" cy="38" r="3" />
    </svg>
  );
}

export function ChampagneIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left glass */}
      <path d="M18 8 L22 40 L14 40 L18 8" />
      <line x1="18" y1="40" x2="18" y2="56" />
      <line x1="12" y1="56" x2="24" y2="56" />
      {/* Right glass */}
      <path d="M46 8 L42 40 L50 40 L46 8" />
      <line x1="46" y1="40" x2="46" y2="56" />
      <line x1="40" y1="56" x2="52" y2="56" />
      {/* Heart between glasses */}
      <path d="M32 20 C28 16 24 20 32 28 C40 20 36 16 32 20" />
      {/* Bubbles */}
      <circle cx="17" cy="16" r="1" />
      <circle cx="19" cy="24" r="1" />
      <circle cx="47" cy="18" r="1" />
      <circle cx="45" cy="26" r="1" />
    </svg>
  );
}

export function GiftIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Ribbon bow */}
      <path d="M32 8 C24 8 20 16 32 20 C44 16 40 8 32 8" />
      <path d="M32 8 C40 8 44 16 32 20" />
      {/* Box top */}
      <rect x="12" y="20" width="40" height="8" />
      {/* Box body */}
      <rect x="14" y="28" width="36" height="28" />
      {/* Ribbon vertical */}
      <line x1="32" y1="20" x2="32" y2="56" />
      {/* Ribbon horizontal on lid */}
      <line x1="12" y1="24" x2="52" y2="24" />
    </svg>
  );
}

export function DressCodeIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Tie (left side) */}
      <path d="M16 8 L20 8 L18 16 L22 52 L14 52 L18 16 Z" />
      <path d="M14 8 L22 8 L20 12 L16 12 Z" />
      {/* Dress (right side) */}
      <path d="M40 8 L44 8 L44 16 L50 52 L34 52 L40 16 Z" />
      <ellipse cx="42" cy="10" rx="4" ry="2" />
    </svg>
  );
}

export function CalendarHeartIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Calendar body */}
      <rect x="8" y="12" width="48" height="44" rx="4" />
      {/* Calendar top bar */}
      <line x1="8" y1="24" x2="56" y2="24" />
      {/* Calendar rings */}
      <line x1="20" y1="8" x2="20" y2="16" />
      <line x1="44" y1="8" x2="44" y2="16" />
      {/* Dots pattern at top */}
      <circle cx="14" cy="18" r="1.5" fill="currentColor" />
      <circle cx="26" cy="18" r="1.5" fill="currentColor" />
      <circle cx="38" cy="18" r="1.5" fill="currentColor" />
      <circle cx="50" cy="18" r="1.5" fill="currentColor" />
      {/* Heart in center */}
      <path d="M32 34 C28 30 22 32 32 44 C42 32 36 30 32 34" />
    </svg>
  );
}

export function MusicNoteIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Note stem */}
      <line x1="44" y1="12" x2="44" y2="48" />
      {/* Note head */}
      <ellipse cx="36" cy="48" rx="8" ry="6" />
      {/* Flag */}
      <path d="M44 12 C52 16 52 28 44 32" />
      <path d="M44 20 C50 24 50 32 44 36" />
    </svg>
  );
}

export function InstagramIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer rounded square */}
      <rect x="8" y="8" width="48" height="48" rx="12" />
      {/* Inner circle */}
      <circle cx="32" cy="32" r="12" />
      {/* Top right dot */}
      <circle cx="46" cy="18" r="3" fill="currentColor" />
    </svg>
  );
}

export function MapPinIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 56 C32 56 52 36 52 24 C52 13 43 4 32 4 C21 4 12 13 12 24 C12 36 32 56 32 56 Z" />
      <circle cx="32" cy="24" r="8" />
    </svg>
  );
}

export function LeafIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 56 Q8 40 8 20 Q32 8 56 20 Q56 40 32 56 Z" />
      <path d="M32 56 Q32 40 32 20" />
      <path d="M20 32 Q32 28 44 32" />
    </svg>
  );
}

// Decorative leaves for botanical theme
export function BotanicalLeafLeft({ className = 'w-32 h-48' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 180"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    >
      {/* Main branch */}
      <path d="M100 180 Q60 120 80 60 Q90 20 60 0" />
      {/* Leaves */}
      <path d="M80 140 Q50 130 40 100 Q60 110 80 140" fill="currentColor" fillOpacity="0.1" />
      <path d="M85 100 Q55 95 50 65 Q70 75 85 100" fill="currentColor" fillOpacity="0.1" />
      <path d="M75 60 Q50 60 45 35 Q65 45 75 60" fill="currentColor" fillOpacity="0.1" />
      {/* Right side leaves */}
      <path d="M85 120 Q110 115 115 90 Q95 100 85 120" fill="currentColor" fillOpacity="0.1" />
      <path d="M80 80 Q100 70 100 45 Q85 60 80 80" fill="currentColor" fillOpacity="0.1" />
    </svg>
  );
}

export function BotanicalLeafRight({ className = 'w-32 h-48' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 180"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
      style={{ transform: 'scaleX(-1)' }}
    >
      {/* Main branch */}
      <path d="M100 180 Q60 120 80 60 Q90 20 60 0" />
      {/* Leaves */}
      <path d="M80 140 Q50 130 40 100 Q60 110 80 140" fill="currentColor" fillOpacity="0.1" />
      <path d="M85 100 Q55 95 50 65 Q70 75 85 100" fill="currentColor" fillOpacity="0.1" />
      <path d="M75 60 Q50 60 45 35 Q65 45 75 60" fill="currentColor" fillOpacity="0.1" />
      {/* Right side leaves */}
      <path d="M85 120 Q110 115 115 90 Q95 100 85 120" fill="currentColor" fillOpacity="0.1" />
      <path d="M80 80 Q100 70 100 45 Q85 60 80 80" fill="currentColor" fillOpacity="0.1" />
    </svg>
  );
}

export function BotanicalLeafTop({ className = 'w-48 h-32' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    >
      {/* Center branch going down */}
      <path d="M90 0 Q90 40 90 80" />
      {/* Left leaves */}
      <path d="M90 30 Q50 20 30 40 Q60 35 90 30" fill="currentColor" fillOpacity="0.15" />
      <path d="M90 50 Q40 45 20 70 Q55 55 90 50" fill="currentColor" fillOpacity="0.15" />
      <path d="M90 70 Q50 70 35 95 Q65 80 90 70" fill="currentColor" fillOpacity="0.12" />
      {/* Right leaves */}
      <path d="M90 30 Q130 20 150 40 Q120 35 90 30" fill="currentColor" fillOpacity="0.15" />
      <path d="M90 50 Q140 45 160 70 Q125 55 90 50" fill="currentColor" fillOpacity="0.15" />
      <path d="M90 70 Q130 70 145 95 Q115 80 90 70" fill="currentColor" fillOpacity="0.12" />
    </svg>
  );
}

