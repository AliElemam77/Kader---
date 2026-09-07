import { type FC } from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  FileText,
  AlertTriangle,
  UserX,
  ExternalLink,
  ClipboardCheck,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import type { Candidate, PipelineStage } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  stages: PipelineStage[];
  onClose: () => void;
  onOpenSchedule: (candidate: Candidate, stage: PipelineStage, isEditing?: boolean) => void;
  onOpenReject: (candidate: Candidate) => void;
  onDeleteCandidate?: (candidate: Candidate) => void;
  onUnrejectCandidate?: (candidate: Candidate) => void;
}

export const CandidateDetailModal: FC<CandidateDetailModalProps> = ({
  candidate,
  stages,
  onClose,
  onOpenSchedule,
  onOpenReject,
  onDeleteCandidate,
  onUnrejectCandidate,
}) => {
  const { t } = useLanguage();
  if (!candidate) return null;

  const currentStage = stages.find((s) => s.id === candidate.currentStage) || stages[0];
  const isInterviewStage = !!(currentStage?.requiresScheduling || currentStage?.stageType === 'INTERVIEW');
  const interview = candidate.scheduledInterview;
  const isRejected = candidate.status === 'REJECTED';
  const isHired = candidate.status === 'HIRED';
  const applicantData = candidate.applicantData || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0E1524] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 max-h-[92vh] overflow-y-auto space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Candidate Header Profile */}
        <div className="flex items-start gap-4 pb-4 border-b border-white/[0.08]">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl border shrink-0 ${
              isRejected
                ? 'bg-[#FF7A85]/15 text-[#FF7A85] border-[#FF7A85]/30'
                : isHired
                ? 'bg-[#35D6A4]/15 text-[#35D6A4] border-[#35D6A4]/30'
                : 'bg-[#151E31] text-[#EEF1F7] border-white/10'
            }`}
          >
            {candidate.name.charAt(0)}
          </div>

          <div className="space-y-1.5 flex-1 overflow-hidden">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-bold text-[#EEF1F7] tracking-tight">{candidate.name}</h2>
              {isRejected && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF7A85]/15 text-[#FF7A85] border border-[#FF7A85]/30">
                  {t('pipeline.rejected')}
                </span>
              )}
              {isHired && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#35D6A4]/15 text-[#35D6A4] border border-[#35D6A4]/30">
                  {t('pipeline.hired')}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5B23D]/10 text-[#F5B23D] border border-[#F5B23D]/20">
                {currentStage?.name || candidate.currentStage}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#8892A6] flex-wrap">
              <span className="flex items-center gap-1.5 font-mono">
                <Mail size={12} className="text-[#5A6478]" /> {candidate.email}
              </span>
              {candidate.phone && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone size={12} className="text-[#5A6478]" /> {candidate.phone}
                </span>
              )}
              <span className="text-[#5A6478] text-[11px] font-mono">
                {new Date(candidate.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Scheduled Interview Card */}
        {interview && (
          <div className="p-4 rounded-2xl bg-[#4C8DFF]/10 border border-[#4C8DFF]/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#4C8DFF] flex items-center gap-2">
                <Calendar size={14} /> {t('candidate.scheduled_interview')}
              </div>
              <button
                type="button"
                onClick={() => onOpenSchedule(candidate, currentStage, true)}
                className="text-[11px] text-[#4C8DFF] hover:underline cursor-pointer"
              >
                {t('pipeline.edit_interview')}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#EEF1F7] pt-1">
              <div>
                <span className="text-[#8892A6] block text-[10px]">اليوم والتاريخ</span>
                <span className="font-semibold">{interview.dayOfWeek}، {interview.date}</span>
              </div>
              <div>
                <span className="text-[#8892A6] block text-[10px]">الوقت والمدة</span>
                <span className="font-mono">{interview.time} ({interview.durationMinutes}m)</span>
              </div>
              <div>
                <span className="text-[#8892A6] block text-[10px]">النوع</span>
                <span>{interview.modality === 'ONLINE' ? 'Video Call' : 'In-Person'}</span>
              </div>
              <div>
                <span className="text-[#8892A6] block text-[10px]">القائم بالمقابلة</span>
                <span>{interview.interviewerName}</span>
              </div>
            </div>
            {interview.locationOrLink && (
              <div className="text-xs pt-1">
                <span className="text-[#8892A6] text-[10px] block">رابط المقابلة / المقر:</span>
                <a
                  href={interview.locationOrLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4C8DFF] hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  {interview.locationOrLink} <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Rejection Details */}
        {isRejected && candidate.rejectionReason && (
          <div className="p-4 rounded-2xl bg-[#FF7A85]/10 border border-[#FF7A85]/30 text-xs space-y-1.5">
            <div className="text-[#FF7A85] font-bold flex items-center gap-1.5">
              <AlertTriangle size={14} /> {t('candidate.rejection_reason_title')}
            </div>
            <p className="text-[#FF7A85]/90 leading-relaxed whitespace-pre-wrap">{candidate.rejectionReason}</p>
          </div>
        )}

        {/* Task / Assignment Details */}
        {candidate.stageTask && (
          <div className="p-4 rounded-2xl bg-[#F5B23D]/10 border border-[#F5B23D]/30 text-xs space-y-2">
            <div className="text-[#F5B23D] font-bold flex items-center gap-1.5">
              <ClipboardCheck size={15} /> {t('candidate.assigned_task')}:
            </div>
            {candidate.stageTask.title && (
              <div className="text-[#EEF1F7] font-semibold">{candidate.stageTask.title}</div>
            )}
            {candidate.stageTask.description && (
              <p className="text-[#EEF1F7] leading-relaxed whitespace-pre-wrap bg-[#151E31] p-3 rounded-xl border border-white/[0.08]">
                {candidate.stageTask.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
              {candidate.stageTask.taskUrl && (
                <a
                  href={candidate.stageTask.taskUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4C8DFF] hover:underline inline-flex items-center gap-1"
                >
                  🔗 رابط التكليف <ExternalLink size={10} />
                </a>
              )}
              {candidate.stageTask.deadline && (
                <span className="text-[#F5B23D] font-mono">
                  ⏰ {candidate.stageTask.deadline}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stage Notes */}
        {candidate.stageNotes && (
          <div className="p-4 rounded-2xl bg-[#151E31] border border-white/[0.08] text-xs space-y-1.5">
            <div className="text-[#F5B23D] font-bold flex items-center gap-1.5">
              <FileText size={15} /> {t('candidate.notes')}:
            </div>
            <p className="text-[#EEF1F7] leading-relaxed whitespace-pre-wrap">{candidate.stageNotes}</p>
          </div>
        )}

        {/* Dynamic Form Responses */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#8892A6] uppercase tracking-wider">
            {t('candidate.applicant_details')}
          </h3>

          <div className="bg-[#151E31] rounded-2xl border border-white/[0.08] p-4 space-y-3 text-xs divide-y divide-white/[0.06]">
            {Object.keys(applicantData).length === 0 ? (
              <p className="text-[#5A6478] text-center py-4">لا توجد حقول إضافية مسجلة</p>
            ) : (
              Object.entries(applicantData).map(([key, value]) => {
                if (key === 'scheduledInterview') return null;
                return (
                  <div key={key} className="pt-2.5 first:pt-0 flex flex-col sm:flex-row justify-between gap-1">
                    <span className="text-[#8892A6] font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-[#EEF1F7] font-semibold">{String(value)}</span>
                  </div>
                );
              })
            )}

            {candidate.resumeUrl && (
              <div className="pt-2.5 flex items-center justify-between">
                <span className="text-[#8892A6] font-medium">{t('candidate.resume')}:</span>
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4C8DFF] hover:underline flex items-center gap-1 font-semibold"
                >
                  <FileText size={13} /> {t('candidate.view_resume')} <ExternalLink size={11} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-sec text-xs"
            >
              {t('common.close')}
            </button>
            {onDeleteCandidate && (
              <button
                type="button"
                onClick={() => onDeleteCandidate(candidate)}
                className="btn-danger text-xs"
              >
                <Trash2 size={13} />
                <span>{t('candidate.confirm_delete_title')}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isRejected && (isInterviewStage || !!interview) && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSchedule(candidate, currentStage, !!interview);
                }}
                className="btn-pri text-xs"
              >
                <Calendar size={13} />
                <span>{interview ? t('pipeline.edit_interview') : t('pipeline.schedule_interview')}</span>
              </button>
            )}

            {isRejected && onUnrejectCandidate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onUnrejectCandidate(candidate);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#35D6A4]/15 hover:bg-[#35D6A4]/25 text-[#35D6A4] border border-[#35D6A4]/30 transition-all cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>{t('pipeline.unreject')}</span>
              </button>
            )}

            {!isRejected && !isHired && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReject(candidate);
                }}
                className="btn-danger text-xs"
              >
                <UserX size={13} />
                <span>{t('pipeline.reject_candidate')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
