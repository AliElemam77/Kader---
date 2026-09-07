import { type FC } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import type { TeamMember } from '../../hooks/useTeam';

interface DeleteMemberModalProps {
  deletingMember: TeamMember | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteMemberModal: FC<DeleteMemberModalProps> = ({
  deletingMember,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!deletingMember) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-rose-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/40">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Remove Team Member?</h2>
          <p className="text-xs text-slate-400 mt-1">
            Are you sure you want to revoke access and remove{' '}
            <strong className="text-white">{deletingMember.name}</strong> ({deletingMember.email}) from this
            workspace?
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-1/2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={15} />
            <span>{isDeleting ? 'Removing...' : 'Confirm Remove'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
