import { type FC } from 'react';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import type { Candidate } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';

interface DeleteCandidateModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteCandidateModal: FC<DeleteCandidateModalProps> = ({
  candidate,
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  const { t } = useLanguage();
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0E1524] border border-[#FF7A85]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FF7A85]/10 border border-[#FF7A85]/20 text-[#FF7A85] flex items-center justify-center mb-3">
            <Trash2 size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">
            {t('candidate.confirm_delete_title')}
          </h2>
          <p className="text-xs text-[#8892A6] mt-1.5 leading-relaxed">
            {candidate.name} (<span className="font-mono text-[#EEF1F7]">{candidate.email}</span>)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#FF7A85]/10 border border-[#FF7A85]/25 text-[#FF7A85] text-xs space-y-1 mb-6">
          <p className="font-bold flex items-center gap-1.5">
            <AlertTriangle size={14} className="shrink-0" /> {t('candidate.confirm_delete_desc')}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="btn-sec w-1/2 text-xs"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-danger w-1/2 text-xs"
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>{t('common.loading')}</span>
              </>
            ) : (
              <>
                <Trash2 size={15} />
                <span>{t('common.confirm')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
