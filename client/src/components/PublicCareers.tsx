import { useState, type FC } from 'react';
import { Loader2 } from 'lucide-react';
import type { Job } from '../types/ats';
import { useCareers } from '../hooks/useCareers';
import { CareersHero } from './careers/CareersHero';
import { PublicJobCard } from './careers/PublicJobCard';
import { JobApplicationModal } from './careers/JobApplicationModal';
import { JobDetailModal } from './jobs/JobDetailModal';

export const PublicCareers: FC = () => {
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
    <div className="space-y-10">
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
