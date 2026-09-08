import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Job } from '../types/ats';
import { API_BASE_URL } from '../config/api';
import { queryKeys } from '../config/queryKeys';

export const createJobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  location: z.string().min(2, 'Location is required'),
  employmentType: z.string().min(2, 'Employment type is required'),
  description: z.string().min(10, 'Job description must be at least 10 characters'),
  status: z.enum(['PUBLISHED', 'DRAFT']),
});

export type CreateJobFormValues = z.infer<typeof createJobSchema>;

export function useJobs(onNavigate?: (tab: 'pipeline' | 'builder', jobId: string) => void) {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

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

  // Cached Jobs Query: Instant retrieval from memory on tab switch
  const { data: jobs = [], isLoading: loading, refetch: fetchJobs } = useQuery<Job[]>({
    queryKey: queryKeys.jobs.all,
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/jobs`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  });

  // Create Job Mutation with automatic cache invalidation
  const createJobMutation = useMutation({
    mutationFn: async (data: CreateJobFormValues) => {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();
      if (!resJson.success) throw new Error(resJson.message || 'Error creating job position');
      return resJson.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Job "${variables.title}" created successfully!`, {
        description: 'Custom pipeline & dynamic application form are now initialized.',
      });
      setIsCreateModalOpen(false);
      createJobForm.reset();
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.public });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Network error connecting to ATS server');
    },
  });

  // Delete Job Mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
      });
      const resJson = await res.json();
      if (!resJson.success) throw new Error(resJson.message || 'Failed to delete job');
      return resJson;
    },
    onSuccess: (_, jobId) => {
      toast.success(`Job deleted successfully!`);
      if (localStorage.getItem('ats_selected_job_id') === jobId) {
        localStorage.removeItem('ats_selected_job_id');
      }
      if (localStorage.getItem('ats_builder_job_id') === jobId) {
        localStorage.removeItem('ats_builder_job_id');
      }
      setJobToDelete(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.public });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Network error while deleting job position');
    },
  });

  const onCreateJob = async (data: CreateJobFormValues) => {
    createJobMutation.mutate(data);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    deleteJobMutation.mutate(jobToDelete.id);
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
    isDeleting: deleteJobMutation.isPending,
    confirmDeleteJob,
    handleOpenPipeline,
    handleOpenBuilder,
  };
}
