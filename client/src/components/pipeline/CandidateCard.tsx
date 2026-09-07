import { type FC } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  UserX,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import type { Candidate, PipelineStage } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';

interface CandidateCardProps {
  candidate: Candidate;
  currentStageIndex: number;
  stages: PipelineStage[];
  isDragged: boolean;
  onDragStart: (e: React.DragEvent, candidateId: string) => void;
  onDragEnd: () => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onMoveCandidate: (candidate: Candidate, targetStageId: string) => void;
  onOpenSchedule: (candidate: Candidate, stage: PipelineStage, isEditing?: boolean) => void;
  onOpenReject: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
  onUnrejectCandidate: (candidate: Candidate) => void;
}

export const CandidateCard: FC<CandidateCardProps> = ({
  candidate,
  currentStageIndex,
  stages,
  isDragged,
  onDragStart,
  onDragEnd,
  onSelectCandidate,
  onMoveCandidate,
  onOpenSchedule,
  onOpenReject,
  onDeleteCandidate,
  onUnrejectCandidate,
}) => {
  const { t, isRtl } = useLanguage();
  const currentStage = stages[currentStageIndex];
  const isInterviewStage = !!(currentStage?.requiresScheduling || currentStage?.stageType === 'INTERVIEW');
  const interview = candidate.scheduledInterview;
  const isRejected = candidate.status === 'REJECTED';
  const isHired = candidate.status === 'HIRED';

  return (
    <div
      draggable={!isRejected}
      onDragStart={(e) => !isRejected && onDragStart(e, candidate.id)}
      onDragEnd={onDragEnd}
      className={`bg-[#151E31] border rounded-xl p-3.5 hover:border-white/20 hover:shadow-xl transition-all duration-150 space-y-3 select-none ${
        isRejected
          ? 'border-[#FF7A85]/30 bg-[#151E31]/80 cursor-default'
          : 'border-white/[0.08] cursor-grab active:cursor-grabbing hover:-translate-y-0.5'
      } ${
        isDragged ? 'opacity-30 border-dashed border-[#F5B23D] scale-[0.98]' : ''
      }`}
    >
      {/* Candidate Avatar, Info & Status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 ${
              isRejected
                ? 'bg-[#FF7A85]/15 text-[#FF7A85] border-[#FF7A85]/30'
                : isHired
                ? 'bg-[#35D6A4]/15 text-[#35D6A4] border-[#35D6A4]/30'
                : 'bg-[#0E1524] text-[#EEF1F7] border-white/10'
            }`}
          >
            {candidate.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-[#EEF1F7] truncate flex items-center gap-1.5">
              <span>{candidate.name}</span>
              {isRejected && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FF7A85]/15 text-[#FF7A85] border border-[#FF7A85]/30">
                  {t('pipeline.rejected')}
                </span>
              )}
              {isHired && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#35D6A4]/15 text-[#35D6A4] border border-[#35D6A4]/30">
                  {t('pipeline.hired')}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#8892A6] font-mono truncate">{candidate.email}</div>
          </div>
        </div>

        {/* Actions: Inspect Details & Delete */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectCandidate(candidate);
            }}
            title={t('candidate.applicant_details')}
            className="p-1.5 rounded-lg bg-[#0E1524] hover:bg-white/[0.08] text-[#8892A6] hover:text-[#EEF1F7] border border-white/[0.08] transition-colors cursor-pointer"
          >
            <Eye size={13} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCandidate(candidate);
            }}
            title={t('pipeline.delete_candidate')}
            className="p-1.5 rounded-lg bg-[#0E1524] hover:bg-[#FF7A85]/15 text-[#8892A6] hover:text-[#FF7A85] border border-white/[0.08] hover:border-[#FF7A85]/30 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Scheduled Interview Badge (Only when candidate is in an interview stage) */}
      {interview && isInterviewStage && (
        <div className="p-2.5 rounded-lg bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 text-[11px] text-[#4C8DFF] space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-[#EEF1F7]">
              <Calendar size={12} className="text-[#4C8DFF]" />
              <span>{interview.dayOfWeek}, {interview.date}</span>
            </div>
            <button
              type="button"
              onClick={() => onOpenSchedule(candidate, currentStage, true)}
              title={t('pipeline.edit_interview')}
              className="p-1 rounded hover:bg-[#4C8DFF]/20 text-[#4C8DFF] cursor-pointer"
            >
              <Pencil size={11} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#8892A6]">
            <span className="flex items-center gap-1 font-mono">
              <Clock size={10} /> {interview.time} ({interview.durationMinutes}m)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {interview.modality === 'ONLINE' ? <Video size={10} /> : <Building2 size={10} />}
              {interview.modality === 'ONLINE' ? 'Online' : 'In-Person'}
            </span>
          </div>
        </div>
      )}

      {/* Rejection Reason Alert if candidate was rejected */}
      {isRejected && candidate.rejectionReason && (
        <div className="p-2.5 rounded-lg bg-[#FF7A85]/10 border border-[#FF7A85]/20 text-[11px] text-[#FF7A85] flex items-start gap-1.5">
          <AlertTriangle size={12} className="shrink-0 mt-0.5 text-[#FF7A85]" />
          <span className="line-clamp-2">{candidate.rejectionReason}</span>
        </div>
      )}

      {/* Footer Controls: If Rejected, NEVER show stage navigation, show Undo Rejection & Delete only */}
      {isRejected ? (
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[10px]">
          <span className="text-[#FF7A85] font-semibold flex items-center gap-1">
            <AlertTriangle size={11} />
            <span>{t('pipeline.rejected_candidate_badge')}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUnrejectCandidate(candidate);
              }}
              title={t('pipeline.unreject')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#35D6A4]/15 hover:bg-[#35D6A4]/25 text-[#35D6A4] hover:text-[#EEF1F7] border border-[#35D6A4]/30 font-semibold transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw size={11} />
              <span>{t('pipeline.unreject')}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCandidate(candidate);
              }}
              title={t('pipeline.delete_candidate')}
              className="p-1 rounded-md hover:bg-[#FF7A85]/15 text-[#8892A6] hover:text-[#FF7A85] transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ) : (
        /* Normal Stage Navigation & Quick Actions Footer for active candidates */
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[10px]">
          {/* Move Left / Previous Stage */}
          <div>
            {currentStageIndex > 0 ? (
              <button
                type="button"
                onClick={() => onMoveCandidate(candidate, stages[currentStageIndex - 1].id)}
                title={`${t('pipeline.move_prev')}: ${stages[currentStageIndex - 1].name}`}
                className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-[#0E1524] hover:bg-white/[0.08] text-[#8892A6] hover:text-[#EEF1F7] border border-white/[0.08] transition-colors cursor-pointer"
              >
                <ChevronLeft size={11} className={isRtl ? 'rotate-180' : ''} />
                <span className="max-w-[75px] truncate">{stages[currentStageIndex - 1].name}</span>
              </button>
            ) : (
              <span className="text-[#5A6478] text-[9px]">{t('pipeline.first_stage')}</span>
            )}
          </div>

          {/* Middle Actions: Schedule Interview (Only for interview stages), Reject & Delete */}
          <div className="flex items-center gap-1">
            {isInterviewStage && (
              <button
                type="button"
                onClick={() => onOpenSchedule(candidate, currentStage, !!interview)}
                title={interview ? t('pipeline.edit_interview') : t('pipeline.schedule_interview')}
                className="p-1.5 rounded-lg hover:bg-[#4C8DFF]/15 text-[#8892A6] hover:text-[#4C8DFF] transition-colors cursor-pointer"
              >
                <Calendar size={13} />
              </button>
            )}

            {!isHired && (
              <button
                type="button"
                onClick={() => onOpenReject(candidate)}
                title={t('pipeline.reject_candidate')}
                className="p-1.5 rounded-lg hover:bg-[#FF7A85]/15 text-[#8892A6] hover:text-[#FF7A85] transition-colors cursor-pointer"
              >
                <UserX size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCandidate(candidate);
              }}
              title={t('pipeline.delete_candidate')}
              className="p-1.5 rounded-lg hover:bg-[#FF7A85]/15 text-[#8892A6] hover:text-[#FF7A85] transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* Move Right / Next Stage (Amber Action) */}
          <div>
            {currentStageIndex < stages.length - 1 ? (
              <button
                type="button"
                onClick={() => onMoveCandidate(candidate, stages[currentStageIndex + 1].id)}
                title={`${t('pipeline.move_next')}: ${stages[currentStageIndex + 1].name}`}
                className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-[#F5B23D]/15 hover:bg-[#F5B23D]/25 text-[#F5B23D] border border-[#F5B23D]/30 transition-all cursor-pointer font-semibold"
              >
                <span className="max-w-[75px] truncate">{stages[currentStageIndex + 1].name}</span>
                <ChevronRight size={11} className={isRtl ? 'rotate-180' : ''} />
              </button>
            ) : (
              <span className="text-[#5A6478] text-[9px]">{t('pipeline.last_stage')}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
