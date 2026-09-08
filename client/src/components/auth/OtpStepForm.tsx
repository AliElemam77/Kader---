import type { FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { KeyRound, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import type { OtpFormValues } from '../../hooks/useHRAuth';
import { useLanguage } from '../../context/LanguageContext';

interface OtpStepFormProps {
  currentEmail: string;
  devOtp: string | null;
  form: UseFormReturn<OtpFormValues>;
  onSubmit: (data: OtpFormValues) => void;
  onBackToEmail: () => void;
  onResend: () => void;
}

export const OtpStepForm: FC<OtpStepFormProps> = ({
  currentEmail,
  devOtp,
  form,
  onSubmit,
  onBackToEmail,
  onResend,
}) => {
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div>
      <div className="p-3 rounded-2xl bg-[#070A14] border border-white/10 text-xs text-[#8892A6] text-center mb-4 leading-relaxed">
        أرسلنا رمز تحقق سداسي إلى <strong className="text-[#EEF1F7] font-mono">{currentEmail}</strong>. انسخ الرمز من بريدك والصقه هنا للدخول:
      </div>

      {devOtp && (
        <div className="p-4 rounded-2xl bg-[#35D6A4]/10 border border-dashed border-[#35D6A4]/40 text-center mb-4 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#35D6A4]/20 text-[#35D6A4] text-[10.5px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35D6A4] animate-pulse"></span>
            <span>وضع المعاينة والـ CV (Dev / Demo Mode)</span>
          </div>

          <p className="text-xs text-[#8892A6]">
            رمز التحقق الفوري لتقييم المنظومة بدون انتظار:
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className="text-lg font-mono font-bold tracking-[0.3em] text-[#EEF1F7] bg-[#070A14] px-4 py-1.5 rounded-xl border border-white/10 shadow-inner">
              {devOtp}
            </span>
            <button
              type="button"
              onClick={() => setValue('code', devOtp)}
              className="px-3.5 py-1.5 rounded-xl bg-[#35D6A4] hover:bg-[#2ec293] text-[#070A14] text-xs font-bold cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>لصق الكود فوراً</span>
            </button>
          </div>

          <p className="text-[10px] text-[#8892A6] pt-1.5 border-t border-white/[0.06] leading-relaxed">
            * تم إرسال الرمز أيضاً إلى بريدك. في بيئة العمل الحقيقية، الدخول مقتصر حصرياً على موظفي الـ HR المضافين بواسطة مدير النظام.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5 text-center">
            {t('auth.enter_code')}
          </label>
          <div className="relative">
            <KeyRound size={16} className="absolute inset-inline-start-3.5 top-1/2 -translate-y-1/2 text-[#8892A6]" />
            <input
              type="text"
              maxLength={6}
              autoFocus
              placeholder="000000"
              {...register('code')}
              className={`w-full ps-10 pe-4 py-3 bg-[#070A14] border rounded-xl text-xl font-mono tracking-[0.4em] text-center text-[#F5B23D] placeholder-[#5A6478] focus:outline-none focus:ring-2 transition-all ${
                errors.code
                  ? 'border-[#FF7A85] focus:ring-[#FF7A85]/30'
                  : 'border-white/[0.12] focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]'
              }`}
            />
          </div>
          {errors.code && (
            <p className="flex items-center justify-center gap-1 text-[11px] text-[#FF7A85] mt-1">
              <AlertCircle size={12} /> {errors.code.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-pri w-full py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? t('common.loading') : t('auth.verify_and_login')}
          <CheckCircle size={15} />
        </button>

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={onBackToEmail}
            className="text-[#8892A6] hover:text-[#EEF1F7] transition-colors cursor-pointer"
          >
            ← استخدام بريد آخر
          </button>

          <button
            type="button"
            onClick={onResend}
            className="inline-flex items-center gap-1 text-[#4C8DFF] hover:underline transition-colors cursor-pointer"
          >
            <RefreshCw size={11} /> إعادة إرسال الرمز
          </button>
        </div>
      </form>
    </div>
  );
};
