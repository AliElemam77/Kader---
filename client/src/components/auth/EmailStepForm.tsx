import type { FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import type { EmailFormValues } from '../../hooks/useHRAuth';
import { useLanguage } from '../../context/LanguageContext';

interface EmailStepFormProps {
  form: UseFormReturn<EmailFormValues>;
  onSubmit: (data: EmailFormValues) => void;
  onAutofillDemo: (email: string) => void;
}

export const EmailStepForm: FC<EmailStepFormProps> = ({
  form,
  onSubmit,
  onAutofillDemo,
}) => {
  const { t, isRtl } = useLanguage();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div>
      {/* Portfolio / Dev Preview Notice */}
      <div className="p-3.5 rounded-2xl bg-[#F5B23D]/10 border border-[#F5B23D]/30 text-[11px] text-[#EEF1F7] mb-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-[#F5B23D] font-bold text-xs">
            <Sparkles size={13} />
            <span>وضع المعاينة لتقييم الـ CV • Demo Mode</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#F5B23D]/20 text-[#F5B23D] text-[9.5px] font-mono font-bold tracking-wider">
            DEV MODE ACTIVE
          </span>
        </div>

        <p className="text-[#EEF1F7] text-xs leading-relaxed">
          مرحباً بك! يمكنك كتابة أي بريد إلكتروني خاص بك أو النقر على أحد الحسابات التجريبية بالأسفل لاختبار لوحة التحكم فوراً، وسيظهر لك كود الـ OTP على الشاشة مباشرة.
        </p>

        <div className="p-2.5 rounded-xl bg-[#070A14]/80 border border-white/[0.08] text-[10.5px] text-[#8892A6] leading-relaxed">
          <strong className="text-white block mb-0.5">🔒 تنويه أمني معطياتي للمُقيّم:</strong>
          التسجيل التلقائي المفتوح متاح حالياً فقط لأن النظام يعمل بـ <span className="text-[#F5B23D] font-semibold">وضع التطوير (DEV MODE)</span> لتسهيل الفحص السريع. في بيئة العمل الإنتاجية الحقيقية، يقتصر دخول البوابة حصرياً على أعضاء فريق الـ HR الذين تتم إضافتهم ودعوتهم بواسطة <span className="text-[#35D6A4] font-semibold">مدير الموارد البشرية (HR Manager)</span> فقط.
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5">
            البريد الإلكتروني المؤسسي
          </label>
          <div className="relative">
            <Mail size={16} className="absolute inset-inline-start-3.5 top-1/2 -translate-y-1/2 text-[#8892A6]" />
            <input
              type="email"
              autoFocus
              placeholder="name@kader.com"
              {...register('email')}
              className={`w-full ps-10 pe-3.5 py-2.5 bg-[#070A14] border rounded-xl text-sm text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-[#FF7A85] focus:ring-[#FF7A85]/30'
                  : 'border-white/[0.12] focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-[11px] text-[#FF7A85] mt-1">
              <AlertCircle size={12} /> {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-pri w-full py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? t('auth.sending') : t('auth.send_code')}
          <ArrowRight size={15} className={isRtl ? 'rotate-180' : ''} />
        </button>
      </form>

      {/* Quick Demo Shortcuts */}
      <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
        <p className="text-[11px] text-[#8892A6] font-medium mb-2.5">
          ⚡ حسابات تجريبية سريعة (انقر للتجربة):
        </p>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => onAutofillDemo('admin@hire-ats.local')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#151E31] hover:bg-white/[0.08] text-[#EEF1F7] border border-white/10 transition-colors cursor-pointer"
          >
            <Sparkles size={12} className="text-[#F5B23D]" />
            <span>مدير كادر (Lead)</span>
          </button>
          <button
            type="button"
            onClick={() => onAutofillDemo('recruiter@hire-ats.local')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#151E31] hover:bg-white/[0.08] text-[#EEF1F7] border border-white/10 transition-colors cursor-pointer"
          >
            <span>مسؤول توظيف</span>
          </button>
        </div>
      </div>
    </div>
  );
};
