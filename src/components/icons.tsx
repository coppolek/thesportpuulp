interface IconProps {
  className?: string;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const PlayIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M8 5.2v13.6L19 12z" />
  </svg>
);

export const RefreshIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M20 12a8 8 0 1 1-2.3-5.6" />
    <path d="M20 3v4.5h-4.5" />
  </svg>
);

export const ExternalIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M19 14v5a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 19V6.5A1.5 1.5 0 0 1 5.5 5H10" />
  </svg>
);

export const AlertIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M12 3 2.5 20h19z" />
    <path d="M12 9.5v4.5" />
    <path d="M12 17.2v.1" />
  </svg>
);

export const ArrowUpIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M12 20V5" />
    <path d="M5.5 11.5 12 5l6.5 6.5" />
  </svg>
);

export const EyeIcon = ({ className = "h-3.5 w-3.5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const CalendarIcon = ({ className = "h-3.5 w-3.5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const SettingsIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const ShareIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

export const CheckIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const SearchIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const WhistleIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M13.5 9H21v3.2l-5.6 1.6a6.2 6.2 0 1 1-1.9-4.8Z" />
    <path d="M9.5 6.5V4M13 7l1-2.2M6.5 7.5 5.2 5.6" />
    <circle cx="9.6" cy="13.9" r="1" fill="currentColor" stroke="none" />
  </svg>
);


