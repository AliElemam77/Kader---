import { type FC, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  X,
  Link as LinkIcon,
  MapPin,
  Mail,
  Video,
  Building2,
  ClipboardCheck,
  Calendar,
  FileText,
  User,
  ArrowRight,
} from 'lucide-react';
import type { Candidate, PipelineStage } from '../../types/ats';
import { useLanguage } from '../../context/LanguageContext';

interface ScheduleModalProps {
  schedulingCandidate: {
    candidate: Candidate;
    targetStage: PipelineStage;
    isEditing?: boolean;
  } | null;
  form: UseFormReturn<any>;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onMoveDirectly?: () => void;
}

export const ScheduleModal: FC<ScheduleModalProps> = ({
  schedulingCandidate,
  form,
  onClose,
  onSubmit,
  onMoveDirectly,
}) => {
  if (!schedulingCandidate) return null;

  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = form;

  const selectedModality = watch('modality');
  const selectedDate = watch('date');
  const includeTask = watch('includeTask');
  const includeInterview = watch('includeInterview');

  // Modern clean tabbed switcher: 'interview' | 'task' | 'notes'
  const [activeTab, setActiveTab] = useState<'interview' | 'task' | 'notes'>(() => {
    if (includeTask && !includeInterview) return 'task';
    return 'interview';
  });

  const getDayName = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return isAr ? daysAr[d.getDay()] : daysEn[d.getDay()];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0E1524] border border-white/[0.12] rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/90 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-xl text-[#8892A6] hover:text-[#EEF1F7] hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-4 text-start">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F5B23D]/15 text-[#F5B23D] border border-[#F5B23D]/30">
              {isAr ? 'تفاصيل المرحلة' : 'Stage Details'}
            </span>
            <span className="text-xs text-[#8892A6] font-medium">
              {schedulingCandidate.candidate.name}
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#EEF1F7] tracking-tight">
            {schedulingCandidate.isEditing
              ? (isAr ? 'تعديل موعد المقابلة' : 'Edit Interview Details')
              : (isAr ? `الانتقال إلى: ${schedulingCandidate.targetStage.name}` : `Move to: ${schedulingCandidate.targetStage.name}`)}
          </h2>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#070A14] border border-white/[0.08] rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('interview')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'interview'
                ? 'bg-[#151E31] text-white shadow-sm border border-white/10'
                : 'text-[#8892A6] hover:text-white'
            }`}
          >
            <Calendar size={14} className={includeInterview ? 'text-[#35D6A4]' : 'text-[#8892A6]'} />
            <span>{isAr ? 'المقابلة' : 'Interview'}</span>
            {includeInterview && <span className="w-1.5 h-1.5 rounded-full bg-[#35D6A4]" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('task')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'task'
                ? 'bg-[#151E31] text-white shadow-sm border border-white/10'
                : 'text-[#8892A6] hover:text-white'
            }`}
          >
            <ClipboardCheck size={14} className={includeTask ? 'text-[#F5B23D]' : 'text-[#8892A6]'} />
            <span>{isAr ? 'التكليف' : 'Task'}</span>
            {includeTask && <span className="w-1.5 h-1.5 rounded-full bg-[#F5B23D]" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-[#151E31] text-white shadow-sm border border-white/10'
                : 'text-[#8892A6] hover:text-white'
            }`}
          >
            <FileText size={14} className="text-[#8892A6]" />
            <span>{isAr ? 'ملاحظات' : 'Notes'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ============================================================ */}
          {/* TAB 1: INTERVIEW SCHEDULING */}
          {/* ============================================================ */}
          {activeTab === 'interview' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              {/* Activation Toggle Card */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#070A14] border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#35D6A4]" />
                  <span className="text-xs font-semibold text-[#EEF1F7]">
                    {isAr ? 'تحديد موعد مقابلة في هذه المرحلة' : 'Schedule an interview for this stage'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('includeInterview')}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#35D6A4]"></div>
                </label>
              </div>

              {includeInterview ? (
                <div className="space-y-3 pt-1">
                  {/* Modality Segmented Selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setValue('modality', 'ONLINE');
                        setValue('locationOrLink', 'https://meet.google.com/hire-' + Math.random().toString(36).substring(7));
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        selectedModality === 'ONLINE'
                          ? 'bg-[#4C8DFF]/15 border-[#4C8DFF] text-[#4C8DFF] shadow-sm'
                          : 'bg-[#070A14] border-white/10 text-[#8892A6] hover:border-white/20'
                      }`}
                    >
                      <Video size={14} />
                      <span>{isAr ? 'عن بعد (Google Meet)' : 'Remote (Google Meet)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setValue('modality', 'OFFLINE');
                        setValue('locationOrLink', isAr ? 'مقر الشركة - قاعة الاجتماعات الرئيسية' : 'Company HQ - Meeting Room Alpha');
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        selectedModality === 'OFFLINE'
                          ? 'bg-[#35D6A4]/15 border-[#35D6A4] text-[#35D6A4] shadow-sm'
                          : 'bg-[#070A14] border-white/10 text-[#8892A6] hover:border-white/20'
                      }`}
                    >
                      <Building2 size={14} />
                      <span>{isAr ? 'حضوري بالمقر' : 'In-Person (HQ)'}</span>
                    </button>
                  </div>

                  {/* Date & Time Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8892A6] mb-1">
                        {isAr ? 'تاريخ المقابلة' : 'Interview Date'}
                      </label>
                      <input
                        type="date"
                        {...register('date')}
                        className="w-full px-3 py-2 bg-[#070A14] border border-white/10 rounded-xl text-xs text-[#EEF1F7] focus:outline-none focus:ring-2 focus:ring-[#35D6A4]/40 focus:border-[#35D6A4]"
                      />
                      {selectedDate && (
                        <p className="text-[10px] text-[#35D6A4] mt-1 font-semibold">
                          📅 {getDayName(selectedDate)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#8892A6] mb-1">
                        {isAr ? 'الوقت والمدة' : 'Time & Duration'}
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="time"
                          {...register('time')}
                          className="w-full px-3 py-2 bg-[#070A14] border border-white/10 rounded-xl text-xs text-[#EEF1F7] focus:outline-none focus:ring-2 focus:ring-[#35D6A4]/40 focus:border-[#35D6A4]"
                        />
                        <select
                          {...register('durationMinutes')}
                          className="px-2 py-2 bg-[#070A14] border border-white/10 rounded-xl text-xs text-[#8892A6] focus:outline-none focus:ring-2 focus:ring-[#35D6A4]/40"
                        >
                          <option value="30">{isAr ? '30 د' : '30m'}</option>
                          <option value="45">{isAr ? '45 د' : '45m'}</option>
                          <option value="60">{isAr ? 'ساعة' : '1h'}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Link or Location */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8892A6] mb-1">
                      {selectedModality === 'ONLINE'
                        ? (isAr ? 'رابط المقابلة' : 'Meeting Link')
                        : (isAr ? 'مكان المقابلة' : 'Meeting Location')}
                    </label>
                    <div className="flex items-center w-full px-3 py-2 bg-[#070A14] border border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-[#35D6A4]/40 focus-within:border-[#35D6A4] transition-all">
                      {selectedModality === 'ONLINE' ? (
                        <LinkIcon size={14} className="text-[#8892A6] shrink-0 me-2.5" />
                      ) : (
                        <MapPin size={14} className="text-[#8892A6] shrink-0 me-2.5" />
                      )}
                      <input
                        type="text"
                        placeholder={selectedModality === 'ONLINE' ? 'https://meet.google.com/...' : 'مقر الشركة'}
                        {...register('locationOrLink')}
                        className="w-full bg-transparent text-xs text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Interviewer */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8892A6] mb-1">
                      {isAr ? 'القائم بالمقابلة' : 'Interviewer Name'}
                    </label>
                    <div className="flex items-center w-full px-3 py-2 bg-[#070A14] border border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-[#35D6A4]/40 focus-within:border-[#35D6A4] transition-all">
                      <User size={14} className="text-[#8892A6] shrink-0 me-2.5" />
                      <input
                        type="text"
                        placeholder="سارة الغامدي (HR Lead)"
                        {...register('interviewerName')}
                        className="w-full bg-transparent text-xs text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-white/10 text-center text-xs text-[#8892A6] space-y-1">
                  <p>{isAr ? 'لم يتم تفعيل موعد مقابلة لهذه المرحلة.' : 'Interview scheduling is currently turned off.'}</p>
                  <p className="text-[11px] text-[#5A6478]">
                    {isAr ? 'فعل المفتاح بالأعلى إذا أردت تحديد تاريخ ووقت ورابط المقابلة للمرشح.' : 'Enable the toggle above to set date, time, and link.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: TASK / ASSIGNMENT */}
          {/* ============================================================ */}
          {activeTab === 'task' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#070A14] border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <ClipboardCheck size={15} className="text-[#F5B23D]" />
                  <span className="text-xs font-semibold text-[#EEF1F7]">
                    {isAr ? 'تضمين تكليف / اختبار تقني للمرشح' : 'Attach a task / technical challenge'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('includeTask')}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F5B23D]"></div>
                </label>
              </div>

              {includeTask ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8892A6] mb-1">
                      {isAr ? 'عنوان التكليف' : 'Task Title'}
                    </label>
                    <input
                      type="text"
                      placeholder={isAr ? 'مثال: تصميم نموذج أولي لصفحة الدفع' : 'e.g. Frontend Checkout Challenge'}
                      {...register('taskTitle')}
                      className="w-full px-3 py-2 bg-[#070A14] border border-white/10 rounded-xl text-xs text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8892A6] mb-1">
                      {isAr ? 'تعليمات وملاحظات التكليف' : 'Instructions & Details'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={isAr ? 'اكتب المطلوب من المرشح ومعايير التقييم...' : 'Specify requirements and guidelines...'}
                      {...register('taskDescription')}
                      className="w-full px-3 py-2 bg-[#070A14] border border-white/10 rounded-xl text-xs text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8892A6] mb-1">
                        {isAr ? 'رابط الملف / المستودع' : 'Link / Repository (Optional)'}
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        {...register('taskUrl')}
                        className="w-full px-3 py-2 bg-[#070A14] border border-white/10 rounded-xl text-xs text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8892A6] mb-1">
                        {isAr ? 'موعد التسليم النهائي' : 'Submission Deadline'}
                      </label>
                      <input
                        type="text"
                        placeholder={isAr ? 'مثال: الأحد القادم الساعة 6 م' : 'e.g. Next Sunday 6:00 PM'}
                        {...register('taskDeadline')}
                        className="w-full px-3 py-2 bg-[#070A14] border border-white/10 rounded-xl text-xs text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 focus:ring-[#F5B23D]/40 focus:border-[#F5B23D]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-white/10 text-center text-xs text-[#8892A6] space-y-1">
                  <p>{isAr ? 'لا يوجد تكليف مرفق لهذه المرحلة.' : 'No task attached for this stage.'}</p>
                  <p className="text-[11px] text-[#5A6478]">
                    {isAr ? 'فعل المفتاح أعلاه إذا كنت ترغب في إرسال اختبار أو مشروع للمرشح.' : 'Enable toggle above to attach assessment instructions.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: NOTES */}
          {/* ============================================================ */}
          {activeTab === 'notes' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-[#EEF1F7] mb-1.5">
                  {isAr ? 'توجيهات أو ملاحظات للمرشح (تظهر في إيميل التحديث)' : 'Additional Notes for Candidate (sent in email)'}
                </label>
                <textarea
                  rows={4}
                  placeholder={isAr ? 'مثال: يرجى إحضار الهوية الوطنية وجهاز الحاسوب الشخصي...' : 'e.g. Please bring your national ID and laptop...'}
                  {...register('stageNotes')}
                  className="w-full p-3 bg-[#070A14] border border-white/10 rounded-xl text-xs text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-2 focus:ring-[#4C8DFF]/40 focus:border-[#4C8DFF]"
                />
              </div>
            </div>
          )}

          {/* Compact 1-line email notice */}
          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#8892A6]">
            <Mail size={13} className="text-[#4C8DFF] shrink-0" />
            <span className="truncate">
              {isAr
                ? `سيتم إشعار المرشح تلقائياً عبر (${schedulingCandidate.candidate.email})`
                : `Candidate will be notified automatically at ${schedulingCandidate.candidate.email}`}
            </span>
          </div>

          {/* Clean Modal Footer */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#8892A6] hover:text-[#EEF1F7] hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            {!schedulingCandidate.isEditing && onMoveDirectly && (
              <button
                type="button"
                onClick={onMoveDirectly}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#151E31] hover:bg-white/[0.08] text-[#EEF1F7] border border-white/10 transition-colors cursor-pointer"
              >
                {isAr ? 'نقل سريع بدون تفاصيل' : 'Move Without Details'}
              </button>
            )}

            <button
              type="submit"
              className="btn-pri px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <span>
                {schedulingCandidate.isEditing
                  ? (isAr ? 'حفظ التعديلات' : 'Save Changes')
                  : (isAr ? 'تأكيد ونقل المرشح' : 'Confirm & Move')}
              </span>
              <ArrowRight size={13} className={isRtl ? 'rotate-180' : ''} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
