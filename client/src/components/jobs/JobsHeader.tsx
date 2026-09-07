import type { FC } from 'react';
import { Sparkles, RefreshCw, Plus } from 'lucide-react';

interface JobsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onCreateClick: () => void;
}

export const JobsHeader: FC<JobsHeaderProps> = ({
  loading,
  onRefresh,
  onCreateClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0E1524] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">الوظائف النشطة • Active Roles</h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#35D6A4]/10 text-[#35D6A4] border border-[#35D6A4]/20">
            <Sparkles size={11} /> PostgreSQL Live
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#8892A6]">
          تخصيص نماذج التقديم ومسارات العمل المستقلة لكل شاغر وظيفي.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onRefresh}
          title="Refresh database records"
          className="p-2.5 rounded-xl bg-[#151E31] hover:bg-white/[0.08] text-[#8892A6] hover:text-[#EEF1F7] border border-white/[0.08] transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>

        <button
          onClick={onCreateClick}
          className="btn-pri text-xs px-4 py-2.5 rounded-xl cursor-pointer whitespace-nowrap"
        >
          <Plus size={16} /> إضافة وظيفة جديدة
        </button>
      </div>
    </div>
  );
};
