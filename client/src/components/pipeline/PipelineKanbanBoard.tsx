import type { FC } from 'react';
import type { PipelineStage, Candidate } from '../../types/ats';
import { PipelineColumn } from './PipelineColumn';

interface PipelineKanbanBoardProps {
  loading: boolean;
  stages: PipelineStage[];
  candidates: Candidate[];
  dragType: 'STAGE' | 'CANDIDATE' | null;
  setDragType: (type: 'STAGE' | 'CANDIDATE' | null) => void;
  draggedCandidateId: string | null;
  setDraggedCandidateId: (id: string | null) => void;
  dragOverStageId: string | null;
  setDragOverStageId: (id: string | null) => void;
  draggedStageIndex: number | null;
  setDraggedStageIndex: (index: number | null) => void;
  dragOverStageIndex: number | null;
  setDragOverStageIndex: (index: number | null) => void;
  handleShiftStage: (fromIndex: number, toIndex: number) => void;
  handleMoveCandidateToStage: (candidate: Candidate, targetStageId: string) => void;
  onOpenEditStage: (stage: PipelineStage) => void;
  onOpenDeleteStage: (stage: PipelineStage, count: number) => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenSchedule: (candidate: Candidate, stage: PipelineStage, isEditing?: boolean) => void;
  onOpenReject: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
  onUnrejectCandidate: (candidate: Candidate) => void;
}

export const PipelineKanbanBoard: FC<PipelineKanbanBoardProps> = ({
  loading,
  stages,
  candidates,
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
  onOpenEditStage,
  onOpenDeleteStage,
  onSelectCandidate,
  onOpenSchedule,
  onOpenReject,
  onDeleteCandidate,
  onUnrejectCandidate,
}) => {
  if (loading && stages.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500 animate-pulse">
        Loading live pipeline from database...
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1">
      {stages.map((stage, idx) => {
        const stageCandidates = candidates.filter((c) => {
          if (c.currentStage === stage.id) return true;
          if (idx === 0 && !stages.some((s) => s.id === c.currentStage)) return true;
          return false;
        });

        return (
          <PipelineColumn
            key={stage.id}
            stage={stage}
            stageIndex={idx}
            stages={stages}
            candidates={stageCandidates}
            dragType={dragType}
            draggedCandidateId={draggedCandidateId}
            dragOverStageId={dragOverStageId}
            draggedStageIndex={draggedStageIndex}
            dragOverStageIndex={dragOverStageIndex}
            onDragStartStage={(index) => {
              setDragType('STAGE');
              setDraggedStageIndex(index);
            }}
            onDragEndStage={() => {
              setDragType(null);
              setDraggedStageIndex(null);
              setDragOverStageIndex(null);
            }}
            onDragOverStage={(index) => {
              if (dragOverStageIndex !== index) setDragOverStageIndex(index);
            }}
            onDragLeaveStage={() => {
              if (dragType === 'STAGE') setDragOverStageIndex(null);
              if (dragType === 'CANDIDATE') setDragOverStageId(null);
            }}
            onDropStage={(toIndex) => {
              setDragOverStageIndex(null);
              if (draggedStageIndex !== null && draggedStageIndex !== toIndex) {
                handleShiftStage(draggedStageIndex, toIndex);
              }
              setDragType(null);
              setDraggedStageIndex(null);
            }}
            onDragOverCandidateZone={(stageId) => {
              if (dragOverStageId !== stageId) setDragOverStageId(stageId);
            }}
            onDropCandidateZone={(stageId) => {
              setDragOverStageId(null);
              if (draggedCandidateId) {
                const candidate = candidates.find((c) => c.id === draggedCandidateId);
                if (candidate) {
                  handleMoveCandidateToStage(candidate, stageId);
                }
              }
              setDragType(null);
              setDraggedCandidateId(null);
            }}
            onDragStartCandidate={(_e, candidateId) => {
              setDragType('CANDIDATE');
              setDraggedCandidateId(candidateId);
            }}
            onDragEndCandidate={() => {
              setDragType(null);
              setDraggedCandidateId(null);
              setDragOverStageId(null);
            }}
            onShiftStage={handleShiftStage}
            onOpenEditStage={onOpenEditStage}
            onOpenDeleteStage={onOpenDeleteStage}
            onSelectCandidate={onSelectCandidate}
            onMoveCandidate={handleMoveCandidateToStage}
            onOpenSchedule={onOpenSchedule}
            onOpenReject={onOpenReject}
            onDeleteCandidate={onDeleteCandidate}
            onUnrejectCandidate={onUnrejectCandidate}
          />
        );
      })}
    </div>
  );
};
