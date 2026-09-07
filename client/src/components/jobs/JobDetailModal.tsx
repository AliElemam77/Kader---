import { useState, type FC } from 'react';
import {
  X,
  Building2,
  MapPin,
  Clock,
  Users,
  Layers,
  Sliders,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import type { Job, PipelineStage, FormField } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'sonner';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPipeline?: (jobId: string) => void;
  onOpenBuilder?: (jobId: string) => void;
  onDeleteClick?: (job: Job) => void;
  onApply?: (job: Job) => void;
}

export const JobDetailModal: FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onOpenPipeline,
  onOpenBuilder,
  onDeleteClick,
  onApply,
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !job) return null;

  const isAr = language === 'ar';
  const isPublished = job.status === 'PUBLISHED';
  
  let stages: PipelineStage[] = [];
  try {
    stages = Array.isArray(job.pipelineStages)
      ? job.pipelineStages
      : typeof job.pipelineStages === 'string'
      ? JSON.parse(job.pipelineStages || '[]')
      : [];
  } catch {
    stages = [];
  }

  let fields: FormField[] = [];
  try {
    fields = Array.isArray(job.formFields)
      ? job.formFields
      : typeof job.formFields === 'string'
      ? JSON.parse(job.formFields || '[]')
      : [];
  } catch {
    fields = [];
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?job=${job.slug || job.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success(isAr ? 'تم نسخ رابط التقديم للوظيفة!' : 'Job application link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0E1524] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Job Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-white/[0.08]">
          <div className="w-14 h-14 rounded-2xl bg-[#F5B23D]/10 border border-[#F5B23D]/25 text-[#F5B23D] flex items-center justify-center shrink-0">
            <Briefcase size={26} />
          </div>

          <div className="space-y-1.5 flex-1 pr-6">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">
                {job.title}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  isPublished
                    ? 'bg-[#35D6A4]/10 text-[#35D6A4] border-[#35D6A4]/20'
                    : 'bg-[#F5B23D]/10 text-[#F5B23D] border-[#F5B23D]/20'
                }`}
              >
                {isPublished ? (isAr ? 'منشور للعامة' : 'Published') : (isAr ? 'مسودة داخلية' : 'Draft')}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#8892A6] flex-wrap">
              {job.department && (
                <span className="flex items-center gap-1">
                  <Building2 size={13} className="text-[#4C8DFF]" />
                  <span>{job.department}</span>
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#F5B23D]" />
                  <span>{job.location}</span>
                </span>
              )}
              {job.employmentType && (
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-[#5A6478]" />
                  <span>{job.employmentType}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick KPI Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#151E31] border border-white/[0.08] text-center">
            <div className="text-[11px] text-[#8892A6] font-medium mb-1 flex items-center justify-center gap-1">
              <Users size={12} className="text-[#4C8DFF]" />
              <span>{isAr ? 'المرشحين' : 'Candidates'}</span>
            </div>
            <div className="text-lg font-bold font-mono text-[#EEF1F7]">
              {job.candidatesCount || 0}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#151E31] border border-white/[0.08] text-center">
            <div className="text-[11px] text-[#8892A6] font-medium mb-1 flex items-center justify-center gap-1">
              <Layers size={12} className="text-[#F5B23D]" />
              <span>{isAr ? 'مراحل المسار' : 'Stages'}</span>
            </div>
            <div className="text-lg font-bold font-mono text-[#EEF1F7]">
              {stages.length}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#151E31] border border-white/[0.08] text-center">
            <div className="text-[11px] text-[#8892A6] font-medium mb-1 flex items-center justify-center gap-1">
              <Sliders size={12} className="text-[#35D6A4]" />
              <span>{isAr ? 'حقول النموذج' : 'Form Fields'}</span>
            </div>
            <div className="text-lg font-bold font-mono text-[#EEF1F7]">
              {fields.length}
            </div>
          </div>
        </div>

        {/* Public Careers Share Pill */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs text-[#8892A6]">
            <Sparkles size={14} className="text-[#F5B23D] shrink-0" />
            <span className="truncate">
              {isAr ? 'رابط التقديم المباشر للمرشحين:' : 'Public application link:'}
            </span>
            <span className="font-mono text-xs text-[#EEF1F7] truncate max-w-[220px]">
              /{job.slug || job.id}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151E31] hover:bg-[#1f2c47] text-xs font-semibold text-[#EEF1F7] border border-white/[0.08] transition-colors cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check size={13} className="text-[#35D6A4]" />
                <span className="text-[#35D6A4]">{isAr ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
              </>
            )}
          </button>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#8892A6] uppercase tracking-wider">
            {isAr ? 'الوصف الوظيفي والمسؤوليات' : 'Job Description & Responsibilities'}
          </h4>
          <div className="p-4 rounded-2xl bg-[#070A14] border border-white/[0.06] text-xs text-[#EEF1F7]/90 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
            {job.description || (isAr ? 'لا يوجد وصف وظيفي محدد.' : 'No description provided.')}
          </div>
        </div>

        {/* Pipeline Stages Sequence */}
        {stages.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#8892A6] uppercase tracking-wider">
                {isAr ? 'مراحل مسار التوظيف' : 'Hiring Pipeline Stages'}
              </h4>
              <span className="text-[11px] text-[#5A6478] font-mono">
                {stages.length} {isAr ? 'مراحل' : 'stages'}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {stages.map((stage, idx) => (
                <div
                  key={stage.id || idx}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#151E31] border border-white/[0.08] text-xs text-[#EEF1F7] shrink-0 font-medium"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color || '#4C8DFF' }}
                  />
                  <span>{stage.name}</span>
                  {idx < stages.length - 1 && (
                    <span className="text-[#5A6478] font-mono mx-1">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Form Fields Overview */}
        {fields.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#8892A6] uppercase tracking-wider">
                {isAr ? 'حقول نموذج التقديم' : 'Application Form Fields'}
              </h4>
              <span className="text-[11px] text-[#5A6478] font-mono">
                {fields.length} {isAr ? 'حقول' : 'fields'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fields.map((f, idx) => (
                <div
                  key={f.id || idx}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs"
                >
                  <span className="font-medium text-[#EEF1F7] truncate max-w-[160px]">
                    {f.label}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[10px] text-[#8892A6] font-mono uppercase">
                      {f.type}
                    </span>
                    {f.required && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#F5B23D]/10 text-[10px] text-[#F5B23D] font-medium">
                        {isAr ? 'إلزامي' : 'Req'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {onDeleteClick && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDeleteClick(job);
                }}
                className="btn-danger px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                title={isAr ? 'حذف هذه الوظيفة' : 'Delete Job'}
              >
                <Trash2 size={14} />
                <span>{isAr ? 'حذف الوظيفة' : 'Delete'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onApply && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onApply(job);
                }}
                className="btn-pri px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <span>{isAr ? 'التقديم على الوظيفة الآن' : 'Apply Now'}</span>
              </button>
            )}

            {onOpenBuilder && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBuilder(job.id);
                }}
                className="btn-sec px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <Sliders size={14} />
                <span>{isAr ? 'تعديل النموذج' : 'Edit Form'}</span>
              </button>
            )}

            {onOpenPipeline && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPipeline(job.id);
                }}
                className="btn-pri px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <Layers size={14} />
                <span>{isAr ? 'فتح مسار التوظيف' : 'Open Pipeline'}</span>
                <ExternalLink size={13} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
