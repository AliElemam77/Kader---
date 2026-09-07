import type { FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { X, Briefcase, Plus, AlertCircle } from 'lucide-react';
import type { CreateJobFormValues } from '../../hooks/useJobs';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<CreateJobFormValues>;
  onSubmit: (data: CreateJobFormValues) => void;
}

export const CreateJobModal: FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  form,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Briefcase size={11} /> New Role
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">Create Job Position</h2>
          <p className="text-xs text-slate-400 mt-1">
            Define the job role. Default pipeline stages and application questions will be initialized automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Job Position Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Senior DevOps Engineer"
              {...register('title')}
              className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-500/60 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:ring-indigo-500'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                <AlertCircle size={11} /> {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Employment Type <span className="text-rose-400">*</span>
              </label>
              <select
                {...register('employmentType')}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location & Modality <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Riyadh, KSA / Remote"
                {...register('location')}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Publishing Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="PUBLISHED">PUBLISHED (Accepting Applications)</option>
              <option value="DRAFT">DRAFT (Internal Only)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Job Description & Scope <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe key responsibilities, requirements, and tech stack..."
              {...register('description')}
              className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.description
                  ? 'border-rose-500/60 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:ring-indigo-500'
              }`}
            />
            {errors.description && (
              <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                <AlertCircle size={11} /> {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus size={15} />
              <span>{isSubmitting ? 'Creating...' : 'Create & Publish Job'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
