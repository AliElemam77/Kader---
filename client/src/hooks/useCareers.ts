import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Job } from '../types/ats';
import { API_BASE_URL } from '../config/api';

export function useCareers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [fetchingJobId, setFetchingJobId] = useState<string | null>(null);

  const fetchPublishedJobs = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/public/jobs`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setJobs(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch jobs:', err);
        toast.error('Failed to load published jobs');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPublishedJobs();
  }, []);

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
