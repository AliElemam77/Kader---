export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'textarea'
  | 'select'
  | 'file'
  | 'checkbox';

export interface FormField {
  id: string;             // e.g. "years_of_experience", "github_profile"
  label: string;          // e.g. "Years of Experience"
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];     // Used for dropdown / select
  order: number;
}

export interface PipelineStage {
  id: string;             // e.g. "applied", "screening", "tech_test", "interview", "offer"
  name: string;           // e.g. "HR Screening"
  order: number;
  color?: string;         // e.g. "#4F46E5" for UI badges
  emailNotification?: {
    enabled: boolean;
    subject: string;
    bodyTemplate: string; // e.g. "Dear {{candidate_name}}, welcome to {{stage_name}}!"
  };
}
