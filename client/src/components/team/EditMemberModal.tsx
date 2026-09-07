import { type FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { X, UserCheck, AlertCircle } from 'lucide-react';
import type { TeamMember, EditFormValues } from '../../hooks/useTeam';

interface EditMemberModalProps {
  editingMember: TeamMember | null;
  form: UseFormReturn<EditFormValues>;
  onClose: () => void;
  onSubmit: (data: EditFormValues) => void;
}

export const EditMemberModal: FC<EditMemberModalProps> = ({
  editingMember,
  form,
  onClose,
  onSubmit,
}) => {
  if (!editingMember) return null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <UserCheck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Edit Team Member</h3>
            <p className="text-xs text-slate-400">{editingMember.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-rose-500/60 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:ring-indigo-500 focus:border-transparent'
              }`}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                <AlertCircle size={12} /> {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Role & Permissions <span className="text-rose-400">*</span>
            </label>
            <select
              {...register('role')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="RECRUITER">Recruiter</option>
              <option value="HR_MANAGER">HR Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Account Status <span className="text-rose-400">*</span>
            </label>
            <select
              {...register('status')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ACTIVE">Active (Can log in & manage)</option>
              <option value="INVITED">Invited (Pending login)</option>
              <option value="DEACTIVATED">Deactivated (Access suspended)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
