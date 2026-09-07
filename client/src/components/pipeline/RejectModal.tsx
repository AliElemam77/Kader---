import { type FC } from 'react';
import { X, UserX, AlertTriangle, Sparkles, Mail } from 'lucide-react';
import type { Candidate } from '../../types/ats';
import { REJECTION_PRESETS } from '../../hooks/usePipeline';
import { useLanguage } from '../../context/LanguageContext';

interface RejectModalProps {
  rejectingCandidate: Candidate | null;
  rejectionReason: string;
  sendRejectionEmail: boolean;
  isSubmittingRejection: boolean;
  onClose: () => void;
  onReasonChange: (reason: string) => void;
  onSendEmailToggle: (send: boolean) => void;
  onConfirm: () => void;
}

export const RejectModal: FC<RejectModalProps> = ({
  rejectingCandidate,
  rejectionReason,
  sendRejectionEmail,
  isSubmittingRejection,
  onClose,
  onReasonChange,
  onSendEmailToggle,
  onConfirm,
}) => {
  const { t } = useLanguage();
  if (!rejectingCandidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0E1524] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF7A85]/10 text-[#FF7A85] border border-[#FF7A85]/20 mb-2">
            <UserX size={12} /> كادر • استبعاد باحترام
          </span>
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">{t('pipeline.reject_candidate')}</h2>
          <p className="text-xs text-[#8892A6] mt-1.5">
            المرشح: <strong className="text-[#EEF1F7]">{rejectingCandidate.name}</strong> (<span className="font-mono">{rejectingCandidate.email}</span>)
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#070A14] border border-white/10 text-xs text-[#8892A6] flex items-start gap-2.5 leading-relaxed">
            <AlertTriangle size={16} className="shrink-0 text-[#F5B23D] mt-0.5" />
            <p>
              احتراماً لوقت وجهد المرشح، لن يتم الاستبعاد الصامت. سيتم إرسال التغذية الراجعة البناءة المحددة أدناه في إيميل رسمي من منصة كادر.
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-[#EEF1F7] mb-2 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#F5B23D]" />
              <span>أسباب وملاحظات جاهزة:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {REJECTION_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onReasonChange(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    rejectionReason === preset
                      ? 'bg-[#F5B23D]/15 border-[#F5B23D] text-[#F5B23D] font-semibold'
                      : 'bg-[#070A14] border-white/10 text-[#8892A6] hover:border-white/20 hover:text-[#EEF1F7]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Textarea */}
          <div>
            <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5">
              نص التغذية الراجعة المرسلة للمرشح <span className="text-[#FF7A85]">*</span>
            </label>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="اكتب التغذية الراجعة البناءة التي توضح سبب عدم ملاءمة الملف للمرحلة الحالية..."
              className="w-full px-3.5 py-2.5 bg-[#070A14] border border-white/[0.12] rounded-xl text-xs text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 focus:ring-[#FF7A85]/40 focus:border-[#FF7A85] transition-all resize-none"
            />
          </div>

          {/* Email Checkbox */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#070A14] border border-white/[0.08]">
            <input
              type="checkbox"
              id="sendRejectionEmailCheck"
              checked={sendRejectionEmail}
              onChange={(e) => onSendEmailToggle(e.target.checked)}
              className="rounded border-white/20 text-[#FF7A85] focus:ring-[#FF7A85] bg-[#151E31] cursor-pointer"
            />
            <label htmlFor="sendRejectionEmailCheck" className="text-xs text-[#8892A6] cursor-pointer select-none">
              إرسال إيميل التغذية الراجعة تلقائياً إلى بريد المرشح
            </label>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-sec w-1/3 text-xs"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmittingRejection || !rejectionReason.trim()}
              className="btn-danger w-2/3 text-xs justify-center disabled:opacity-50"
            >
              <span>{isSubmittingRejection ? t('common.loading') : 'تأكيد الاستبعاد وإرسال البريد'}</span>
              <Mail size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
