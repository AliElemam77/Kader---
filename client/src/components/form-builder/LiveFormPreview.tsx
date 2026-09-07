import { type FC } from 'react';
import { Eye, FileText, CheckCircle2 } from 'lucide-react';
import type { FormField } from '../../types/ats';

interface LiveFormPreviewProps {
  fields: FormField[];
}

export const LiveFormPreview: FC<LiveFormPreviewProps> = ({ fields }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Live Candidate Preview</h3>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Interactive Form</span>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {field.label} {field.required && <span className="text-rose-400">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                disabled
                placeholder={`Enter your ${field.label.toLowerCase()}...`}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 opacity-80 cursor-not-allowed"
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                disabled
                placeholder="0"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 opacity-80 cursor-not-allowed"
              />
            )}

            {field.type === 'email' && (
              <input
                type="email"
                disabled
                placeholder="alex@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 opacity-80 cursor-not-allowed"
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                disabled
                rows={3}
                placeholder="Write your response here..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 opacity-80 cursor-not-allowed"
              />
            )}

            {field.type === 'select' && (
              <select
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 opacity-80 cursor-not-allowed"
              >
                <option value="">-- Select an option --</option>
                {field.options?.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'file' && (
              <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center bg-slate-950 opacity-80 cursor-not-allowed">
                <FileText size={20} className="mx-auto text-slate-500 mb-1" />
                <span className="text-[11px] text-slate-400 font-medium">Click to upload PDF or drag file</span>
              </div>
            )}

            {field.type === 'checkbox' && (
              <label className="flex items-center gap-2 text-xs text-slate-400 opacity-80 cursor-not-allowed">
                <input type="checkbox" disabled className="rounded border-slate-700 bg-slate-950" />
                <span>I agree and confirm the above statement</span>
              </label>
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            disabled
            className="w-full py-3 rounded-xl text-xs font-bold bg-indigo-600/50 text-white cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Submit Application (Preview)</span>
            <CheckCircle2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
