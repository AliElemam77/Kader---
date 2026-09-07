import type { FC } from 'react';
import { Briefcase } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { JobsHeader } from './jobs/JobsHeader';
import { JobCardItem } from './jobs/JobCardItem';
import { CreateJobModal } from './jobs/CreateJobModal';

interface JobsPreviewProps {
  onNavigate?: (tab: 'pipeline' | 'builder', jobId: string) => void;
}

export const JobsPreview: FC<JobsPreviewProps> = ({ onNavigate }) => {
  const {
    jobs,
    loading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createJobForm,
    fetchJobs,
    onCreateJob,
    handleOpenPipeline,
    handleOpenBuilder,
  } = useJobs(onNavigate);

  return (
    <div className="space-y-6">
      <JobsHeader
        loading={loading}
        onRefresh={fetchJobs}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {loading && jobs.length === 0 ? (
        <div className="text-center py-20 text-slate-500 animate-pulse">
          Loading jobs from database...
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <Briefcase size={32} className="text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No job postings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Create Job Position" above to launch your first job opening.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCardItem
              key={job.id}
              job={job}
              onOpenPipeline={handleOpenPipeline}
              onOpenBuilder={handleOpenBuilder}
            />
          ))}
        </div>
      )}

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        form={createJobForm}
        onSubmit={onCreateJob}
      />
    </div>
  );
};
