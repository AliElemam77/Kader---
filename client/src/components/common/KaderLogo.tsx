import type { FC } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export interface KaderLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  lang?: 'ar' | 'en' | 'auto';
  className?: string;
  theme?: 'color' | 'mono' | 'light' | 'amber';
}

export const KaderMark: FC<{ size?: number; className?: string; theme?: 'color' | 'mono' | 'light' | 'amber' }> = ({
  size = 36,
  className = '',
  theme = 'color',
}) => {
  // Theme color definitions according to Kader Brand Book
  let m1 = '#5A6478';
  let m2 = '#4C8DFF';
  let m3 = '#F5B23D';

  if (theme === 'light') {
    m1 = '#B7BECC';
    m2 = '#2F6BE0';
    m3 = '#E19A22';
  } else if (theme === 'mono') {
    m1 = 'rgba(238, 241, 247, 0.4)';
    m2 = 'rgba(238, 241, 247, 0.7)';
    m3 = '#EEF1F7';
  } else if (theme === 'amber') {
    m1 = 'rgba(7, 10, 20, 0.35)';
    m2 = 'rgba(7, 10, 20, 0.65)';
    m3 = '#070A14';
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 transition-transform duration-200 ${className}`}
      aria-label="Kader Mark"
    >
      {/* Figure 1: Slate - New Candidate */}
      <g>
        <circle cx="9" cy="23" r="4" fill={m1} />
        <rect x="5" y="29" width="8" height="13" rx="4" fill={m1} />
      </g>
      {/* Figure 2: Signal Blue - Interview / Evaluation */}
      <g>
        <circle cx="24" cy="17" r="4" fill={m2} />
        <rect x="20" y="23" width="8" height="19" rx="4" fill={m2} />
      </g>
      {/* Figure 3: Amber Gold - Hired / Offer */}
      <g>
        <circle cx="39" cy="10" r="4" fill={m3} />
        <rect x="35" y="16" width="8" height="26" rx="4" fill={m3} />
      </g>
    </svg>
  );
};

export const KaderLogo: FC<KaderLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = false,
  subtitle,
  lang = 'auto',
  className = '',
  theme = 'color',
}) => {
  const { language } = useLanguage();
  const activeLang = lang === 'auto' ? language : lang;

  const sizeDimensions = {
    sm: { mark: 26, title: 'text-base', sub: 'text-[10px]' },
    md: { mark: 36, title: 'text-xl', sub: 'text-xs' },
    lg: { mark: 48, title: 'text-2xl sm:text-3xl', sub: 'text-xs sm:text-sm' },
    xl: { mark: 64, title: 'text-4xl sm:text-5xl', sub: 'text-sm sm:text-base' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative group-hover:scale-105 transition-transform duration-200">
        <KaderMark size={sizeDimensions.mark} theme={theme} />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 leading-none">
            {activeLang === 'ar' ? (
              <span className={`font-bold tracking-tight text-[#EEF1F7] ${sizeDimensions.title} font-['IBM_Plex_Sans_Arabic']`}>
                كادر
              </span>
            ) : (
              <span className={`font-extrabold tracking-tight text-[#EEF1F7] ${sizeDimensions.title} font-['Plus_Jakarta_Sans']`}>
                Kader
              </span>
            )}
            <span className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#F5B23D]/10 text-[#F5B23D] border border-[#F5B23D]/20">
              ATS
            </span>
          </div>

          {showSubtitle && (
            <span className={`text-[#8892A6] mt-1 font-normal ${sizeDimensions.sub}`}>
              {subtitle || (activeLang === 'ar' ? 'من التقديم إلى التعيين، في مسار واحد' : 'One track from apply to hire')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
