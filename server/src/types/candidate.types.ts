export type CandidateStatus = 'PENDING' | 'IN_PROGRESS' | 'REJECTED' | 'HIRED';

export interface ApplicantData {
  [fieldId: string]: string | number | boolean | string[] | null | undefined;
}

export interface CandidateResponse {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone?: string | null;
  resumeUrl?: string | null;
  applicantData: ApplicantData;
  currentStage: string;
  status: CandidateStatus;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
