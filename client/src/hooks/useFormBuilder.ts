import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { FormField, FieldType, Job } from '../types/ats';
import { API_BASE_URL } from '../config/api';
import { queryKeys } from '../config/queryKeys';

export const newFieldSchema = z.object({
  label: z.string().min(2, 'Question label must be at least 2 characters'),
  type: z.enum(['text', 'number', 'email', 'textarea', 'select', 'file', 'checkbox']),
  required: z.boolean(),
});

export type NewFieldFormValues = z.infer<typeof newFieldSchema>;

export const DEFAULT_FIELDS: FormField[] = [
  { id: 'full_name', label: 'Full Legal Name', type: 'text', required: true, order: 1 },
  { id: 'email', label: 'Work Email Address', type: 'email', required: true, order: 2 },
  { id: 'phone', label: 'Phone Number', type: 'text', required: false, order: 3 },
  { id: 'years_experience', label: 'Total Years of Experience', type: 'number', required: true, order: 4 },
  {
    id: 'english_proficiency',
    label: 'English Proficiency',
    type: 'select',
    required: true,
    options: ['Conversational', 'Professional Working', 'Full Professional / Fluent'],
    order: 5,
  },
  { id: 'resume_file', label: 'Resume / CV (PDF)', type: 'file', required: true, order: 6 },
  { id: 'github_portfolio', label: 'GitHub or Portfolio Link', type: 'text', required: false, order: 7 },
];

export function useFormBuilder() {
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [fields, setFields] = useState<FormField[]>(DEFAULT_FIELDS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Field Edit Modal State
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [newOptionText, setNewOptionText] = useState<string>('');

  // Drag and Drop States
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Cached Jobs for Form Builder
  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: queryKeys.jobs.public,
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/public/jobs`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  });

  // Sync initial selected job and fields when jobs load
  useEffect(() => {
    if (jobs.length > 0) {
      const savedJobId = localStorage.getItem('ats_builder_job_id');
      const initialJob =
        (savedJobId && jobs.find((j: Job) => j.id === savedJobId)) || jobs[0];

      if (!selectedJobId || !jobs.some((j) => j.id === selectedJobId)) {
        setSelectedJobId(initialJob.id);
        if (initialJob.formFields && initialJob.formFields.length > 0) {
          setFields(initialJob.formFields);
        }
      }
    }
  }, [jobs, selectedJobId]);

  const handleSelectJob = async (jobId: string) => {
    setSelectedJobId(jobId);
    localStorage.setItem('ats_builder_job_id', jobId);

    try {
      const res = await fetch(`${API_BASE_URL}/public/jobs/${jobId}`);
      const data = await res.json();
      if (data.success && data.data) {
        const job = data.data;
        if (job.formFields && job.formFields.length > 0) {
          setFields(job.formFields);
          setHasUnsavedChanges(false);
          return;
        }
      }
    } catch {
      // fallback
    }

    const job = jobs.find((j) => j.id === jobId);
    if (job && job.formFields && job.formFields.length > 0) {
      setFields(job.formFields);
    } else {
      setFields(DEFAULT_FIELDS);
    }
    setHasUnsavedChanges(false);
  };

  const newFieldForm = useForm<NewFieldFormValues>({
    resolver: zodResolver(newFieldSchema),
    defaultValues: {
      label: '',
      type: 'text',
      required: false,
    },
  });

  // Persist form fields to PostgreSQL and sync jobs state
  const persistFields = async (updatedFields: FormField[], jobId: string) => {
    if (!jobId) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('ats_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/form-fields`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ formFields: updatedFields }),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setHasUnsavedChanges(false);
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.public });
      }
    } catch (err) {
      console.warn('Error saving form layout to database:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const onAddField = (data: NewFieldFormValues) => {
    const id =
      data.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') +
      '_' +
      Date.now().toString().slice(-4);

    const newField: FormField = {
      id,
      label: data.label.trim(),
      type: data.type as FieldType,
      required: data.required,
      order: fields.length + 1,
      options: data.type === 'select' ? ['Option A', 'Option B', 'Option C'] : undefined,
    };

    const updated = [...fields, newField];
    setFields(updated);
    persistFields(updated, selectedJobId);
    toast.success(`Added question: "${data.label}" (Saved to database)`);
    newFieldForm.reset();
  };

  const handleRemoveField = (id: string, label: string) => {
    const updated = fields.filter((f) => f.id !== id).map((f, idx) => ({ ...f, order: idx + 1 }));
    setFields(updated);
    persistFields(updated, selectedJobId);
    toast.info(`Removed question: "${label}" (Saved to database)`);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }

    const updated = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const reordered = updated.map((f, i) => ({ ...f, order: i + 1 }));
    setFields(reordered);
    persistFields(reordered, selectedJobId);
  };

  // Drag & drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...fields];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);

    const reordered = updated.map((f, i) => ({ ...f, order: i + 1 }));
    setFields(reordered);
    persistFields(reordered, selectedJobId);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Edit field handlers
  const handleStartEditField = (field: FormField) => {
    setEditingField({
      ...field,
      options: field.options
        ? [...field.options]
        : field.type === 'select'
        ? ['Option 1', 'Option 2']
        : undefined,
    });
    setNewOptionText('');
  };

  const handleSaveEditedField = async () => {
    if (!editingField) return;

    if (!editingField.label.trim()) {
      toast.error('Question label cannot be empty');
      return;
    }

    if (
      editingField.type === 'select' &&
      (!editingField.options || editingField.options.length === 0)
    ) {
      toast.error('Select questions must have at least one option');
      return;
    }

    const updated = fields.map((f) =>
      f.id === editingField.id
        ? {
            ...editingField,
            label: editingField.label.trim(),
          }
        : f
    );

    setFields(updated);
    setEditingField(null);
    const toastId = toast.loading('Saving updated question to PostgreSQL...');
    await persistFields(updated, selectedJobId);
    toast.success(`Question "${editingField.label}" updated & synced!`, { id: toastId });
  };

  const handleAddOptionToEditing = () => {
    if (!newOptionText.trim() || !editingField) return;
    const currentOptions = editingField.options || [];
    setEditingField({
      ...editingField,
      options: [...currentOptions, newOptionText.trim()],
    });
    setNewOptionText('');
  };

  const handleRemoveOptionFromEditing = (indexToRemove: number) => {
    if (!editingField || !editingField.options) return;
    setEditingField({
      ...editingField,
      options: editingField.options.filter((_, idx) => idx !== indexToRemove),
    });
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  return {
    jobs,
    selectedJob,
    selectedJobId,
    handleSelectJob,
    fields,
    hasUnsavedChanges,
    isSaving,
    persistFields,
    newFieldForm,
    onAddField,
    handleRemoveField,
    handleMoveField,
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    editingField,
    setEditingField,
    handleStartEditField,
    handleSaveEditedField,
    newOptionText,
    setNewOptionText,
    handleAddOptionToEditing,
    handleRemoveOptionFromEditing,
  };
}
