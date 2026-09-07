import { useState, type FC } from 'react';
import { usePipeline } from '../hooks/usePipeline';
import { PipelineHeader } from './pipeline/PipelineHeader';
import { PipelineKanbanBoard } from './pipeline/PipelineKanbanBoard';
import { PipelineModals } from './pipeline/PipelineModals';
import { DeleteJobModal } from './jobs/DeleteJobModal';
import { JobDetailModal } from './jobs/JobDetailModal';

interface PipelinePreviewProps {
  token: string | null;
}

export const PipelinePreview: FC<PipelinePreviewProps> = ({ token }) => {
  const {
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
    selectedCandidate,
    setSelectedCandidate,
    deletingCandidate,
    setDeletingCandidate,
    isDeletingCandidate,
    handleConfirmDeleteCandidate,
    jobToDelete,
    setJobToDelete,
    isDeletingJob,
    handleConfirmDeleteJob,
  } = usePipeline(token);

  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <PipelineHeader
        jobs={jobs}
        selectedJob={selectedJob}
        selectedJobId={selectedJobId}
        loading={loading}
        onSelectJob={handleSelectJob}
        onRefresh={() => fetchData()}
        onOpenAddStage={() => setIsAddStageOpen(true)}
        onViewJobDetails={() => setIsJobDetailsOpen(true)}
        onDeleteJob={() => selectedJob && setJobToDelete(selectedJob)}
      />

      {/* 2. Kanban Board Columns */}
      <PipelineKanbanBoard
        loading={loading}
        stages={stages}
        candidates={candidates}
        dragType={dragType}
        setDragType={setDragType}
        draggedCandidateId={draggedCandidateId}
        setDraggedCandidateId={setDraggedCandidateId}
        dragOverStageId={dragOverStageId}
        setDragOverStageId={setDragOverStageId}
        draggedStageIndex={draggedStageIndex}
        setDraggedStageIndex={setDraggedStageIndex}
        dragOverStageIndex={dragOverStageIndex}
        setDragOverStageIndex={setDragOverStageIndex}
        handleShiftStage={handleShiftStage}
        handleMoveCandidateToStage={handleMoveCandidateToStage}
        onOpenEditStage={handleOpenEditStage}
        onOpenDeleteStage={handleOpenDeleteStage}
        onSelectCandidate={setSelectedCandidate}
        onOpenSchedule={(candidate, stg, isEditing) =>
          setSchedulingCandidate({ candidate, targetStage: stg, isEditing })
        }
        onOpenReject={setRejectingCandidate}
        onDeleteCandidate={setDeletingCandidate}
        onUnrejectCandidate={handleUnrejectCandidate}
      />

      {/* 3. Modals */}
      <PipelineModals
        stages={stages}
        schedulingCandidate={schedulingCandidate}
        scheduleForm={scheduleForm}
        onCloseSchedule={() => setSchedulingCandidate(null)}
        onScheduleSubmit={onScheduleSubmit}
        onMoveDirectlyWithoutSchedule={handleMoveDirectlyWithoutSchedule}
        rejectingCandidate={rejectingCandidate}
        rejectionReason={rejectionReason}
        sendRejectionEmail={sendRejectionEmail}
        isSubmittingRejection={isSubmittingRejection}
        onCloseReject={() => setRejectingCandidate(null)}
        onReasonChange={setRejectionReason}
        onSendEmailToggle={setSendRejectionEmail}
        onConfirmRejection={onConfirmRejection}
        selectedCandidate={selectedCandidate}
        onCloseCandidateDetail={() => setSelectedCandidate(null)}
        onOpenScheduleFromDetail={(candidate, stg, isEditing) =>
          setSchedulingCandidate({ candidate, targetStage: stg, isEditing })
        }
        onOpenRejectFromDetail={setRejectingCandidate}
        isAddStageOpen={isAddStageOpen}
        stageForm={stageForm}
        onCloseAddStage={() => setIsAddStageOpen(false)}
        onAddStageSubmit={onAddCustomStage}
        editingStage={editingStage}
        editName={editName}
        editIsInterview={editIsInterview}
        editDefaultModality={editDefaultModality}
        editColor={editColor}
        onNameChange={setEditName}
        onIsInterviewChange={setEditIsInterview}
        onModalityChange={setEditDefaultModality}
        onColorChange={setEditColor}
        onCloseEditStage={() => setEditingStage(null)}
        onSaveStageEdit={handleSaveStageEdit}
        deletingStage={deletingStage}
        onCloseDeleteStage={() => setDeletingStage(null)}
        onConfirmDeleteStage={handleConfirmDeleteStage}
        deletingCandidate={deletingCandidate}
        isDeletingCandidate={isDeletingCandidate}
        onCloseDeleteCandidate={() => setDeletingCandidate(null)}
        onConfirmDeleteCandidate={handleConfirmDeleteCandidate}
        onOpenDeleteCandidate={setDeletingCandidate}
        onUnrejectCandidate={handleUnrejectCandidate}
      />

      {/* 4. Job Details Modal */}
      <JobDetailModal
        job={selectedJob || null}
        isOpen={isJobDetailsOpen}
        onClose={() => setIsJobDetailsOpen(false)}
        onDeleteClick={(j) => {
          setIsJobDetailsOpen(false);
          setJobToDelete(j);
        }}
      />

      {/* 5. Delete Job Modal */}
      <DeleteJobModal
        job={jobToDelete}
        isOpen={Boolean(jobToDelete)}
        isLoading={isDeletingJob}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleConfirmDeleteJob}
      />
    </div>
  );
};
