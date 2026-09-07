import type { FC } from 'react';
import { X, AlertTriangle, Trash2, Loader2, Users } from 'lucide-react';
import type { Job } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';

interface DeleteJobModalProps {
  job: Job | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteJobModal: FC<DeleteJobModalProps> = ({
  job,
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  const { language } = useLanguage();
  if (!isOpen || !job) return null;

  const isAr = language === 'ar';

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
            {isAr ? 'حذف الوظيفة نهائياً' : 'Delete Job Position'}
          </h2>
          <p className="text-sm font-semibold text-[#EEF1F7] mt-1.5">
            {job.title}
          </p>
          <p className="text-xs text-[#8892A6] mt-0.5">
            {job.department} • {job.location}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#FF7A85]/10 border border-[#FF7A85]/25 text-[#FF7A85] text-xs space-y-2 mb-6">
          <p className="font-bold flex items-center gap-1.5">
            <AlertTriangle size={15} className="shrink-0" />
            {isAr
              ? 'هل أنت متأكد من رغبتك في حذف هذه الوظيفة؟'
              : 'Are you sure you want to permanently delete this job?'}
          </p>
          <p className="leading-relaxed text-[#FF7A85]/90">
            {isAr
              ? `سيتم حذف هذه الوظيفة وجميع المرشحين (${job.candidatesCount || 0} مرشح) ومراحل المسار المرتبطة بها فوراً من قاعدة البيانات. لا يمكن التراجع عن هذا الإجراء.`
              : `This job position and all associated candidates (${job.candidatesCount || 0} candidates) and custom pipeline stages will be permanently removed from PostgreSQL. This action cannot be undone.`}
          </p>
        </div>

        {job.candidatesCount && job.candidatesCount > 0 ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#8892A6] mb-6">
            <Users size={14} className="text-[#F5B23D] shrink-0" />
            <span>
              {isAr
                ? `تحتوي هذه الوظيفة على ${job.candidatesCount} مرشح في المسار.`
                : `This job has ${job.candidatesCount} candidates in its pipeline.`}
            </span>
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="btn-sec w-1/2 text-xs py-2.5 cursor-pointer"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-danger w-1/2 text-xs py-2.5 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>{isAr ? 'جاري الحذف...' : 'Deleting...'}</span>
              </>
            ) : (
              <>
                <Trash2 size={15} />
                <span>{isAr ? 'حذف الوظيفة' : 'Delete Job'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
