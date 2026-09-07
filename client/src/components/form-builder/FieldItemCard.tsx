import { type FC } from 'react';
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { FormField } from '../../types/ats';

interface FieldItemCardProps {
  field: FormField;
  index: number;
  totalFields: number;
  isDragged: boolean;
  isDragOver: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
  onMoveField: (index: number, direction: 'up' | 'down') => void;
  onEditField: (field: FormField) => void;
  onRemoveField: (id: string, label: string) => void;
}

export const FieldItemCard: FC<FieldItemCardProps> = ({
  field,
  index,
  totalFields,
  isDragged,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveField,
  onEditField,
  onRemoveField,
}) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      onDragEnd={onDragEnd}
      className={`flex items-center justify-between p-3.5 bg-slate-950 border rounded-2xl transition-all duration-150 group select-none ${
        isDragged
          ? 'opacity-30 border-dashed border-indigo-500 scale-[0.98]'
          : isDragOver
          ? 'border-indigo-400 bg-indigo-950/20 ring-2 ring-indigo-500/30'
          : 'border-slate-800 hover:border-slate-700/80 hover:shadow-lg'
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className="text-slate-600 group-hover:text-indigo-400 cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>

        <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-400 shrink-0">
          {index + 1}
        </div>

        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-tight truncate">{field.label}</span>
            {field.required ? (
              <span className="text-[10px] text-rose-400 font-bold">* Required</span>
            ) : (
              <span className="text-[10px] text-slate-500">Optional</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
            <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 uppercase font-mono text-[9px] text-slate-300">
              {field.type}
            </span>
            {field.type === 'select' && field.options && (
              <span className="text-slate-500 text-[10px]">({field.options.length} options configured)</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={() => onMoveField(index, 'up')}
          disabled={index === 0}
          title="Move up"
          className="p-1.5 rounded-lg hover:bg-slate-900 disabled:opacity-30 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowUp size={13} />
        </button>

        <button
          type="button"
          onClick={() => onMoveField(index, 'down')}
          disabled={index === totalFields - 1}
          title="Move down"
          className="p-1.5 rounded-lg hover:bg-slate-900 disabled:opacity-30 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowDown size={13} />
        </button>

        <button
          type="button"
          onClick={() => onEditField(field)}
          title="تعديل السؤال والخيارات (Edit question & options)"
          className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <Pencil size={13} />
        </button>

        <button
          type="button"
          onClick={() => onRemoveField(field.id, field.label)}
          title="حذف السؤال (Remove question)"
          className="p-1.5 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};
