import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';
import { useLanguage } from '../context/LanguageContext';

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid work email address'),
});

export const otpSchema = z.object({
  code: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;

export function useHRAuth(
  onSuccess: (token: string, user: any) => void,
  onClose: () => void,
  initialEmail?: string
) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [step, setStep] = useState<'EMAIL' | 'OTP'>(initialEmail ? 'OTP' : 'EMAIL');
  const [currentEmail, setCurrentEmail] = useState(initialEmail || '');
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: initialEmail || '' },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    if (initialEmail) {
      setCurrentEmail(initialEmail);
      setStep('OTP');
      emailForm.setValue('email', initialEmail);
    }
  }, [initialEmail]);

  // Step 1: Request Access
  const onRequestAccess = async (data: EmailFormValues) => {
    const toastId = toast.loading(isAr ? 'جاري إرسال رمز التحقق...' : 'Sending 6-digit verification code...');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/request-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email.trim().toLowerCase() }),
      });
      const resJson = await res.json();

      if (resJson.success) {
        setCurrentEmail(data.email.trim().toLowerCase());
        setStep('OTP');
        if (resJson.data?.devOtp) {
          setDevOtp(resJson.data.devOtp);
        }
        const successMsg = resJson.data?.emailSent
          ? (isAr ? 'تم إرسال رمز التحقق لبريدك الإلكتروني، وهو متوفر أيضاً على الشاشة!' : 'Verification code sent to your email and available on screen!')
          : (isAr ? 'تم تجهيز رمز الدخول المباشر (وضع المعاينة DEV)!' : 'Direct login code generated (DEV Mode)!');
        toast.success(successMsg, { id: toastId });
      } else {
        toast.error(resJson.message || (isAr ? 'تم رفض طلب الدخول' : 'Access denied'), { id: toastId });
      }
    } catch {
      toast.error(isAr ? 'خطأ في الاتصال أثناء طلب رمز الدخول' : 'Network error requesting login code', { id: toastId });
    }
  };

  // Step 2: Verify OTP
  const onVerifyOtp = async (data: OtpFormValues) => {
    const toastId = toast.loading(isAr ? 'جاري التحقق من الرمز...' : 'Verifying code...');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, code: data.code.trim() }),
      });
      const resJson = await res.json();

      if (resJson.success && resJson.data?.token) {
        const welcomeMsg = isAr
          ? `تم تسجيل الدخول بنجاح! مرحباً بك يا ${resJson.data.user.name}`
          : `Welcome back, ${resJson.data.user.name}!`;
        toast.success(welcomeMsg, { id: toastId });
        onSuccess(resJson.data.token, resJson.data.user);
        onClose();
      } else {
        toast.error(resJson.message || (isAr ? 'رمز التحقق غير صحيح أو منتهي الصلاحية' : 'Invalid or expired verification code'), { id: toastId });
      }
    } catch {
      toast.error(isAr ? 'خطأ في الاتصال أثناء التحقق من الرمز' : 'Error verifying code', { id: toastId });
    }
  };

  const handleAutofillDemo = (demoEmail: string) => {
    emailForm.setValue('email', demoEmail);
    onRequestAccess({ email: demoEmail });
  };

  return {
    step,
    setStep,
    currentEmail,
    devOtp,
    emailForm,
    otpForm,
    onRequestAccess,
    onVerifyOtp,
    handleAutofillDemo,
  };
}
