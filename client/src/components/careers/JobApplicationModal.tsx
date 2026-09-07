import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  X,
  Building2,
  MapPin,
  Send,
  Loader2,
  AlertCircle,
  FileText,
  Upload,
  Check,
} from 'lucide-react';
import type { Job, FormField } from '../../types/ats';
import { API_BASE_URL } from '../../config/api';
import { KaderMark } from '../common/KaderLogo';
import { useLanguage } from '../../context/LanguageContext';

interface JobApplicationModalProps {
  job: Job;
  onClose: () => void;
}

export const JobApplicationModal: FC<JobApplicationModalProps> = ({ job, onClose }) => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [appReferenceCode] = useState(() => `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

  // 1. Sort questions strictly by configured order
  const rawFields: FormField[] =
    job.formFields && Array.isArray(job.formFields) && job.formFields.length > 0
      ? job.formFields
      : [
          { id: 'full_name', label: 'الاسم بالكامل (Full Name)', type: 'text', required: true, order: 1 },
          { id: 'email', label: 'البريد الإلكتروني (Email Address)', type: 'email', required: true, order: 2 },
          { id: 'phone', label: 'رقم الهاتف (Phone Number)', type: 'text', required: false, order: 3 },
        ];

  // Guarantee name and email exist for candidate record creation
  const hasName = rawFields.some(
    (f) => f.id === 'full_name' || f.id === 'name' || f.label.toLowerCase().includes('name') || f.label.includes('اسم')
  );
  const hasEmail = rawFields.some(
    (f) => f.id === 'email' || f.type === 'email' || f.label.toLowerCase().includes('email') || f.label.includes('بريد')
  );

  const allFields: FormField[] = [...rawFields];
  if (!hasName) {
    allFields.unshift({ id: 'full_name', label: 'الاسم بالكامل (Full Name)', type: 'text', required: true, order: 0 });
  }
  if (!hasEmail) {
    allFields.splice(1, 0, { id: 'email', label: 'البريد الإلكتروني (Email Address)', type: 'email', required: true, order: 0.5 });
  }

  const sortedFields = allFields.sort((a, b) => (a.order || 0) - (b.order || 0));

  // 2. Generate dynamic Zod validation schema tailored to this specific job's fields
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  sortedFields.forEach((f) => {
    if (f.type === 'email' || f.id === 'email') {
      schemaShape[f.id] = f.required
        ? z.string().min(1, `${f.label} مطلوب`).email('يرجى إدخال بريد إلكتروني صحيح')
        : z.string().email('يرجى إدخال بريد إلكتروني صحيح').optional().or(z.literal(''));
    } else if (f.type === 'number') {
      schemaShape[f.id] = f.required
        ? z.coerce.number().min(0, `${f.label} مطلوب`)
        : z.coerce.number().optional().or(z.literal(''));
    } else if (f.type === 'checkbox') {
      schemaShape[f.id] = f.required
        ? z.boolean().refine((val) => val === true, `${f.label} مطلوب`)
        : z.boolean().optional();
    } else if (f.type === 'file') {
      schemaShape[f.id] = f.required ? z.string().min(1, `يرجى إرفاق ${f.label}`) : z.string().optional();
    } else {
      schemaShape[f.id] = f.required ? z.string().min(1, `${f.label} مطلوب`) : z.string().optional();
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, any>>({
    resolver: zodResolver(z.object(schemaShape)),
    mode: 'onTouched',
  });

  const handleFileUpload = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [fieldId]: file.name }));
      setValue(fieldId, file.name, { shouldValidate: true });
      toast.success(`تم إرفاق الملف: ${file.name}`);
    }
  };

  const onSubmit = async (data: Record<string, any>) => {
    setSubmitError(null);

    const nameVal = data.full_name || data.name || Object.entries(data).find(([k]) => k.includes('name'))?.[1] || 'مرشح كادر';
    const emailVal = data.email || Object.entries(data).find(([k]) => k.includes('email'))?.[1];
    const phoneVal = data.phone || Object.entries(data).find(([k]) => k.includes('phone'))?.[1] || '';

    setCandidateName(String(nameVal));

    const payload = {
      jobId: job.id,
      name: String(nameVal),
      email: String(emailVal),
      phone: String(phoneVal),
      resumeUrl: uploadedFiles.resume || uploadedFiles.cv || undefined,
      applicantData: data,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/public/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setSubmitted(true);
        toast.success(t('careers.application_success'));
      } else {
        const errorMsg = resJson.message?.includes('already applied') || resJson.message?.includes('مسبق')
          ? t('careers.duplicate_email_error')
          : (resJson.message || 'حدث خطأ أثناء إرسال طلب التقديم');
        setSubmitError(errorMsg);
        toast.error(errorMsg);
      }
    } catch {
      const netMsg = 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً';
      setSubmitError(netMsg);
      toast.error(netMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0E1524] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {submitted ? (
          /* Submission Success State (Per Kader Brand Book) */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#070A14] border border-white/10 flex items-center justify-center mx-auto shadow-xl">
              <KaderMark size={32} />
            </div>

            <h3 className="text-2xl font-bold text-[#EEF1F7]">وصلنا طلبك</h3>

            <p className="text-sm text-[#8892A6] max-w-sm mx-auto leading-relaxed">
              سجّلنا تقديمك {candidateName ? `يا ${candidateName}` : ''} على وظيفة «<strong className="text-[#EEF1F7]">{job.title}</strong>». طلبك الآن في مسار التوظيف، وسنراسلك عند أي تغيّر في حالته.
            </p>

            <div className="p-4 bg-[#FEF9EE] border border-[#F3DFBB] rounded-2xl text-xs text-[#6B5426] max-w-sm mx-auto text-start leading-relaxed shadow-sm">
              <strong>ملاحظة:</strong> مدة المراجعة تصل إلى خمسة أيام عمل. احتفظ برقم الطلب للرجوع إليه في أي مراسلة.
            </div>

            <div>
              <span className="inline-block bg-[#070A14] text-[#EEF1F7] font-mono text-xs font-semibold px-4 py-1.5 rounded-full border border-white/10">
                {appReferenceCode}
              </span>
            </div>

            <div>
              <button
                onClick={onClose}
                className="btn-pri text-xs px-6 py-2.5 rounded-xl cursor-pointer mt-2"
              >
                العودة للوظائف الشاغرة
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 pb-4 border-b border-white/[0.08]">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5B23D]/10 text-[#F5B23D] border border-[#F5B23D]/20 mb-2">
                كادر • استمارة التقديم
              </span>
              <h2 className="text-xl font-bold text-[#EEF1F7] leading-tight">{job.title}</h2>
              <div className="flex items-center gap-3 text-xs text-[#8892A6] mt-1.5">
                <span className="flex items-center gap-1">
                  <Building2 size={12} className="text-[#4C8DFF]" />
                  {job.department || 'General'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-[#F5B23D]" />
                  {job.location || 'Remote'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {sortedFields.map((f) => {
                const error = errors[f.id];

                return (
                  <div key={f.id} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#EEF1F7]">
                      {f.label} {f.required && <span className="text-[#FF7A85]">*</span>}
                    </label>

                    {f.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        placeholder={f.placeholder || `اكتب إجابتك هنا...`}
                        {...register(f.id)}
                        className={`w-full px-3.5 py-2.5 bg-[#070A14] border rounded-xl text-sm text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 transition-all resize-none ${
                          error
                            ? 'border-[#FF7A85] focus:ring-[#FF7A85]/30'
                            : 'border-white/[0.12] focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]'
                        }`}
                      />
                    ) : f.type === 'select' ? (
                      <select
                        {...register(f.id)}
                        className={`w-full px-3.5 py-2.5 bg-[#070A14] border rounded-xl text-sm text-[#EEF1F7] focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                          error
                            ? 'border-[#FF7A85] focus:ring-[#FF7A85]/30'
                            : 'border-white/[0.12] focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]'
                        }`}
                      >
                        <option value="">اختر من القائمة...</option>
                        {f.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : f.type === 'file' ? (
                      <div>
                        <input
                          type="file"
                          id={`file-input-${f.id}`}
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(f.id, e)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`file-input-${f.id}`}
                          className={`flex items-center justify-between p-3 rounded-xl border border-dashed transition-all cursor-pointer ${
                            uploadedFiles[f.id]
                              ? 'border-[#35D6A4]/60 bg-[#35D6A4]/10 text-[#35D6A4]'
                              : error
                              ? 'border-[#FF7A85]/60 bg-[#FF7A85]/10 text-[#FF7A85]'
                              : 'border-white/[0.12] bg-[#070A14] hover:border-[#F5B23D]/50 hover:bg-[#151E31] text-[#8892A6]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <FileText size={16} className={uploadedFiles[f.id] ? 'text-[#35D6A4]' : 'text-[#4C8DFF]'} />
                            <span className="text-xs truncate">
                              {uploadedFiles[f.id] ? uploadedFiles[f.id] : 'انقر لرفع ملف (PDF أو Word)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-semibold">
                            {uploadedFiles[f.id] ? (
                              <span className="flex items-center gap-1 text-[#35D6A4]">
                                <Check size={14} /> تم الرفع
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[#4C8DFF]">
                                <Upload size={13} /> اختيار ملف
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    ) : f.type === 'checkbox' ? (
                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#070A14] border border-white/[0.12] text-xs text-[#EEF1F7] cursor-pointer select-none">
                        <input
                          type="checkbox"
                          {...register(f.id)}
                          className="rounded border-white/20 text-[#F5B23D] focus:ring-[#F5B23D] bg-[#151E31] cursor-pointer w-4 h-4"
                        />
                        <span>{f.placeholder || f.label}</span>
                      </label>
                    ) : (
                      <input
                        type={f.type === 'number' ? 'number' : f.type === 'email' ? 'email' : 'text'}
                        placeholder={f.placeholder || `أدخل ${f.label}`}
                        {...register(f.id)}
                        className={`w-full px-3.5 py-2.5 bg-[#070A14] border rounded-xl text-sm text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 transition-all ${
                          error
                            ? 'border-[#FF7A85] focus:ring-[#FF7A85]/30'
                            : 'border-white/[0.12] focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]'
                        }`}
                      />
                    )}

                    {error && (
                      <p className="flex items-center gap-1 text-[11px] text-[#FF7A85] mt-1">
                        <AlertCircle size={12} /> {String(error.message || '')}
                      </p>
                    )}
                  </div>
                );
              })}

              {submitError && (
                <div className="p-3.5 rounded-xl bg-[#FF7A85]/10 border border-[#FF7A85]/30 text-[#FF7A85] text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="text-[#FF7A85] shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/[0.08]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pri w-full py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{t('careers.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('careers.submit_application')}</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
