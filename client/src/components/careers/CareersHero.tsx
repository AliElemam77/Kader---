import { type FC } from 'react';
import { Search } from 'lucide-react';
import { KaderLogo } from '../common/KaderLogo';
import { useLanguage } from '../../context/LanguageContext';

interface CareersHeroProps {
  search: string;
  totalJobs: number;
  onSearchChange: (search: string) => void;
}

export const CareersHero: FC<CareersHeroProps> = ({ search, totalJobs, onSearchChange }) => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-14 px-4 max-w-2xl mx-auto space-y-5">
      {/* Brand Hero Mark */}
      <div className="flex justify-center mb-2">
        <KaderLogo size="lg" showText={true} />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#EEF1F7] tracking-tight">
        {t('careers.hero_title')}
      </h1>

      <p className="text-sm text-[#8892A6] leading-relaxed max-w-lg mx-auto">
        {t('careers.hero_sub')} • {totalJobs} {t('careers.browse_jobs')}
      </p>

      {/* Search Input */}
      <div className="pt-2 max-w-md mx-auto relative">
        <Search size={16} className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-[#8892A6]" />
        <input
          type="text"
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full ps-11 pe-4 py-3 bg-[#0E1524] border border-white/[0.08] rounded-full text-sm text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 focus:ring-[#F5B23D] focus:border-transparent transition-all shadow-xl shadow-black/40"
        />
      </div>
    </div>
  );
};
