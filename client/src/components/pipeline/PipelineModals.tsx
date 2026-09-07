import type { FC, FormEvent } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { PipelineStage, Candidate } from '../../types/ats';
import type { StageFormValues, ScheduleFormValues } from '../../hooks/usePipeline';
import { ScheduleModal } from './ScheduleModal';
import { RejectModal } from './RejectModal';
import { CandidateDetailModal } from './CandidateDetailModal';
import { AddStageModal, EditStageModal } from './StageConfigModal';
import { DeleteStageModal } from './DeleteStageModal';
import { DeleteCandidateModal } from './DeleteCandidateModal';

interface PipelineModalsProps {
  stages: PipelineStage[];
  // Schedule Modal
  schedulingCandidate: { candidate: Candidate; targetStage: PipelineStage; isEditing?: boolean } | null;
  scheduleForm: UseFormReturn<ScheduleFormValues>;
  onCloseSchedule: () => void;
  onScheduleSubmit: (data: ScheduleFormValues) => void;
  onMoveDirectlyWithoutSchedule?: () => void;
  // Reject Modal
  rejectingCandidate: Candidate | null;
  rejectionReason: string;
  sendRejectionEmail: boolean;
  isSubmittingRejection: boolean;
  onCloseReject: () => void;
  onReasonChange: (reason: string) => void;
  onSendEmailToggle: (send: boolean) => void;
  onConfirmRejection: () => void;
  // Candidate Detail Modal
  selectedCandidate: Candidate | null;
  onCloseCandidateDetail: () => void;
  onOpenScheduleFromDetail: (candidate: Candidate, stage: PipelineStage, isEditing?: boolean) => void;
  onOpenRejectFromDetail: (candidate: Candidate) => void;
  // Add Stage Modal
  isAddStageOpen: boolean;
  stageForm: UseFormReturn<StageFormValues>;
  onCloseAddStage: () => void;
  onAddStageSubmit: (data: StageFormValues) => void;
  // Edit Stage Modal
  editingStage: PipelineStage | null;
  editName: string;
  editIsInterview: boolean;
  editDefaultModality: 'ONLINE' | 'OFFLINE';
  editColor: string;
  onNameChange: (val: string) => void;
  onIsInterviewChange: (val: boolean) => void;
  onModalityChange: (val: 'ONLINE' | 'OFFLINE') => void;
  onColorChange: (val: string) => void;
  onCloseEditStage: () => void;
  onSaveStageEdit: (e: FormEvent) => void;
  // Delete Stage Modal
  deletingStage: { stage: PipelineStage; candidatesCount: number } | null;
  onCloseDeleteStage: () => void;
  onConfirmDeleteStage: () => void;
  // Delete Candidate Modal
  deletingCandidate: Candidate | null;
  isDeletingCandidate?: boolean;
  onCloseDeleteCandidate: () => void;
  onConfirmDeleteCandidate: () => void;
  onOpenDeleteCandidate?: (candidate: Candidate) => void;
  onUnrejectCandidate?: (candidate: Candidate) => void;
}

export const PipelineModals: FC<PipelineModalsProps> = ({
  stages,
  schedulingCandidate,
  scheduleForm,
  onCloseSchedule,
  onScheduleSubmit,
  onMoveDirectlyWithoutSchedule,
  rejectingCandidate,
  rejectionReason,
  sendRejectionEmail,
  isSubmittingRejection,
  onCloseReject,
  onReasonChange,
  onSendEmailToggle,
  onConfirmRejection,
  selectedCandidate,
  onCloseCandidateDetail,
  onOpenScheduleFromDetail,
  onOpenRejectFromDetail,
  isAddStageOpen,
  stageForm,
  onCloseAddStage,
  onAddStageSubmit,
  editingStage,
  editName,
  editIsInterview,
  editDefaultModality,
  editColor,
  onNameChange,
  onIsInterviewChange,
  onModalityChange,
  onColorChange,
  onCloseEditStage,
  onSaveStageEdit,
  deletingStage,
  onCloseDeleteStage,
  onConfirmDeleteStage,
  deletingCandidate,
  isDeletingCandidate = false,
  onCloseDeleteCandidate,
  onConfirmDeleteCandidate,
  onOpenDeleteCandidate,
  onUnrejectCandidate,
}) => {
  return (
    <>
      <ScheduleModal
        schedulingCandidate={schedulingCandidate}
        form={scheduleForm}
        onClose={onCloseSchedule}
        onSubmit={onScheduleSubmit}
        onMoveDirectly={onMoveDirectlyWithoutSchedule}
      />

      <RejectModal
        rejectingCandidate={rejectingCandidate}
        rejectionReason={rejectionReason}
        sendRejectionEmail={sendRejectionEmail}
        isSubmittingRejection={isSubmittingRejection}
        onClose={onCloseReject}
        onReasonChange={onReasonChange}
        onSendEmailToggle={onSendEmailToggle}
        onConfirm={onConfirmRejection}
      />

      <CandidateDetailModal
        candidate={selectedCandidate}
        stages={stages}
        onClose={onCloseCandidateDetail}
        onOpenSchedule={onOpenScheduleFromDetail}
        onOpenReject={onOpenRejectFromDetail}
        onDeleteCandidate={onOpenDeleteCandidate}
        onUnrejectCandidate={onUnrejectCandidate}
      />

      <AddStageModal
        isOpen={isAddStageOpen}
        form={stageForm}
        onClose={onCloseAddStage}
        onSubmit={onAddStageSubmit}
      />

      <EditStageModal
        editingStage={editingStage}
        editName={editName}
        editIsInterview={editIsInterview}
        editDefaultModality={editDefaultModality}
        editColor={editColor}
        onNameChange={onNameChange}
        onIsInterviewChange={onIsInterviewChange}
        onModalityChange={onModalityChange}
        onColorChange={onColorChange}
        onClose={onCloseEditStage}
        onSubmit={onSaveStageEdit}
      />

      <DeleteStageModal
        deletingStage={deletingStage}
        stages={stages}
        onClose={onCloseDeleteStage}
        onConfirm={onConfirmDeleteStage}
      />

      <DeleteCandidateModal
        candidate={deletingCandidate}
        isOpen={!!deletingCandidate}
        isLoading={isDeletingCandidate}
        onClose={onCloseDeleteCandidate}
        onConfirm={onConfirmDeleteCandidate}
      />
    </>
  );
};
