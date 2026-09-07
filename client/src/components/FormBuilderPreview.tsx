import { type FC } from 'react';
import { useFormBuilder } from '../hooks/useFormBuilder';
import { FormBuilderHeader } from './form-builder/FormBuilderHeader';
import { FieldItemCard } from './form-builder/FieldItemCard';
import { NewFieldForm } from './form-builder/NewFieldForm';
import { EditFieldModal } from './form-builder/EditFieldModal';
import { LiveFormPreview } from './form-builder/LiveFormPreview';

export const FormBuilderPreview: FC = () => {
  const {
    jobs,
    selectedJob,
    selectedJobId,
    handleSelectJob,
    fields,
    hasUnsavedChanges,
    isSaving,
    persistFields,
    newFieldForm,
    onAddField,
    handleRemoveField,
    handleMoveField,
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    editingField,
    setEditingField,
    handleStartEditField,
    handleSaveEditedField,
    newOptionText,
    setNewOptionText,
    handleAddOptionToEditing,
    handleRemoveOptionFromEditing,
  } = useFormBuilder();

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <FormBuilderHeader
        jobs={jobs}
        selectedJob={selectedJob}
        selectedJobId={selectedJobId}
        fields={fields}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSelectJob={handleSelectJob}
        onSave={() => persistFields(fields, selectedJobId)}
      />

      {/* 2. Main Builder & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields List & Add Question */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            {fields.map((field, idx) => (
              <FieldItemCard
                key={field.id}
                field={field}
                index={idx}
                totalFields={fields.length}
                isDragged={draggedIndex === idx}
                isDragOver={dragOverIndex === idx}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                onMoveField={handleMoveField}
                onEditField={handleStartEditField}
                onRemoveField={handleRemoveField}
              />
            ))}
          </div>

          <NewFieldForm form={newFieldForm} onSubmit={onAddField} />
        </div>

        {/* Right Column: Live Candidate Preview */}
        <div className="lg:col-span-5">
          <LiveFormPreview fields={fields} />
        </div>
      </div>

      {/* 3. Modal: Edit Question & Options */}
      <EditFieldModal
        editingField={editingField}
        newOptionText={newOptionText}
        onClose={() => setEditingField(null)}
        onFieldChange={setEditingField}
        onNewOptionTextChange={setNewOptionText}
        onAddOption={handleAddOptionToEditing}
        onRemoveOption={handleRemoveOptionFromEditing}
        onSave={handleSaveEditedField}
      />
    </div>
  );
};
