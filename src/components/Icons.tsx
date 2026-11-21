type IconProps = { size?: number; stroke?: number; className?: string };

const base = (size: number, stroke: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: stroke,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export const IconHome = ({ size = 22, stroke = 1.2, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M4 10.5 12 4l8 6.5V20a.8.8 0 0 1-.8.8h-4.4v-6.3H9.2v6.3H4.8A.8.8 0 0 1 4 20v-9.5Z" />
  </svg>
);

export const IconGrid = ({ size = 22, stroke = 1.2, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="0.6" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="0.6" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="0.6" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="0.6" />
  </svg>
);

export const IconHeart = ({ size = 22, stroke = 1.2, className, filled = false }: IconProps & { filled?: boolean }) => (
  <svg {...base(size, stroke)} className={className} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.1a4.1 4.1 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
  </svg>
);

export const IconBag = ({ size = 22, stroke = 1.2, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6.4a3 3 0 0 1 6 0V8" />
  </svg>
);

export const IconUser = ({ size = 22, stroke = 1.2, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <circle cx="12" cy="8.4" r="3.6" />
    <path d="M4.8 20c.6-3.6 3.6-5.6 7.2-5.6s6.6 2 7.2 5.6" />
  </svg>
);

export const IconSearch = ({ size = 20, stroke = 1.2, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <circle cx="11" cy="11" r="6.4" />
    <path d="m16 16 4 4" />
  </svg>
);

export const IconBell = ({ size = 22, stroke = 1.2, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M6.5 9.8a5.5 5.5 0 0 1 11 0c0 4 1.4 5.2 2 5.9H4.5c.6-.7 2-1.9 2-5.9Z" />
    <path d="M10 19a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const IconBack = ({ size = 22, stroke = 1.3, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
);

export const IconChevron = ({ size = 18, stroke = 1.3, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const IconArrow = ({ size = 18, stroke = 1.3, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const IconClose = ({ size = 20, stroke = 1.3, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconPlus = ({ size = 16, stroke = 1.4, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = ({ size = 16, stroke = 1.4, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M5 12h14" />
  </svg>
);

export const IconCheck = ({ size = 18, stroke = 1.6, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);

export const IconLock = ({ size = 16, stroke = 1.3, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="1" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </svg>
);

export const IconTruck = ({ size = 20, stroke = 1.2, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M2.8 6.5h10.4v9.2H2.8zM13.2 10h4l3 3v2.7h-7z" />
    <circle cx="6.4" cy="17.6" r="1.6" />
    <circle cx="16.8" cy="17.6" r="1.6" />
  </svg>
);

export const IconShare = ({ size = 18, stroke = 1.2, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M12 15V4.5M8.2 8 12 4.2 15.8 8" />
    <path d="M5 13v6.2c0 .4.3.8.8.8h12.4c.5 0 .8-.4.8-.8V13" />
  </svg>
);

export const IconGift = ({ size = 20, stroke = 1.2, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M4 10h16v9.5H4zM3 6.5h18V10H3zM12 6.5V20" />
    <path d="M12 6.5C10.5 3.5 6 3.5 6 6.5h6ZM12 6.5c1.5-3 6-3 6 0h-6Z" />
  </svg>
);

export const IconSparkle = ({ size = 16, stroke = 1.2, className }: IconProps) => (
  <svg {...base(size, stroke)} className={className}>
    <path d="M12 3c.6 4.9 2.4 6.7 7 7-4.6.3-6.4 2.1-7 7-.6-4.9-2.4-6.7-7-7 4.6-.3 6.4-2.1 7-7Z" />
  </svg>
);
