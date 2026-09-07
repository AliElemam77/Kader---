import { type FC } from 'react';
import { Building2, Clock, MapPin, Loader2, ArrowRight, Eye } from 'lucide-react';
import type { Job } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';

interface PublicJobCardProps {
  job: Job;
  isOpening: boolean;
  onApply: (job: Job) => void;
  onViewDetails?: (job: Job) => void;
}

export const PublicJobCard: FC<PublicJobCardProps> = ({
  job,
  isOpening,
  onApply,
  onViewDetails,
}) => {
  const { t, isRtl } = useLanguage();

  return (
    <div
      onClick={() => {
        if (onViewDetails) {
          onViewDetails(job);
        } else {
          onApply(job);
        }
      }}
      className="flex flex-col justify-between bg-[#0E1524] border border-white/[0.08] rounded-2xl p-6 hover:border-[#F5B23D]/30 hover:bg-[#151E31] hover:-translate-y-1 transition-all duration-200 shadow-xl shadow-black/30 group cursor-pointer"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#4C8DFF]/10 text-[#4C8DFF] border border-[#4C8DFF]/20">
            <Building2 size={11} /> {job.department || 'General'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-[#8892A6]">
            <Clock size={12} /> {job.employmentType || 'Full-time'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#EEF1F7] group-hover:text-[#F5B23D] transition-colors mb-2 flex items-center justify-between">
          <span>{job.title}</span>
          <Eye size={16} className="opacity-0 group-hover:opacity-100 text-[#F5B23D] transition-opacity shrink-0" />
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

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(job);
              }}
              className="btn-sec py-2.5 px-3 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              title={isRtl ? 'عرض تفاصيل الوظيفة' : 'View Job Details'}
            >
              <Eye size={13} />
              <span>{isRtl ? 'التفاصيل' : 'Details'}</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
            disabled={isOpening}
            className="btn-pri flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
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
    </div>
  );
};
