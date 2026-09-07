import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { Candidate, PipelineStage, ScheduledInterview, InterviewModality, StageType, Job, StageTask } from '../types/ats';
import { API_BASE_URL } from '../config/api';

export const stageSchema = z.object({
  name: z.string().min(2, 'Stage name must be at least 2 characters'),
  isInterview: z.boolean(),
  defaultModality: z.enum(['ONLINE', 'OFFLINE']),
  color: z.string(),
});

export type StageFormValues = z.infer<typeof stageSchema>;

export const scheduleSchema = z.object({
  includeInterview: z.boolean().default(false),
  date: z.string().optional(),
  time: z.string().optional(),
  durationMinutes: z.coerce.number().default(45),
  modality: z.enum(['ONLINE', 'OFFLINE']).default('ONLINE'),
  locationOrLink: z.string().optional(),
  interviewerName: z.string().optional(),
  notes: z.string().optional(),

  includeTask: z.boolean().default(false),
  taskTitle: z.string().optional(),
  taskDescription: z.string().optional(),
  taskUrl: z.string().optional(),
  taskDeadline: z.string().optional(),

  stageNotes: z.string().optional(),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export const REJECTION_PRESETS = [
  'عدم تطابق سنوات الخبرة مع متطلبات الوظيفة الشاغرة',
  'عدم توافق المهارات التقنية المطلوبة مع متطلبات الدور الوظيفي',
  'تم الاكتفاء بالعدد المطلوب وتفضيل مرشحين أقرب لمتطلبات الدور',
  'الراتب والتعويضات المتوقعة تتجاوز الميزانية المحددة للوظيفة',
  'عدم اجتياز التقييم الفني أو أسئلة المقابلة بنجاح',
];

export function usePipeline(token: string | null) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Drag & Drop State
  const [dragType, setDragType] = useState<'CANDIDATE' | 'STAGE' | null>(null);
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);
  const [draggedStageIndex, setDraggedStageIndex] = useState<number | null>(null);
  const [dragOverStageIndex, setDragOverStageIndex] = useState<number | null>(null);

  // Modals
  const [isAddStageOpen, setIsAddStageOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
  const [deletingStage, setDeletingStage] = useState<{ stage: PipelineStage; candidatesCount: number } | null>(null);
  const [schedulingCandidate, setSchedulingCandidate] = useState<{
    candidate: Candidate;
    targetStage: PipelineStage;
    isEditing?: boolean;
  } | null>(null);

  // Candidate Details Modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Reject Candidate Modal State
  const [rejectingCandidate, setRejectingCandidate] = useState<Candidate | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [sendRejectionEmail, setSendRejectionEmail] = useState<boolean>(true);
  const [isSubmittingRejection, setIsSubmittingRejection] = useState<boolean>(false);

  // Delete Candidate Modal State
  const [deletingCandidate, setDeletingCandidate] = useState<Candidate | null>(null);
  const [isDeletingCandidate, setIsDeletingCandidate] = useState<boolean>(false);

  // Delete Job Modal State
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeletingJob, setIsDeletingJob] = useState<boolean>(false);

  // State for Edit Stage Form
  const [editName, setEditName] = useState('');
  const [editIsInterview, setEditIsInterview] = useState(true);
  const [editDefaultModality, setEditDefaultModality] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [editColor, setEditColor] = useState('#6366f1');

  // Form: Add Stage
  const stageForm = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: '',
      isInterview: true,
      defaultModality: 'ONLINE',
      color: '#6366f1',
    },
  });

  // Form: Schedule Interview
  const scheduleForm = useForm<any>({
    resolver: zodResolver(scheduleSchema) as any,
    defaultValues: {
      durationMinutes: 45,
      modality: 'ONLINE',
      locationOrLink: 'https://meet.google.com/hire-' + Math.random().toString(36).substring(7),
      interviewerName: 'Sarah Al-Ghamdi (HR Lead)',
      notes: '',
    },
  });

  // Fetch Jobs & Candidates from PostgreSQL
  const fetchData = async (targetJobId?: string) => {
    setLoading(true);
    try {
      const jobsRes = await fetch(`${API_BASE_URL}/public/jobs`);
      const jobsData = await jobsRes.json();

      if (jobsData.success && jobsData.data.length > 0) {
        setJobs(jobsData.data);
        const savedJobId = localStorage.getItem('ats_selected_job_id');
        const currentJobId =
          targetJobId ||
          (savedJobId && jobsData.data.some((j: Job) => j.id === savedJobId)
            ? savedJobId
            : selectedJobId || jobsData.data[0].id);

        setSelectedJobId(currentJobId);
        localStorage.setItem('ats_selected_job_id', currentJobId);

        const currentJob = jobsData.data.find((j: Job) => j.id === currentJobId) || jobsData.data[0];
        setStages(currentJob.pipelineStages || []);

        const candidatesRes = await fetch(
          `${API_BASE_URL}/candidates?jobId=${currentJob.id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const candidatesData = await candidatesRes.json();

        if (candidatesData.success && candidatesData.data) {
          setCandidates(candidatesData.data);
        }
      }
    } catch (err) {
      console.warn('Error fetching live data from PostgreSQL:', err);
      toast.error('Failed to sync live candidates from PostgreSQL');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Job selection
  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    localStorage.setItem('ats_selected_job_id', jobId);
    fetchData(jobId);
  };

  // Stage transition execution
  const executeStageTransition = async (
    candidateId: string,
    targetStageId: string,
    status: string,
    scheduledInterview?: ScheduledInterview,
    stageTask?: StageTask,
    stageNotes?: string,
    customSuccessMessage?: string
  ) => {
    const toastId = toast.loading('Saving candidate updates to PostgreSQL...');

    try {
      const res = await fetch(`${API_BASE_URL}/candidates/${candidateId}/stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentStage: targetStageId,
          status,
          scheduledInterview,
          stageTask,
          stageNotes,
        }),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === candidateId
              ? {
                  ...c,
                  currentStage: targetStageId,
                  status: status as any,
                  scheduledInterview: scheduledInterview || c.scheduledInterview,
                  stageTask: stageTask || c.stageTask,
                  stageNotes: stageNotes || c.stageNotes,
                }
              : c
          )
        );

        if (selectedCandidate && selectedCandidate.id === candidateId) {
          setSelectedCandidate((prev) =>
            prev
              ? {
                  ...prev,
                  currentStage: targetStageId,
                  status: status as any,
                  scheduledInterview: scheduledInterview || prev.scheduledInterview,
                  stageTask: stageTask || prev.stageTask,
                  stageNotes: stageNotes || prev.stageNotes,
                }
              : null
          );
        }

        toast.success(customSuccessMessage || 'Candidate moved and notification dispatched!', { id: toastId });
      } else {
        toast.error(resJson.message || 'Error updating candidate stage', { id: toastId });
      }
    } catch {
      toast.error('Network error communicating with server', { id: toastId });
    }
  };

  // Move candidate with stage modal (interview, task details, and notes)
  const handleMoveCandidateToStage = (candidate: Candidate, targetStageId: string) => {
    if (candidate.currentStage === targetStageId) return;

    const targetStage = stages.find((s) => s.id === targetStageId);
    if (!targetStage) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    const isInterview = !!(targetStage.requiresScheduling || targetStage.stageType === 'INTERVIEW');
    const isTaskStage = !!(
      targetStage.defaultTask ||
      targetStage.stageType === 'TECHNICAL' ||
      targetStage.name.toLowerCase().includes('task') ||
      targetStage.name.toLowerCase().includes('challenge') ||
      targetStage.name.toLowerCase().includes('assessment') ||
      targetStage.name.includes('تاسك') ||
      targetStage.name.includes('تحدي') ||
      targetStage.name.includes('اختبار') ||
      targetStage.name.includes('مشروع')
    );

    setSchedulingCandidate({ candidate, targetStage });
    scheduleForm.reset({
      includeInterview: isInterview,
      date: defaultDate,
      time: '11:00',
      durationMinutes: 45,
      modality: targetStage.defaultModality || 'ONLINE',
      locationOrLink:
        (targetStage.defaultModality || 'ONLINE') === 'ONLINE'
          ? 'https://meet.google.com/hire-' + Math.random().toString(36).substring(7)
          : 'Riyadh HQ - Meeting Room Alpha',
      interviewerName: 'Sarah Al-Ghamdi (HR Lead)',
      notes: '',
      includeTask: isTaskStage,
      taskTitle: targetStage.defaultTask?.title || (isTaskStage ? `تاسك مرحلة: ${targetStage.name}` : ''),
      taskDescription: targetStage.defaultTask?.description || '',
      taskUrl: targetStage.defaultTask?.taskUrl || '',
      taskDeadline: targetStage.defaultTask?.deadline || '',
      stageNotes: targetStage.defaultNotes || '',
    });
  };

  // Save reordered stages
  const saveReorderedStages = async (newStages: PipelineStage[]) => {
    if (!selectedJobId) return;
    setStages(newStages);
    const toastId = toast.loading('Saving updated stage sequence to PostgreSQL...');
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/stages`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ stages: newStages }),
      });
      const resJson = await res.json();
      if (resJson.success) {
        toast.success('Stage order reordered and saved in PostgreSQL!', { id: toastId });
      } else {
        toast.error(resJson.message || 'Failed to save stage order', { id: toastId });
      }
    } catch {
      toast.error('Network error saving stage order', { id: toastId });
    }
  };

  // Shift stage left or right
  const handleShiftStage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= stages.length || fromIdx === toIdx) return;
    const newStages = [...stages];
    const [moved] = newStages.splice(fromIdx, 1);
    newStages.splice(toIdx, 0, moved);
    const reordered = newStages.map((s, i) => ({ ...s, order: i + 1 }));
    saveReorderedStages(reordered);
  };

  // Open Edit Stage
  const handleOpenEditStage = (stage: PipelineStage) => {
    setEditingStage(stage);
    setEditName(stage.name);
    setEditIsInterview(stage.requiresScheduling || stage.stageType === 'INTERVIEW');
    setEditDefaultModality(stage.defaultModality || 'ONLINE');
    setEditColor(stage.color || '#6366f1');
  };

  // Save Edit Stage
  const handleSaveStageEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage || !selectedJobId) return;
    if (!editName.trim()) {
      toast.error('Stage name cannot be empty');
      return;
    }

    const updatedStages: PipelineStage[] = stages.map((s) => {
      if (s.id !== editingStage.id) return s;
      const targetType: StageType = editIsInterview ? 'INTERVIEW' : 'SCREENING';
      return {
        ...s,
        name: editName.trim(),
        color: editColor,
        stageType: targetType,
        requiresScheduling: editIsInterview,
        defaultModality: editIsInterview ? editDefaultModality : undefined,
      };
    });

    const toastId = toast.loading('Saving stage updates to PostgreSQL...');
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/stages`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ stages: updatedStages }),
      });
      const resJson = await res.json();
      if (resJson.success) {
        setStages(updatedStages);
        setEditingStage(null);
        toast.success(`Stage "${editName.trim()}" updated in PostgreSQL!`, { id: toastId });
      } else {
        toast.error(resJson.message || 'Error updating stage', { id: toastId });
      }
    } catch {
      toast.error('Network error updating stage', { id: toastId });
    }
  };

  // Open Delete Stage Confirmation
  const handleOpenDeleteStage = (stage: PipelineStage, candidatesCount: number) => {
    if (stages.length <= 1) {
      toast.error('A job pipeline must have at least one stage. You cannot delete the only stage.');
      return;
    }
    setDeletingStage({ stage, candidatesCount });
  };

  // Confirm Delete Stage
  const handleConfirmDeleteStage = async () => {
    if (!deletingStage || !selectedJobId) return;
    const { stage } = deletingStage;

    const toastId = toast.loading(`Deleting stage "${stage.name}" and migrating candidates...`);
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/stages/${stage.id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const resJson = await res.json();
      if (resJson.success) {
        const remainingStages = stages.filter((s) => s.id !== stage.id);
        const fallbackStage = remainingStages[0];

        setStages(remainingStages);

        setCandidates((prev) =>
          prev.map((c) => (c.currentStage === stage.id ? { ...c, currentStage: fallbackStage.id } : c))
        );

        setDeletingStage(null);
        toast.success(`Stage "${stage.name}" deleted! Any candidates were moved safely to "${fallbackStage.name}"`, {
          id: toastId,
        });
      } else {
        toast.error(resJson.message || 'Failed to delete stage', { id: toastId });
      }
    } catch {
      toast.error('Network error deleting stage from PostgreSQL', { id: toastId });
    }
  };

  // Add Custom Stage
  const onAddCustomStage = async (data: StageFormValues) => {
    if (!selectedJobId) return;

    const newStage: PipelineStage = {
      id: `stage_${Date.now()}`,
      name: data.name.trim(),
      order: stages.length + 1,
      color: data.color,
      stageType: data.isInterview ? 'INTERVIEW' : 'SCREENING',
      defaultModality: data.isInterview ? (data.defaultModality as InterviewModality) : undefined,
      requiresScheduling: data.isInterview,
      emailNotification: {
        enabled: true,
        subject: `Stage Update: ${data.name}`,
        bodyTemplate: `Hi {{candidate_name}}, your application has advanced to ${data.name}.`,
      },
    };

    const toastId = toast.loading('Saving new stage to PostgreSQL...');

    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/stages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newStage),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setStages((prev) => [...prev, newStage]);
        setIsAddStageOpen(false);
        stageForm.reset();
        toast.success(`Created stage "${data.name}" and saved to PostgreSQL!`, { id: toastId });
      } else {
        toast.error(resJson.message || 'Error saving custom stage', { id: toastId });
      }
    } catch {
      toast.error('Network error saving stage to database', { id: toastId });
    }
  };

  // Confirm Rejection
  const onConfirmRejection = async () => {
    if (!rejectingCandidate) return;
    if (!rejectionReason.trim()) {
      toast.error('يرجى كتابة سبب الرفض احتراماً لوقت وجهد المتقدم');
      return;
    }

    setIsSubmittingRejection(true);
    const toastId = toast.loading('جاري حفظ سبب الرفض وإرسال التغذية الراجعة للمتقدم...');

    try {
      const res = await fetch(`${API_BASE_URL}/candidates/${rejectingCandidate.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          rejectionReason: rejectionReason.trim(),
          sendEmail: sendRejectionEmail,
        }),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === rejectingCandidate.id
              ? {
                  ...c,
                  status: 'REJECTED',
                  rejectionReason: rejectionReason.trim(),
                }
              : c
          )
        );

        if (selectedCandidate && selectedCandidate.id === rejectingCandidate.id) {
          setSelectedCandidate((prev) =>
            prev
              ? {
                  ...prev,
                  status: 'REJECTED',
                  rejectionReason: rejectionReason.trim(),
                }
              : null
          );
        }

        toast.success(`تم استبعاد المتقدم وإرسال التغذية الراجعة إلى بريده الإلكتروني`, { id: toastId });
        setRejectingCandidate(null);
        setRejectionReason('');
      } else {
        toast.error(resJson.message || 'فشل حفظ سبب الرفض', { id: toastId });
      }
    } catch {
      toast.error('خطأ في الاتصال بالخادم', { id: toastId });
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  // Undo / Revert Rejection
  const handleUnrejectCandidate = async (candidate: Candidate) => {
    const toastId = toast.loading(`جاري إلغاء استبعاد ${candidate.name}...`);
    try {
      const res = await fetch(`${API_BASE_URL}/candidates/${candidate.id}/unreject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resJson = await res.json();
      if (resJson.success) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === candidate.id
              ? {
                  ...c,
                  status: 'IN_PROGRESS',
                  rejectionReason: undefined,
                }
              : c
          )
        );

        if (selectedCandidate && selectedCandidate.id === candidate.id) {
          setSelectedCandidate((prev) =>
            prev
              ? {
                  ...prev,
                  status: 'IN_PROGRESS',
                  rejectionReason: undefined,
                }
              : null
          );
        }

        toast.success(`تم التراجع عن استبعاد ${candidate.name} وإعادته للمراحل النشطة بنجاح!`, { id: toastId });
      } else {
        toast.error(resJson.message || 'فشل التراجع عن الاستبعاد', { id: toastId });
      }
    } catch {
      toast.error('خطأ في الاتصال بالخادم أثناء إلغاء الاستبعاد', { id: toastId });
    }
  };

  // Confirm Delete Candidate
  const handleConfirmDeleteCandidate = async () => {
    if (!deletingCandidate) return;
    const candidateId = deletingCandidate.id;
    const candidateName = deletingCandidate.name;
    setIsDeletingCandidate(true);
    const toastId = toast.loading(`جاري مسح المتقدم ${candidateName}...`);

    try {
      const res = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resJson = await res.json();
      if (resJson.success) {
        setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
        if (selectedCandidate && selectedCandidate.id === candidateId) {
          setSelectedCandidate(null);
        }
        setDeletingCandidate(null);
        toast.success(`تم حذف المتقدم "${candidateName}" بنجاح!`, { id: toastId });
      } else {
        toast.error(resJson.message || 'فشل حذف المتقدم', { id: toastId });
      }
    } catch {
      toast.error('خطأ في الاتصال بالخادم أثناء حذف المتقدم', { id: toastId });
    } finally {
      setIsDeletingCandidate(false);
    }
  };

  // Stage Transition Submit (Interview, Task, Notes)
  const onScheduleSubmit = (data: any) => {
    if (!schedulingCandidate) return;

    let interviewPayload: ScheduledInterview | undefined = undefined;
    if (data.includeInterview && data.date && data.time) {
      const dateObj = new Date(data.date);
      const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const dayOfWeek = days[dateObj.getDay()] || 'الموعد المحدد';

      interviewPayload = {
        date: data.date,
        dayOfWeek,
        time: data.time,
        durationMinutes: Number(data.durationMinutes) || 45,
        modality: data.modality || 'ONLINE',
        locationOrLink: data.locationOrLink || 'https://meet.google.com',
        interviewerName: data.interviewerName || 'فريق التوظيف',
        notes: data.notes,
      };
    }

    let taskPayload: StageTask | undefined = undefined;
    if (data.includeTask && (data.taskTitle || data.taskDescription || data.taskUrl || data.taskDeadline)) {
      taskPayload = {
        title: data.taskTitle,
        description: data.taskDescription || '',
        taskUrl: data.taskUrl,
        deadline: data.taskDeadline,
      };
    }

    const isEdit = schedulingCandidate.isEditing;

    executeStageTransition(
      schedulingCandidate.candidate.id,
      schedulingCandidate.targetStage.id,
      'IN_PROGRESS',
      interviewPayload,
      taskPayload,
      data.stageNotes || undefined,
      isEdit
        ? `تم تحديث تفاصيل ${schedulingCandidate.candidate.name} وإرسال إيميل التنبيه!`
        : `تم نقل المرشح وإرسال إيميل رسمي يحتوي على التفاصيل إلى ${schedulingCandidate.candidate.email}`
    );

    setSchedulingCandidate(null);
  };

  const handleMoveDirectlyWithoutSchedule = () => {
    if (!schedulingCandidate) return;
    const { candidate, targetStage } = schedulingCandidate;
    const isHiredStage =
      targetStage.stageType === 'OFFER' ||
      targetStage.name.toLowerCase().includes('hired') ||
      targetStage.name.includes('عرض') ||
      targetStage.name.includes('قبول');

    const nextStatus = isHiredStage ? 'HIRED' : 'IN_PROGRESS';
    executeStageTransition(
      candidate.id,
      targetStage.id,
      nextStatus,
      undefined,
      undefined,
      undefined,
      `تم نقل ${candidate.name} إلى مرحلة ${targetStage.name} وإرسال إيميل التحديث بنجاح!`
    );
    setSchedulingCandidate(null);
  };

  const handleConfirmDeleteJob = async () => {
    if (!jobToDelete) return;
    setIsDeletingJob(true);
    const toastId = toast.loading(`Deleting job "${jobToDelete.title}"...`);

    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobToDelete.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const resJson = await res.json();

      if (resJson.success) {
        toast.success(`Job "${jobToDelete.title}" deleted successfully!`, { id: toastId });
        localStorage.removeItem('ats_selected_job_id');
        setJobToDelete(null);

        const remaining = jobs.filter((j) => j.id !== jobToDelete.id);
        if (remaining.length > 0) {
          fetchData(remaining[0].id);
        } else {
          fetchData();
        }
      } else {
        toast.error(resJson.message || 'Failed to delete job', { id: toastId });
      }
    } catch {
      toast.error('Network error while deleting job position', { id: toastId });
    } finally {
      setIsDeletingJob(false);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  return {
    jobs,
    selectedJob,
    selectedJobId,
    handleSelectJob,
    stages,
    candidates,
    loading,
    fetchData,
    // Drag & Drop
    dragType,
    setDragType,
    draggedCandidateId,
    setDraggedCandidateId,
    dragOverStageId,
    setDragOverStageId,
    draggedStageIndex,
    setDraggedStageIndex,
    dragOverStageIndex,
    setDragOverStageIndex,
    handleShiftStage,
    handleMoveCandidateToStage,
    // Modals
    isAddStageOpen,
    setIsAddStageOpen,
    stageForm,
    onAddCustomStage,
    editingStage,
    setEditingStage,
    editName,
    setEditName,
    editIsInterview,
    setEditIsInterview,
    editDefaultModality,
    setEditDefaultModality,
    editColor,
    setEditColor,
    handleOpenEditStage,
    handleSaveStageEdit,
    deletingStage,
    setDeletingStage,
    handleOpenDeleteStage,
    handleConfirmDeleteStage,
    schedulingCandidate,
    setSchedulingCandidate,
    scheduleForm,
    onScheduleSubmit,
    handleMoveDirectlyWithoutSchedule,
    rejectingCandidate,
    setRejectingCandidate,
    rejectionReason,
    setRejectionReason,
    sendRejectionEmail,
    setSendRejectionEmail,
    isSubmittingRejection,
    onConfirmRejection,
    handleUnrejectCandidate,
    deletingCandidate,
    setDeletingCandidate,
    isDeletingCandidate,
    handleConfirmDeleteCandidate,
    jobToDelete,
    setJobToDelete,
    isDeletingJob,
    handleConfirmDeleteJob,
    selectedCandidate,
    setSelectedCandidate,
  };
}
