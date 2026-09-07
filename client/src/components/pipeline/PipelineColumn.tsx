import { type FC } from 'react';
import {
  GripVertical,
  Video,
  Building2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { Candidate, PipelineStage } from '../../types/ats';
import { CandidateCard } from './CandidateCard';
import { useLanguage } from '../../context/LanguageContext';

interface PipelineColumnProps {
  stage: PipelineStage;
  stageIndex: number;
  stages: PipelineStage[];
  candidates: Candidate[];
  dragType: 'CANDIDATE' | 'STAGE' | null;
  draggedCandidateId: string | null;
  dragOverStageId: string | null;
  draggedStageIndex: number | null;
  dragOverStageIndex: number | null;
  onDragStartStage: (index: number) => void;
  onDragEndStage: () => void;
  onDragOverStage: (index: number) => void;
  onDragLeaveStage: () => void;
  onDropStage: (toIndex: number) => void;
  onDragOverCandidateZone: (stageId: string) => void;
  onDropCandidateZone: (stageId: string) => void;
  onDragStartCandidate: (e: React.DragEvent, candidateId: string) => void;
  onDragEndCandidate: () => void;
  onShiftStage: (fromIdx: number, toIdx: number) => void;
  onOpenEditStage: (stage: PipelineStage) => void;
  onOpenDeleteStage: (stage: PipelineStage, count: number) => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onMoveCandidate: (candidate: Candidate, targetStageId: string) => void;
  onOpenSchedule: (candidate: Candidate, stage: PipelineStage, isEditing?: boolean) => void;
  onOpenReject: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
  onUnrejectCandidate: (candidate: Candidate) => void;
}

export const PipelineColumn: FC<PipelineColumnProps> = ({
  stage,
  stageIndex,
  stages,
  candidates,
  dragType,
  draggedCandidateId,
  dragOverStageId,
  draggedStageIndex,
  dragOverStageIndex,
  onDragStartStage,
  onDragEndStage,
  onDragOverStage,
  onDragLeaveStage,
  onDropStage,
  onDragOverCandidateZone,
  onDropCandidateZone,
  onDragStartCandidate,
  onDragEndCandidate,
  onShiftStage,
  onOpenEditStage,
  onOpenDeleteStage,
  onSelectCandidate,
  onMoveCandidate,
  onOpenSchedule,
  onOpenReject,
  onDeleteCandidate,
  onUnrejectCandidate,
}) => {
  const { t } = useLanguage();
  const isColumnCandidateTarget = dragType === 'CANDIDATE' && dragOverStageId === stage.id;
  const isColumnStageTarget =
    dragType === 'STAGE' && dragOverStageIndex === stageIndex && draggedStageIndex !== stageIndex;
  const isBeingDragged = dragType === 'STAGE' && draggedStageIndex === stageIndex;

  // Determine stage dot indicator color according to Kader Brand Book
  const getStageColor = () => {
    if (stage.color) return stage.color;
    if (stageIndex === 0) return '#5A6478'; // Slate
    if (stage.requiresScheduling || stage.stageType === 'INTERVIEW') return '#4C8DFF'; // Signal Blue
    if (stageIndex === stages.length - 1) return '#35D6A4'; // Mint (Hired)
    return '#F5B23D'; // Amber (Offer / Progress)
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragType === 'STAGE') {
          onDragOverStage(stageIndex);
        } else if (dragType === 'CANDIDATE') {
          onDragOverCandidateZone(stage.id);
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        onDragLeaveStage();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragType === 'STAGE') {
          onDropStage(stageIndex);
        } else if (dragType === 'CANDIDATE') {
          onDropCandidateZone(stage.id);
        }
      }}
      className={`flex flex-col min-w-[320px] max-w-[360px] flex-1 bg-[#0E1524] border rounded-2xl min-h-[540px] shadow-lg transition-all duration-200 relative ${
        isBeingDragged
          ? 'opacity-40 border-dashed border-[#F5B23D] scale-[0.98]'
          : isColumnStageTarget
          ? 'border-[#35D6A4] bg-[#0E1524] ring-2 ring-[#35D6A4]/40'
          : isColumnCandidateTarget
          ? 'border-[#4C8DFF] bg-[#151E31] ring-2 ring-[#4C8DFF]/40 shadow-xl shadow-[#4C8DFF]/10'
          : 'border-white/[0.08] hover:border-white/[0.14]'
      }`}
    >
      {/* Stage Header (Draggable for stage reordering) */}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', `STAGE:${stageIndex}`);
          e.dataTransfer.effectAllowed = 'move';
          onDragStartStage(stageIndex);
        }}
        onDragEnd={onDragEndStage}
        className="p-4 border-b border-white/[0.08] cursor-grab active:cursor-grabbing select-none bg-[#0E1524] rounded-t-2xl group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 overflow-hidden flex-1 me-2">
            <div
              className="text-[#5A6478] group-hover:text-[#F5B23D] transition-colors"
              title="اسحب لتغيير ترتيب المرحلة"
            >
              <GripVertical size={16} />
            </div>

            <div
              className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0"
              style={{ backgroundColor: getStageColor() }}
            />

            <h3 className="text-sm font-bold text-[#EEF1F7] tracking-tight truncate" title={stage.name}>
              {stage.name}
            </h3>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#151E31] text-[#8892A6] border border-white/[0.08] shrink-0">
            {candidates.length}
          </span>
        </div>

        {/* Stage Meta & Quick Controls */}
        <div className="flex items-center justify-between gap-1 text-[10px] pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {stage.defaultModality && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold border ${
                  stage.defaultModality === 'ONLINE'
                    ? 'bg-[#4C8DFF]/10 text-[#4C8DFF] border-[#4C8DFF]/20'
                    : 'bg-[#35D6A4]/10 text-[#35D6A4] border-[#35D6A4]/20'
                }`}
              >
                {stage.defaultModality === 'ONLINE' ? <Video size={10} /> : <Building2 size={10} />}
                {stage.defaultModality === 'ONLINE' ? 'Online' : 'In-Person'}
              </span>
            )}

            {stage.requiresScheduling && (
              <span className="text-[#8892A6] flex items-center gap-1">
                <Clock size={10} /> {t('pipeline.requires_scheduling')}
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {stageIndex > 0 && (
              <button
                type="button"
                onClick={() => onShiftStage(stageIndex, stageIndex - 1)}
                title="Move stage left"
                className="p-1 rounded hover:bg-[#151E31] text-[#8892A6] hover:text-[#EEF1F7] transition-colors cursor-pointer"
              >
                <ChevronLeft size={13} />
              </button>
            )}

            {stageIndex < stages.length - 1 && (
              <button
                type="button"
                onClick={() => onShiftStage(stageIndex, stageIndex + 1)}
                title="Move stage right"
                className="p-1 rounded hover:bg-[#151E31] text-[#8892A6] hover:text-[#EEF1F7] transition-colors cursor-pointer"
              >
                <ChevronRight size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenEditStage(stage)}
              title={t('pipeline.edit_stage_title')}
              className="p-1 rounded hover:bg-[#151E31] text-[#8892A6] hover:text-[#F5B23D] transition-colors cursor-pointer"
            >
              <Pencil size={13} />
            </button>

            <button
              type="button"
              onClick={() => onOpenDeleteStage(stage, candidates.length)}
              title={t('pipeline.delete_stage_title')}
              className="p-1 rounded hover:bg-[#FF7A85]/10 text-[#8892A6] hover:text-[#FF7A85] transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Drop Area Indicator */}
      {dragType === 'CANDIDATE' && (
        <div
          className={`mx-3 mt-2 p-2.5 border-2 border-dashed rounded-xl text-center text-xs font-semibold transition-all ${
            dragOverStageId === stage.id
              ? 'border-[#4C8DFF] bg-[#4C8DFF]/15 text-[#4C8DFF] scale-[1.01]'
              : 'border-white/10 bg-[#151E31]/40 text-[#8892A6]'
          }`}
        >
          {dragOverStageId === stage.id
            ? `✨ ${stage.name}`
            : stage.name}
        </div>
      )}

      {/* Candidates Cards List */}
      <div className="p-3 space-y-3 flex-1 flex flex-col">
        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/[0.08] rounded-xl text-xs text-[#8892A6] text-center gap-1.5 flex-1 min-h-[140px]">
            <p className="leading-relaxed">{t('pipeline.empty_stage')}</p>
            <span className="text-[11px] text-[#5A6478]">{t('pipeline.drag_hint')}</span>
          </div>
        ) : (
          candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              currentStageIndex={stageIndex}
              stages={stages}
              isDragged={draggedCandidateId === c.id}
              onDragStart={onDragStartCandidate}
              onDragEnd={onDragEndCandidate}
              onSelectCandidate={onSelectCandidate}
              onMoveCandidate={onMoveCandidate}
              onOpenSchedule={onOpenSchedule}
              onOpenReject={onOpenReject}
              onDeleteCandidate={onDeleteCandidate}
              onUnrejectCandidate={onUnrejectCandidate}
            />
          ))
        )}
      </div>
    </div>
  );
};
