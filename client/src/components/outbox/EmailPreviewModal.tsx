import type { FC } from 'react';
import { X } from 'lucide-react';
import type { DispatchedEmail } from '../../hooks/useOutbox';

interface EmailPreviewModalProps {
  email: DispatchedEmail | null;
  onClose: () => void;
}

export const EmailPreviewModal: FC<EmailPreviewModalProps> = ({ email, onClose }) => {
  if (!email) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-4 pr-8">
          <span className="text-xs font-bold text-indigo-400">Email Preview</span>
          <h3 className="text-base font-bold text-white truncate">{email.subject}</h3>
          <p className="text-xs text-slate-400">Recipient: {email.to}</p>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-950 rounded-2xl p-4 border border-slate-800">
          <div
            className="prose prose-invert max-w-none text-xs"
            dangerouslySetInnerHTML={{ __html: email.html }}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
