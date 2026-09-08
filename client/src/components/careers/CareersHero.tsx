import { type FC } from 'react';
import { Search, X } from 'lucide-react';
import { KaderLogo } from '../common/KaderLogo';
import { useLanguage } from '../../context/LanguageContext';

interface CareersHeroProps {
  search: string;
  totalJobs: number;
  onSearchChange: (search: string) => void;
}

export const CareersHero: FC<CareersHeroProps> = ({ search, totalJobs, onSearchChange }) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="text-center py-10 sm:py-14 px-4 max-w-2xl mx-auto space-y-5">
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

      {/* Search Input - Clean Flex Container with generous padding and no border collision */}
      <div className="pt-2 max-w-lg mx-auto">
        <div className="flex items-center w-full bg-[#0E1524] border border-white/[0.12] hover:border-white/25 focus-within:border-[#F5B23D] focus-within:ring-2 focus-within:ring-[#F5B23D]/25 rounded-2xl transition-all shadow-xl shadow-black/40 px-4 py-3">
          <Search size={18} className="text-[#8892A6] shrink-0 me-3.5" />
          <input
            type="text"
            placeholder={
              isAr
                ? 'ابحث عن المسمى الوظيفي، القسم، أو الكلمات المفتاحية...'
                : 'Search open positions, departments, keywords...'
            }
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-sm text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-white/10 transition-colors cursor-pointer shrink-0 ms-2"
              title={isAr ? 'مسح البحث' : 'Clear search'}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
