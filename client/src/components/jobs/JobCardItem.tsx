import type { FC } from 'react';
import { Building2, MapPin, Users, Layers, ArrowUpRight, Sliders, Trash2, Eye } from 'lucide-react';
import type { Job } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';

interface JobCardItemProps {
  job: Job;
  onOpenPipeline: (jobId: string) => void;
  onOpenBuilder: (jobId: string) => void;
  onViewDetails?: (job: Job) => void;
  onDeleteClick?: (job: Job) => void;
}

export const JobCardItem: FC<JobCardItemProps> = ({
  job,
  onOpenPipeline,
  onOpenBuilder,
  onViewDetails,
  onDeleteClick,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div
      onClick={() => onViewDetails?.(job)}
      className="flex flex-col justify-between bg-[#0E1524] border border-white/[0.08] rounded-2xl p-6 hover:border-[#F5B23D]/30 hover:bg-[#151E31] transition-all shadow-xl group relative cursor-pointer"
      title={isAr ? 'اضغط لعرض تفاصيل الوظيفة بالكامل' : 'Click to view full job details'}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                job.status === 'PUBLISHED'
                  ? 'bg-[#35D6A4]/10 text-[#35D6A4] border-[#35D6A4]/20'
                  : 'bg-[#F5B23D]/10 text-[#F5B23D] border-[#F5B23D]/20'
              }`}
            >
              {job.status === 'PUBLISHED'
                ? isAr ? 'منشور' : 'Published'
                : isAr ? 'مسودة' : 'Draft'}
            </span>
            <span className="text-xs text-[#8892A6]">{job.employmentType}</span>
          </div>

          {/* Delete Button Header Action */}
          {onDeleteClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(job);
              }}
              title={isAr ? 'حذف هذه الوظيفة' : 'Delete this job position'}
              className="p-1.5 rounded-lg text-[#8892A6] hover:text-[#FF7A85] hover:bg-[#FF7A85]/10 transition-colors cursor-pointer z-10"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#8892A6] mb-1.5">
          <Building2 size={13} className="text-[#4C8DFF]" />
          <span>{job.department}</span>
        </div>

        <h3 className="text-base font-bold text-[#EEF1F7] mb-2 group-hover:text-[#F5B23D] transition-colors flex items-center justify-between">
          <span>{job.title}</span>
          <span className="flex items-center gap-1 text-xs text-[#F5B23D] font-normal opacity-0 group-hover:opacity-100 transition-opacity">
            <span>{isAr ? 'عرض التفاصيل' : 'Details'}</span>
            <Eye size={14} className="shrink-0" />
          </span>
        </h3>

        <p className="text-xs text-[#8892A6] line-clamp-3 leading-relaxed mb-6">
          {job.description}
        </p>
      </div>

      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8892A6]">
          <span className="flex items-center gap-1.5 truncate max-w-[170px]">
            <MapPin size={13} className="text-[#F5B23D] shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-[#EEF1F7] shrink-0 font-mono">
            <Users size={13} className="text-[#4C8DFF]" />
            {job.candidatesCount || 0} {isAr ? 'مرشح' : 'candidates'}
          </span>
        </div>

        {/* Actions: Details, Pipeline, Form Builder & Delete */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 pt-1"
        >
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(job)}
              className="btn-sec py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              title={isAr ? 'عرض التفاصيل' : 'View Details'}
            >
              <Eye size={13} />
              <span>{isAr ? 'التفاصيل' : 'Details'}</span>
            </button>
          )}

          <button
            onClick={() => onOpenPipeline(job.id)}
            className="btn-pri flex-1 py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Layers size={13} />
            <span>{isAr ? 'المسار' : 'Pipeline'}</span>
            <ArrowUpRight size={13} />
          </button>

          <button
            onClick={() => onOpenBuilder(job.id)}
            className="btn-sec py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
            title={isAr ? 'منشئ نموذج التقديم' : 'Application Form Builder'}
          >
            <Sliders size={13} />
            <span>{isAr ? 'النموذج' : 'Form'}</span>
          </button>

          {onDeleteClick && (
            <button
              onClick={() => onDeleteClick(job)}
              className="p-2 rounded-xl border border-white/[0.08] bg-[#151E31] text-[#8892A6] hover:text-[#FF7A85] hover:border-[#FF7A85]/30 hover:bg-[#FF7A85]/10 transition-colors cursor-pointer"
              title={isAr ? 'حذف الوظيفة' : 'Delete Job'}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
