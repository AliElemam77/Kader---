import { type FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { X, UserCheck, AlertCircle, Mail, User } from 'lucide-react';
import type { TeamMember, EditFormValues } from '../../hooks/useTeam';
import { useLanguage } from '../../context/LanguageContext';

interface EditMemberModalProps {
  editingMember: TeamMember | null;
  form: UseFormReturn<EditFormValues>;
  onClose: () => void;
  onSubmit: (data: EditFormValues) => void;
}

export const EditMemberModal: FC<EditMemberModalProps> = ({
  editingMember,
  form,
  onClose,
  onSubmit,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  if (!editingMember) return null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0E1524] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#F5B23D]/10 border border-[#F5B23D]/25 flex items-center justify-center text-[#F5B23D]">
            <UserCheck size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#EEF1F7]">
              {isAr ? 'تعديل بيانات عضو الفريق' : 'Edit Team Member'}
            </h3>
            <p className="text-xs text-[#8892A6] font-mono">{editingMember.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5">
              {isAr ? 'الاسم بالكامل' : 'Full Name'} <span className="text-[#FF7A85]">*</span>
            </label>
            <div
              className={`flex items-center w-full px-3.5 py-2.5 bg-[#070A14] border rounded-xl transition-all ${
                errors.name
                  ? 'border-[#FF7A85] ring-2 ring-[#FF7A85]/30'
                  : 'border-white/[0.12] focus-within:border-[#F5B23D] focus-within:ring-2 focus-within:ring-[#F5B23D]/40'
              }`}
            >
              <User size={15} className="text-[#8892A6] shrink-0 me-3" />
              <input
                type="text"
                {...register('name')}
                placeholder={isAr ? 'الاسم' : 'Name'}
                className="w-full bg-transparent text-sm text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none"
              />
            </div>
            {errors.name && (
              <p className="flex items-center gap-1 text-[11px] text-[#FF7A85] mt-1">
                <AlertCircle size={12} /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5">
              {isAr ? 'البريد الإلكتروني المؤسسي' : 'Work Email Address'} <span className="text-[#FF7A85]">*</span>
            </label>
            <div
              className={`flex items-center w-full px-3.5 py-2.5 bg-[#070A14] border rounded-xl transition-all ${
                errors.email
                  ? 'border-[#FF7A85] ring-2 ring-[#FF7A85]/30'
                  : 'border-white/[0.12] focus-within:border-[#F5B23D] focus-within:ring-2 focus-within:ring-[#F5B23D]/40'
              }`}
            >
              <Mail size={15} className="text-[#8892A6] shrink-0 me-3" />
              <input
                type="email"
                {...register('email')}
                placeholder="colleague@kader.sa"
                className="w-full bg-transparent text-sm text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none"
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1 text-[11px] text-[#FF7A85] mt-1">
                <AlertCircle size={12} /> {errors.email.message}
              </p>
            )}
            <p className="text-[11px] text-[#5A6478] mt-1">
              {isAr
                ? 'تعديل البريد يحرر البريد القديم ويسمح باستخدامه لحساب آخر.'
                : 'Updating the email frees up the old address for reassignment.'}
            </p>
          </div>

          {/* Role & Permissions */}
          <div>
            <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5">
              {isAr ? 'الدور الوظيفي والصلاحيات' : 'Role & Permissions'} <span className="text-[#FF7A85]">*</span>
            </label>
            <select
              {...register('role')}
              className="w-full px-3.5 py-2.5 bg-[#070A14] border border-white/[0.12] rounded-xl text-xs text-[#EEF1F7] focus:outline-none focus:ring-2 focus:ring-[#F5B23D] cursor-pointer"
            >
              <option value="RECRUITER">
                {isAr
                  ? 'مسؤول توظيف (Recruiter) — إدارة الوظائف والمسار والمقابلات'
                  : 'Recruiter — Manage jobs, pipeline, and candidate interviews'}
              </option>
              <option value="HR_MANAGER">
                {isAr
                  ? 'مدير توظيف (HR Manager) — كامل الصلاحيات وإدارة الفريق'
                  : 'HR Manager — Full administrative privileges & team management'}
              </option>
            </select>
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5">
              {isAr ? 'حالة الحساب' : 'Account Status'} <span className="text-[#FF7A85]">*</span>
            </label>
            <select
              {...register('status')}
              className="w-full px-3.5 py-2.5 bg-[#070A14] border border-white/[0.12] rounded-xl text-xs text-[#EEF1F7] focus:outline-none focus:ring-2 focus:ring-[#F5B23D] cursor-pointer"
            >
              <option value="ACTIVE">{isAr ? 'نشط (مسموح بالدخول والعمل)' : 'Active (Access enabled)'}</option>
              <option value="INVITED">{isAr ? 'تمت الدعوة (بانتظار تسجيل الدخول)' : 'Invited (Pending login)'}</option>
              <option value="DEACTIVATED">{isAr ? 'معطل (إيقاف صلاحيات الدخول)' : 'Deactivated (Suspended)'}</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-sec w-1/2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pri w-1/2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
