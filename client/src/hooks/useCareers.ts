import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Job } from '../types/ats';
import { API_BASE_URL } from '../config/api';
import { queryKeys } from '../config/queryKeys';

export function useCareers() {
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [fetchingJobId, setFetchingJobId] = useState<string | null>(null);

  // Cached Published Jobs
  const {
    data: jobs = [],
    isLoading: loading,
    refetch: fetchPublishedJobs,
  } = useQuery<Job[]>({
    queryKey: queryKeys.jobs.public,
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/public/jobs`);
      const resJson = await res.json();
      if (resJson.success && Array.isArray(resJson.data)) {
        return resJson.data;
      }
      return [];
    },
  });

  const handleOpenApply = async (job: Job) => {
    setFetchingJobId(job.id);
    try {
      const res = await fetch(`${API_BASE_URL}/public/jobs/${job.id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedJob(data.data);
      } else {
        setSelectedJob(job);
      }
    } catch {
      setSelectedJob(job);
    } finally {
      setFetchingJobId(null);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return {
    jobs: filteredJobs,
    allJobsCount: jobs.length,
    loading,
    search,
    setSearch,
    selectedJob,
    setSelectedJob,
    fetchingJobId,
    fetchPublishedJobs,
    handleOpenApply,
  };
}
