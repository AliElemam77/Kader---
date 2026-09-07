import type { FC } from 'react';
import { Building2, MapPin, Users, Layers, ArrowUpRight, Sliders } from 'lucide-react';
import type { Job } from '../../types/ats';

interface JobCardItemProps {
  job: Job;
  onOpenPipeline: (jobId: string) => void;
  onOpenBuilder: (jobId: string) => void;
}

export const JobCardItem: FC<JobCardItemProps> = ({
  job,
  onOpenPipeline,
  onOpenBuilder,
}) => {
  return (
    <div className="flex flex-col justify-between bg-[#0E1524] border border-white/[0.08] rounded-2xl p-6 hover:border-[#F5B23D]/30 hover:bg-[#151E31] transition-all shadow-xl group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              job.status === 'PUBLISHED'
                ? 'bg-[#35D6A4]/10 text-[#35D6A4] border-[#35D6A4]/20'
                : 'bg-[#F5B23D]/10 text-[#F5B23D] border-[#F5B23D]/20'
            }`}
          >
            {job.status === 'PUBLISHED' ? 'منشور' : 'مسودة'}
          </span>
          <span className="text-xs text-[#8892A6]">{job.employmentType}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#8892A6] mb-1.5">
          <Building2 size={13} className="text-[#4C8DFF]" />
          <span>{job.department}</span>
        </div>

        <h3 className="text-base font-bold text-[#EEF1F7] mb-2 group-hover:text-[#F5B23D] transition-colors">
          {job.title}
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
            {job.candidatesCount || 0} مرشح
          </span>
        </div>

        {/* Actions: Pipeline & Form Builder */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onOpenPipeline(job.id)}
            className="btn-pri py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Layers size={13} />
            <span>المسار</span>
            <ArrowUpRight size={13} />
          </button>

          <button
            onClick={() => onOpenBuilder(job.id)}
            className="btn-sec py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Sliders size={13} />
            <span>النموذج</span>
          </button>
        </div>
      </div>
    </div>
  );
};
