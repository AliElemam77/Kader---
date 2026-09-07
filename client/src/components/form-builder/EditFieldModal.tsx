import { type FC } from 'react';
import { X, Pencil, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import type { FormField } from '../../types/ats';

interface EditFieldModalProps {
  editingField: FormField | null;
  newOptionText: string;
  onClose: () => void;
  onFieldChange: (field: FormField) => void;
  onNewOptionTextChange: (text: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onSave: () => void;
}

export const EditFieldModal: FC<EditFieldModalProps> = ({
  editingField,
  newOptionText,
  onClose,
  onFieldChange,
  onNewOptionTextChange,
  onAddOption,
  onRemoveOption,
  onSave,
}) => {
  if (!editingField) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Pencil size={11} /> Field Customization
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">Edit Form Question</h2>
          <p className="text-xs text-slate-400">
            Modify question title, requirement, or configured options.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Question Label (نص السؤال) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={editingField.label}
              onChange={(e) => onFieldChange({ ...editingField, label: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <input
              type="checkbox"
              id="editFieldRequired"
              checked={editingField.required}
              onChange={(e) => onFieldChange({ ...editingField, required: e.target.checked })}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
            />
            <label htmlFor="editFieldRequired" className="text-xs text-slate-300 cursor-pointer select-none">
              حقل إجباري (Candidate cannot submit without filling)
            </label>
          </div>

          {editingField.type === 'select' && (
            <div className="space-y-2 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <label className="block text-xs font-semibold text-slate-300">
                Dropdown Options (خيارات القائمة المنسدلة):
              </label>

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {editingField.options?.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-xs text-slate-200">
                    <span>{opt}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveOption(oIdx)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="New option name..."
                  value={newOptionText}
                  onChange={(e) => onNewOptionTextChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onAddOption();
                    }
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={onAddOption}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shrink-0"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="w-2/3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Save & Update Field</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
