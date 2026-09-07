import type { FC } from 'react';
import { X } from 'lucide-react';
import { useHRAuth } from '../hooks/useHRAuth';
import { EmailStepForm } from './auth/EmailStepForm';
import { OtpStepForm } from './auth/OtpStepForm';
import { KaderMark } from './common/KaderLogo';
import { useLanguage } from '../context/LanguageContext';

interface HRLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: any) => void;
}

export const HRLoginModal: FC<HRLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const {
    step,
    setStep,
    currentEmail,
    devOtp,
    emailForm,
    otpForm,
    onRequestAccess,
    onVerifyOtp,
    handleAutofillDemo,
  } = useHRAuth(onSuccess, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0E1524] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#070A14] border border-white/10 flex items-center justify-center mx-auto mb-3 shadow-xl">
            <KaderMark size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">{t('auth.login_title')}</h2>
          <p className="text-xs text-[#8892A6] mt-1.5 leading-relaxed">
            {t('auth.login_subtitle')}
          </p>
        </div>

        {step === 'EMAIL' ? (
          <EmailStepForm
            form={emailForm}
            onSubmit={onRequestAccess}
            onAutofillDemo={handleAutofillDemo}
          />
        ) : (
          <OtpStepForm
            currentEmail={currentEmail}
            devOtp={devOtp}
            form={otpForm}
            onSubmit={onVerifyOtp}
            onBackToEmail={() => {
              setStep('EMAIL');
              otpForm.reset();
            }}
            onResend={() => onRequestAccess({ email: currentEmail })}
          />
        )}
      </div>
    </div>
  );
};
