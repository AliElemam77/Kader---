import { useState, type FC } from 'react';
import { Briefcase } from 'lucide-react';
import type { Job } from '../types/ats';
import { useJobs } from '../hooks/useJobs';
import { JobsHeader } from './jobs/JobsHeader';
import { JobCardItem } from './jobs/JobCardItem';
import { CreateJobModal } from './jobs/CreateJobModal';
import { DeleteJobModal } from './jobs/DeleteJobModal';
import { JobDetailModal } from './jobs/JobDetailModal';

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
    jobToDelete,
    setJobToDelete,
    isDeleting,
    confirmDeleteJob,
    handleOpenPipeline,
    handleOpenBuilder,
  } = useJobs(onNavigate);

  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);

  return (
    <div className="space-y-6">
      <JobsHeader
        loading={loading}
        onRefresh={fetchJobs}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {loading && jobs.length === 0 ? (
        <div className="text-center py-20 text-[#8892A6] animate-pulse font-mono text-sm">
          Loading jobs from database...
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-[#0E1524]/60 border border-dashed border-white/[0.08] rounded-3xl space-y-3">
          <Briefcase size={32} className="text-[#8892A6] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[#EEF1F7]">No job postings found</h3>
          <p className="text-xs text-[#8892A6] max-w-sm mx-auto">
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
              onViewDetails={(j) => setSelectedJobForDetails(j)}
              onDeleteClick={(j) => setJobToDelete(j)}
            />
          ))}
        </div>
      )}

      {/* Modal: Create Job */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        form={createJobForm}
        onSubmit={onCreateJob}
      />

      {/* Modal: View Job Details */}
      <JobDetailModal
        job={selectedJobForDetails}
        isOpen={Boolean(selectedJobForDetails)}
        onClose={() => setSelectedJobForDetails(null)}
        onOpenPipeline={handleOpenPipeline}
        onOpenBuilder={handleOpenBuilder}
        onDeleteClick={(j) => {
          setSelectedJobForDetails(null);
          setJobToDelete(j);
        }}
      />

      {/* Modal: Confirm Delete Job */}
      <DeleteJobModal
        job={jobToDelete}
        isOpen={Boolean(jobToDelete)}
        isLoading={isDeleting}
        onClose={() => setJobToDelete(null)}
        onConfirm={confirmDeleteJob}
      />
    </div>
  );
};
