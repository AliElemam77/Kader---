import { type FC } from 'react';
import { Building2, Clock, MapPin, Loader2, ArrowRight } from 'lucide-react';
import type { Job } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';

interface PublicJobCardProps {
  job: Job;
  isOpening: boolean;
  onApply: (job: Job) => void;
}

export const PublicJobCard: FC<PublicJobCardProps> = ({ job, isOpening, onApply }) => {
  const { t, isRtl } = useLanguage();

  return (
    <div className="flex flex-col justify-between bg-[#0E1524] border border-white/[0.08] rounded-2xl p-6 hover:border-[#F5B23D]/30 hover:bg-[#151E31] hover:-translate-y-1 transition-all duration-200 shadow-xl shadow-black/30 group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#4C8DFF]/10 text-[#4C8DFF] border border-[#4C8DFF]/20">
            <Building2 size={11} /> {job.department || 'General'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-[#8892A6]">
            <Clock size={12} /> {job.employmentType || 'Full-time'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#EEF1F7] group-hover:text-[#F5B23D] transition-colors mb-2">
          {job.title}
        </h3>

        <p className="text-xs text-[#8892A6] line-clamp-3 leading-relaxed mb-6">
          {job.description}
        </p>
      </div>

      <div className="pt-4 border-t border-white/[0.08]">
        <div className="flex items-center justify-between text-xs text-[#8892A6] mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[#F5B23D]" />
            <span>{job.location || 'Remote'}</span>
          </div>
          {job.formFields && (
            <span className="text-[11px] text-[#5A6478] font-mono">
              {job.formFields.length} {isRtl ? 'حقول مخصصة' : 'fields'}
            </span>
          )}
        </div>

        <button
          onClick={() => onApply(job)}
          disabled={isOpening}
          className="btn-pri w-full py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          {isOpening ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>{t('common.loading')}</span>
            </>
          ) : (
            <>
              <span>{t('careers.apply_now')}</span>
              <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
