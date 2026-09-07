import { type FC } from 'react';
import { Sparkles, RefreshCw, Plus } from 'lucide-react';
import type { Job } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';

interface PipelineHeaderProps {
  jobs: Job[];
  selectedJob: Job | undefined;
  selectedJobId: string;
  loading: boolean;
  onSelectJob: (jobId: string) => void;
  onRefresh: () => void;
  onOpenAddStage: () => void;
}

export const PipelineHeader: FC<PipelineHeaderProps> = ({
  jobs,
  selectedJob,
  selectedJobId,
  loading,
  onSelectJob,
  onRefresh,
  onOpenAddStage,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1524] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">
            {selectedJob ? selectedJob.title : t('nav.pipeline')}
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#35D6A4]/10 text-[#35D6A4] border border-[#35D6A4]/20">
            <Sparkles size={11} /> {t('common.online')}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#8892A6]">
          {selectedJob?.department ? `${selectedJob.department} • ` : ''}
          {t('nav.tagline')}
        </p>
      </div>

      {/* Job Selector & Actions */}
      <div className="flex items-center gap-2.5 self-stretch md:self-auto">
        {jobs.length > 1 && (
          <select
            value={selectedJobId}
            onChange={(e) => onSelectJob(e.target.value)}
            className="px-3 py-2 bg-[#070A14] border border-white/[0.12] rounded-xl text-xs text-[#EEF1F7] focus:outline-none focus:ring-2 focus:ring-[#F5B23D] cursor-pointer"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={onRefresh}
          title={t('pipeline.refresh')}
          className="p-2.5 rounded-xl bg-[#151E31] hover:bg-[#1d2942] text-[#8892A6] hover:text-[#EEF1F7] border border-white/[0.08] transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>

        <button
          onClick={onOpenAddStage}
          className="btn-pri text-xs px-4 py-2.5 rounded-xl cursor-pointer whitespace-nowrap"
        >
          <Plus size={16} /> {t('pipeline.add_stage')}
        </button>
      </div>
    </div>
  );
};
