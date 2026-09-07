import { type FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { PlusCircle, AlertCircle } from 'lucide-react';
import type { NewFieldFormValues } from '../../hooks/useFormBuilder';

interface NewFieldFormProps {
  form: UseFormReturn<NewFieldFormValues>;
  onSubmit: (data: NewFieldFormValues) => void;
}

export const NewFieldForm: FC<NewFieldFormProps> = ({ form, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="p-5 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
        <PlusCircle size={15} className="text-indigo-400" />
        <span>إضافة سؤال جديد إلى النموذج (Add New Question)</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Question label (e.g. Expected Salary in SAR / Years of React)"
            {...register('label')}
            className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.label
                ? 'border-rose-500/60 focus:ring-rose-500/40'
                : 'border-slate-800 focus:ring-indigo-500'
            }`}
          />
          {errors.label && (
            <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
              <AlertCircle size={12} /> {errors.label.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            {...register('type')}
            className="w-full sm:w-1/2 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="text">Short Text (نص قصير)</option>
            <option value="textarea">Paragraph / Long Text (نص طويل)</option>
            <option value="number">Number (رقم / سنوات)</option>
            <option value="email">Email Address (بريد إلكتروني)</option>
            <option value="select">Dropdown Select (قائمة خيارات)</option>
            <option value="file">File Upload / PDF (رفع ملف)</option>
            <option value="checkbox">Agreement Checkbox (موافقة / إقرار)</option>
          </select>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('required')}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950 cursor-pointer"
            />
            <span>إجباري (Required)</span>
          </label>

          <button
            type="submit"
            className="w-full sm:w-auto ml-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            Add Question
          </button>
        </div>
      </form>
    </div>
  );
};
