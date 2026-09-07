export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'textarea'
  | 'select'
  | 'file'
  | 'checkbox';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  order: number;
}

export type StageType = 'SCREENING' | 'INTERVIEW' | 'TECHNICAL' | 'OFFER' | 'CUSTOM';
export type InterviewModality = 'ONLINE' | 'OFFLINE';

export interface ScheduledInterview {
  date: string;            // e.g. "2026-10-14"
  dayOfWeek: string;       // e.g. "Wednesday"
  time: string;            // e.g. "14:30"
  durationMinutes: number; // e.g. 45
  modality: InterviewModality; // 'ONLINE' | 'OFFLINE'
  locationOrLink: string;  // e.g. "https://meet.google.com/xyz" or "HQ - Meeting Room 3"
  interviewerName: string;
  notes?: string;
}

export interface StageTask {
  title?: string;
  description: string;
  taskUrl?: string;
  deadline?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color?: string;
  stageType?: StageType;
  defaultModality?: InterviewModality;
  requiresScheduling?: boolean;
  defaultTask?: StageTask;
  defaultNotes?: string;
  emailNotification?: {
    enabled: boolean;
    subject: string;
    bodyTemplate: string;
  };
}

export type CandidateStatus = 'PENDING' | 'IN_PROGRESS' | 'REJECTED' | 'HIRED';

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  applicantData: Record<string, any>;
  currentStage: string;
  status: CandidateStatus;
  rejectionReason?: string;
  createdAt: string;
  scheduledInterview?: ScheduledInterview;
  stageTask?: StageTask;
  stageNotes?: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  employmentType?: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'CLOSED';
  formFields: FormField[];
  pipelineStages: PipelineStage[];
  candidatesCount?: number;
}
