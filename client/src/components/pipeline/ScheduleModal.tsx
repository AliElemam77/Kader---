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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Candidate, PipelineStage } from '../../types/ats';

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

  const [taskSectionOpen, setTaskSectionOpen] = useState(true);
  const [interviewSectionOpen, setInterviewSectionOpen] = useState(true);

  const getDayName = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const days = [
      'الأحد (Sunday)',
      'الإثنين (Monday)',
      'الثلاثاء (Tuesday)',
      'الأربعاء (Wednesday)',
      'الخميس (Thursday)',
      'الجمعة (Friday)',
      'السبت (Saturday)',
    ];
    return days[d.getDay()] || '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0E1524] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5B23D]/10 text-[#F5B23D] border border-[#F5B23D]/20 mb-2">
            كادر • انتقال مرحلي وإشعارات
          </span>
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">
            {schedulingCandidate.isEditing ? 'تعديل تفاصيل المرحلة والمقابلة' : 'تحديد تفاصيل المرحلة ونقل المرشح'}
          </h2>
          <p className="text-xs text-[#8892A6] mt-1.5">
            المرشح: <strong className="text-[#EEF1F7]">{schedulingCandidate.candidate.name}</strong> • المرحلة المستهدفة:{' '}
            <strong className="text-[#F5B23D] font-bold">{schedulingCandidate.targetStage.name}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ============================================================ */}
          {/* SECTION 1: TASK / ASSIGNMENT DETAILS (تفاصيل التكليف والتاسك) */}
          {/* ============================================================ */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-all">
            <div className="p-3.5 flex items-center justify-between border-b border-slate-900">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('includeTask')}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500 focus:ring-offset-slate-950"
                />
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <ClipboardCheck size={16} className="text-amber-400" />
                  تضمين تكليف / تاسك للمرشح في هذه المرحلة (Task / Assignment)
                </span>
              </label>

              {includeTask && (
                <button
                  type="button"
                  onClick={() => setTaskSectionOpen(!taskSectionOpen)}
                  className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                >
                  {taskSectionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>

            {includeTask && taskSectionOpen && (
              <div className="p-4 space-y-3 bg-slate-900/40 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    عنوان التاسك / التكليف (Task Title)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: تصميم نموذج أولي لصفحة الدفع (Checkout UI Challenge)"
                    {...register('taskTitle')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    شرح وتفاصيل التكليف والمطلوب (Instructions & Requirements)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="اكتب هنا كافة تفاصيل المطلوب من المرشح، الأدوات المقترحة، ومعايير التقييم..."
                    {...register('taskDescription')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      رابط التكليف / المستودع (Task Link / Repo / Drive)
                    </label>
                    <div className="relative">
                      <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="url"
                        placeholder="https://figma.com/... أو github.com/..."
                        {...register('taskUrl')}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      آخر موعد لتسليم التكليف (Submission Deadline)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: الخميس القادم 12 سبتمبر الساعة 6:00 م"
                      {...register('taskDeadline')}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: INTERVIEW SCHEDULING (جدولة مقابلة) */}
          {/* ============================================================ */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-all">
            <div className="p-3.5 flex items-center justify-between border-b border-slate-900">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('includeInterview')}
                  className="w-4 h-4 rounded text-sky-500 bg-slate-900 border-slate-700 focus:ring-sky-500 focus:ring-offset-slate-950"
                />
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Calendar size={16} className="text-sky-400" />
                  جدولة موعد مقابلة في هذه المرحلة (Schedule Interview)
                </span>
              </label>

              {includeInterview && (
                <button
                  type="button"
                  onClick={() => setInterviewSectionOpen(!interviewSectionOpen)}
                  className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                >
                  {interviewSectionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>

            {includeInterview && interviewSectionOpen && (
              <div className="p-4 space-y-3 bg-slate-900/40 animate-in fade-in duration-150">
                {/* Modality Selector */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setValue('modality', 'ONLINE');
                      setValue('locationOrLink', 'https://meet.google.com/hire-' + Math.random().toString(36).substring(7));
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedModality === 'ONLINE'
                        ? 'bg-sky-500/15 border-sky-500 text-sky-300 shadow-md shadow-sky-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Video size={15} />
                    <span>Online (أونلاين عن بعد)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setValue('modality', 'OFFLINE');
                      setValue('locationOrLink', 'مقر الشركة - الدور 3، قاعة الاجتماعات الرئيسية');
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedModality === 'OFFLINE'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Building2 size={15} />
                    <span>In-Person (حضوري بالمقر)</span>
                  </button>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      يوم وتاريخ المقابلة
                    </label>
                    <input
                      type="date"
                      {...register('date')}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    {selectedDate && (
                      <p className="text-[10px] text-sky-400 mt-1 font-semibold">
                        📅 {getDayName(selectedDate)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      الوقت والمدة
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        {...register('time')}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <select
                        {...register('durationMinutes')}
                        className="px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="30">30 دقيقة</option>
                        <option value="45">45 دقيقة</option>
                        <option value="60">ساعة</option>
                        <option value="90">ساعة ونصف</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Link or Location */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {selectedModality === 'ONLINE' ? 'رابط المقابلة (Google Meet / Zoom)' : 'عنوان ومكان المقابلة بالمقر'}
                  </label>
                  <div className="relative">
                    {selectedModality === 'ONLINE' ? (
                      <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    ) : (
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    )}
                    <input
                      type="text"
                      placeholder={
                        selectedModality === 'ONLINE'
                          ? 'https://meet.google.com/...'
                          : 'مقر الشركة - الدور 3، قاعة الاجتماعات'
                      }
                      {...register('locationOrLink')}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Interviewer */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    القائم بالمقابلة (Interviewer Name)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: سارة الغامدي (مدير الموارد البشرية)"
                    {...register('interviewerName')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* SECTION 3: GENERAL STAGE NOTES (ملاحظات إضافية للمرشح) */}
          {/* ============================================================ */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
              <FileText size={14} className="text-indigo-400" />
              ملاحظات أو توجيهات إضافية للمرشح (تظهر في الإيميل)
            </label>
            <textarea
              rows={2}
              placeholder="مثال: يرجى تجهيز الحاسوب الشخصي والهوية الوطنية، أو أي إرشادات خاصة بهذه المرحلة..."
              {...register('stageNotes')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email notice badge */}
          <div className="p-3.5 rounded-xl bg-[#070A14] border border-white/10 text-[11px] text-[#8892A6] flex items-center gap-2.5">
            <Mail size={16} className="text-[#4C8DFF] shrink-0" />
            <span>
              سيتم إرسال إيميل رسمي فوري للمرشح (<strong className="font-mono text-[#EEF1F7]">{schedulingCandidate.candidate.email}</strong>) يحتوي على
              المرحلة الجديدة وتفاصيل التكليف والمقابلة المحددة.
            </span>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-sec text-xs"
            >
              إلغاء
            </button>

            {!schedulingCandidate.isEditing && onMoveDirectly && (
              <button
                type="button"
                onClick={onMoveDirectly}
                title="نقل المرحلة فقط دون إرفاق تاسك أو موعد مقابلة"
                className="btn-sec text-xs"
              >
                نقل سريع (بدون تفاصيل)
              </button>
            )}

            <button
              type="submit"
              className="btn-pri flex-1 text-xs cursor-pointer"
            >
              <span>
                {schedulingCandidate.isEditing
                  ? 'حفظ وتحديث التفاصيل'
                  : 'تأكيد النقل وإرسال الإيميل'}
              </span>
              <Mail size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
