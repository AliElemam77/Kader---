import { type FC } from 'react';
import { X, AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';
import type { PipelineStage } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';

interface DeleteStageModalProps {
  deletingStage: { stage: PipelineStage; candidatesCount: number } | null;
  stages: PipelineStage[];
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteStageModal: FC<DeleteStageModalProps> = ({
  deletingStage,
  stages,
  onClose,
  onConfirm,
}) => {
  const { t } = useLanguage();
  if (!deletingStage) return null;

  const fallbackStage = stages.find((s) => s.id !== deletingStage.stage.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0E1524] border border-[#FF7A85]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FF7A85]/10 border border-[#FF7A85]/20 text-[#FF7A85] flex items-center justify-center mb-3">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">
            {t('pipeline.delete_stage_title')}: {deletingStage.stage.name}
          </h2>
          <p className="text-xs text-[#8892A6] mt-1.5">
            هل أنت متأكد من حذف هذه المرحلة من مسار كادر؟
          </p>
        </div>

        {deletingStage.candidatesCount > 0 ? (
          <div className="p-4 rounded-xl bg-[#F5B23D]/10 border border-[#F5B23D]/20 text-[#F5B23D] text-xs space-y-1 mb-6">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle size={14} /> تنبيه: المرحلة تحتوي على {deletingStage.candidatesCount} مرشح
            </p>
            <p className="text-[#F5B23D]/80 leading-relaxed text-[11px]">
              جميع المرشحين في هذه المرحلة سيتم نقلهم تلقائياً وبأمان إلى المرحلة الأولى ({fallbackStage?.name || 'البداية'}) لضمان عدم ضياع بياناتهم.
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-[#070A14] border border-white/[0.08] text-[#8892A6] text-xs mb-6">
            لا يوجد أي مرشحين حالياً في هذه المرحلة. سيتم حذفها نهائياً من قاعدة البيانات.
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-sec w-1/2 text-xs"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-danger w-1/2 text-xs"
          >
            <Trash2 size={15} />
            <span>{t('common.confirm')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
