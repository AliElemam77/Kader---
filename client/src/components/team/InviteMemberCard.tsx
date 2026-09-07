import { type FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { UserPlus, AlertCircle, Mail } from 'lucide-react';
import type { InviteFormValues } from '../../hooks/useTeam';

interface InviteMemberCardProps {
  form: UseFormReturn<InviteFormValues>;
  onSubmit: (data: InviteFormValues) => void;
}

export const InviteMemberCard: FC<InviteMemberCardProps> = ({ form, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="bg-[#0E1524] border border-white/[0.08] rounded-2xl p-6 shadow-xl h-fit">
      <div className="flex items-center gap-2 mb-2">
        <UserPlus size={20} className="text-[#F5B23D]" />
        <h3 className="text-base font-bold text-[#EEF1F7]">دعوة عضو جديد للفريق</h3>
      </div>
      <p className="text-xs text-[#8892A6] mb-6 leading-relaxed">
        سيتم إرسال إيميل ترحيبي رسمي للمنضم الجديد يحتوي على رابط الدخول السريع ورمز التحقق.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5">
            الاسم بالكامل <span className="text-[#FF7A85]">*</span>
          </label>
          <input
            type="text"
            placeholder="مثال: ليلى أحمد"
            {...register('name')}
            className={`w-full px-3.5 py-2.5 bg-[#070A14] border rounded-xl text-sm text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? 'border-[#FF7A85] focus:ring-[#FF7A85]/30'
                : 'border-white/[0.12] focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]'
            }`}
          />
          {errors.name && (
            <p className="flex items-center gap-1 text-[11px] text-[#FF7A85] mt-1">
              <AlertCircle size={12} /> {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5">
            البريد الإلكتروني المؤسسي <span className="text-[#FF7A85]">*</span>
          </label>
          <input
            type="email"
            placeholder="layla@kader.com"
            {...register('email')}
            className={`w-full px-3.5 py-2.5 bg-[#070A14] border rounded-xl text-sm text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? 'border-[#FF7A85] focus:ring-[#FF7A85]/30'
                : 'border-white/[0.12] focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]'
            }`}
          />
          {errors.email && (
            <p className="flex items-center gap-1 text-[11px] text-[#FF7A85] mt-1">
              <AlertCircle size={12} /> {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5">
            الدور والصلاحيات <span className="text-[#FF7A85]">*</span>
          </label>
          <select
            {...register('role')}
            className="w-full px-3.5 py-2.5 bg-[#070A14] border border-white/[0.12] rounded-xl text-sm text-[#EEF1F7] focus:outline-none focus:ring-2 focus:ring-[#F5B23D] cursor-pointer"
          >
            <option value="RECRUITER">مسؤول توظيف (Recruiter) — إدارة الوظائف والمسار والمقابلات</option>
            <option value="HR_MANAGER">مدير كادر (HR Manager) — صلاحيات كاملة: الفريق والإعدادات</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-pri w-full py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <span>إرسال دعوة الانضمام</span>
          <Mail size={15} />
        </button>
      </form>
    </div>
  );
};
