import { useState, type FC } from 'react';
import { Loader2, Sparkles, Lock, ArrowRight } from 'lucide-react';
import type { Job } from '../types/ats';
import { useCareers } from '../hooks/useCareers';
import { CareersHero } from './careers/CareersHero';
import { PublicJobCard } from './careers/PublicJobCard';
import { JobApplicationModal } from './careers/JobApplicationModal';
import { JobDetailModal } from './jobs/JobDetailModal';
import { useLanguage } from '../context/LanguageContext';

interface PublicCareersProps {
  onOpenLogin?: () => void;
}

export const PublicCareers: FC<PublicCareersProps> = ({ onOpenLogin }) => {
  const { isRtl } = useLanguage();
  const {
    jobs,
    allJobsCount,
    loading,
    search,
    setSearch,
    selectedJob,
    setSelectedJob,
    fetchingJobId,
    handleOpenApply,
  } = useCareers();

  const [jobForDetails, setJobForDetails] = useState<Job | null>(null);

  return (
    <div className="space-y-8">
      {/* CV Reviewer & Demo Mode Banner */}
      {onOpenLogin && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#F5B23D]/15 via-[#151E31] to-[#070A14] border border-[#F5B23D]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-black/20 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F5B23D]/20 text-[#F5B23D] flex items-center justify-center shrink-0 border border-[#F5B23D]/30">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-[#EEF1F7]">
                  وضع المعاينة والتقييم لمراجعي الـ CV (Portfolio & Dev Mode)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F5B23D]/20 text-[#F5B23D] text-[10px] font-mono font-bold">
                  DEV MODE
                </span>
              </div>
              <p className="text-[11px] text-[#8892A6] mt-0.5 leading-relaxed">
                هل ترغب في تجربة لوحة تحكم الـ ATS وإدارة خط التوظيف؟ يمكنك الدخول فوراً برمز OTP مباشر على الشاشة.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#F5B23D] hover:bg-[#e5a432] text-[#070A14] text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Lock size={13} />
            <span>تجربة لوحة تحكم الـ HR</span>
            <ArrowRight size={13} className={isRtl ? 'rotate-180' : ''} />
          </button>
        </div>
      )}

      {/* 1. Hero & Search */}
      <CareersHero search={search} totalJobs={allJobsCount} onSearchChange={setSearch} />

      {/* 2. Job Listings Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 animate-pulse flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin text-indigo-400" />
          <span>جاري تحميل الوظائف الشاغرة...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          لا توجد وظائف مطابقة للبحث حالياً
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <PublicJobCard
              key={job.id}
              job={job}
              isOpening={fetchingJobId === job.id}
              onApply={handleOpenApply}
              onViewDetails={(j) => setJobForDetails(j)}
            />
          ))}
        </div>
      )}

      {/* 3. Modal: Job Details (Public View with Apply CTA) */}
      <JobDetailModal
        job={jobForDetails}
        isOpen={Boolean(jobForDetails)}
        onClose={() => setJobForDetails(null)}
        onApply={(j) => {
          setJobForDetails(null);
          handleOpenApply(j);
        }}
      />

      {/* 4. Modal: Dynamic Job Application Form */}
      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};
