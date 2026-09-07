import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { Job } from '../types/ats';
import { API_BASE_URL } from '../config/api';

export const createJobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  location: z.string().min(2, 'Location is required'),
  employmentType: z.string().min(2, 'Employment type is required'),
  description: z.string().min(10, 'Job description must be at least 10 characters'),
  status: z.enum(['PUBLISHED', 'DRAFT']),
});

export type CreateJobFormValues = z.infer<typeof createJobSchema>;

export function useJobs(onNavigate?: (tab: 'pipeline' | 'builder', jobId: string) => void) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const createJobForm = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: '',
      location: 'Riyadh, Saudi Arabia / Hybrid',
      employmentType: 'Full-time',
      description: '',
      status: 'PUBLISHED',
    },
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data);
      }
    } catch (err) {
      console.warn('Error fetching jobs:', err);
      toast.error('Failed to load active job postings from PostgreSQL');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onCreateJob = async (data: CreateJobFormValues) => {
    const toastId = toast.loading('Creating job position in PostgreSQL...');
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        toast.success(`Job "${data.title}" created successfully!`, {
          id: toastId,
          description: 'Custom pipeline & dynamic application form are now initialized.',
        });
        setIsCreateModalOpen(false);
        createJobForm.reset();
        fetchJobs();
      } else {
        toast.error(resJson.message || 'Error creating job position', { id: toastId });
      }
    } catch {
      toast.error('Network error connecting to ATS server', { id: toastId });
    }
  };

  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    const toastId = toast.loading(`Deleting job "${jobToDelete.title}"...`);

    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobToDelete.id}`, {
        method: 'DELETE',
      });
      const resJson = await res.json();

      if (resJson.success) {
        toast.success(`Job "${jobToDelete.title}" deleted successfully!`, { id: toastId });

        // If the deleted job was selected in localStorage, clear it
        if (localStorage.getItem('ats_selected_job_id') === jobToDelete.id) {
          localStorage.removeItem('ats_selected_job_id');
        }
        if (localStorage.getItem('ats_builder_job_id') === jobToDelete.id) {
          localStorage.removeItem('ats_builder_job_id');
        }

        setJobToDelete(null);
        fetchJobs();
      } else {
        toast.error(resJson.message || 'Failed to delete job', { id: toastId });
      }
    } catch {
      toast.error('Network error while deleting job position', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenPipeline = (jobId: string) => {
    localStorage.setItem('ats_selected_job_id', jobId);
    if (onNavigate) {
      onNavigate('pipeline', jobId);
    } else {
      window.location.reload();
    }
  };

  const handleOpenBuilder = (jobId: string) => {
    localStorage.setItem('ats_builder_job_id', jobId);
    if (onNavigate) {
      onNavigate('builder', jobId);
    } else {
      window.location.reload();
    }
  };

  return {
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
  };
}
