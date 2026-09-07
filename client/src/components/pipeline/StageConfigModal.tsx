import { type FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { X, Video, CheckCircle, Building2, AlertCircle, Pencil } from 'lucide-react';
import type { PipelineStage } from '../../types/ats';
import type { StageFormValues } from '../../hooks/usePipeline';

const COLOR_PALETTE = ['#5A6478', '#4C8DFF', '#F5B23D', '#35D6A4', '#FF7A85', '#8B5CF6'];

interface AddStageModalProps {
  isOpen: boolean;
  form: UseFormReturn<StageFormValues>;
  onClose: () => void;
  onSubmit: (data: StageFormValues) => void;
}

export const AddStageModal: FC<AddStageModalProps> = ({
  isOpen,
  form,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const isInterview = watch('isInterview');
  const defaultModality = watch('defaultModality');
  const color = watch('color');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0E1524] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5B23D]/10 text-[#F5B23D] border border-[#F5B23D]/20 mb-2">
            كادر • تخصيص المسار
          </span>
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">إضافة مرحلة جديدة للمسار</h2>
          <p className="text-xs text-[#8892A6] mt-1.5">
            سيتم حفظ هذه المرحلة بشكل دائم في قاعدة البيانات للوظيفة المحددة.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Stage Name (اسم المرحلة) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Cultural & Values Interview"
              {...register('name')}
              className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-rose-500/60 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:ring-indigo-500'
              }`}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                <AlertCircle size={12} /> {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              طبيعة المرحلة (Stage Category)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('isInterview', true)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isInterview
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Video size={15} className={isInterview ? 'text-indigo-400' : 'text-slate-500'} />
                <span>مقابلة (تتطلب ميعاد)</span>
              </button>

              <button
                type="button"
                onClick={() => setValue('isInterview', false)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  !isInterview
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CheckCircle size={15} className={!isInterview ? 'text-emerald-400' : 'text-slate-500'} />
                <span>مراجعة مباشرة</span>
              </button>
            </div>
          </div>

          {isInterview && (
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <label className="block text-[11px] font-semibold text-slate-300">
                طريقة المقابلة الافتراضية
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setValue('defaultModality', 'ONLINE')}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    defaultModality === 'ONLINE'
                      ? 'bg-sky-500/15 border-sky-500 text-sky-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Video size={13} />
                  <span>Online (زووم / ميت)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('defaultModality', 'OFFLINE')}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    defaultModality === 'OFFLINE'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building2 size={13} />
                  <span>In-Person (مقر الشركة)</span>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Stage Theme Color (لون المرحلة)
            </label>
            <div className="flex gap-2">
              {COLOR_PALETTE.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setValue('color', col)}
                  className={`w-7 h-7 rounded-full border-2 transition-all shadow-md cursor-pointer ${
                    color === col ? 'border-white scale-110 ring-2 ring-indigo-400/50' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-sec w-1/3 text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-pri w-2/3 text-xs"
            >
              <span>إنشاء المرحلة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditStageModalProps {
  editingStage: PipelineStage | null;
  editName: string;
  editIsInterview: boolean;
  editDefaultModality: 'ONLINE' | 'OFFLINE';
  editColor: string;
  onNameChange: (name: string) => void;
  onIsInterviewChange: (isInterview: boolean) => void;
  onModalityChange: (modality: 'ONLINE' | 'OFFLINE') => void;
  onColorChange: (color: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditStageModal: FC<EditStageModalProps> = ({
  editingStage,
  editName,
  editIsInterview,
  editDefaultModality,
  editColor,
  onNameChange,
  onIsInterviewChange,
  onModalityChange,
  onColorChange,
  onClose,
  onSubmit,
}) => {
  if (!editingStage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0E1524] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-lg text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5B23D]/10 text-[#F5B23D] border border-[#F5B23D]/20 mb-2">
            <Pencil size={11} /> كادر • تعديل المرحلة
          </span>
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">تعديل المرحلة: {editingStage.name}</h2>
          <p className="text-xs text-[#8892A6] mt-1.5">سيتم حفظ التعديلات وتحديثها فورياً في مسار العمل.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Stage Name (اسم المرحلة) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={editName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. Technical Interview"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              طبيعة المرحلة (Stage Category)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onIsInterviewChange(true)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  editIsInterview
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Video size={15} className={editIsInterview ? 'text-indigo-400' : 'text-slate-500'} />
                <span>مقابلة (تتطلب ميعاد)</span>
              </button>

              <button
                type="button"
                onClick={() => onIsInterviewChange(false)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  !editIsInterview
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CheckCircle size={15} className={!editIsInterview ? 'text-emerald-400' : 'text-slate-500'} />
                <span>مراجعة مباشرة</span>
              </button>
            </div>
          </div>

          {editIsInterview && (
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <label className="block text-[11px] font-semibold text-slate-300">
                طريقة المقابلة الافتراضية
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onModalityChange('ONLINE')}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    editDefaultModality === 'ONLINE'
                      ? 'bg-sky-500/15 border-sky-500 text-sky-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Video size={13} />
                  <span>Online (زووم / ميت)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onModalityChange('OFFLINE')}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    editDefaultModality === 'OFFLINE'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building2 size={13} />
                  <span>In-Person (مقر الشركة)</span>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Stage Theme Color (لون المرحلة)
            </label>
            <div className="flex gap-2">
              {COLOR_PALETTE.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => onColorChange(col)}
                  className={`w-7 h-7 rounded-full border-2 transition-all shadow-md cursor-pointer ${
                    editColor === col ? 'border-white scale-110 ring-2 ring-indigo-400/50' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-sec w-1/3 text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-pri w-2/3 text-xs"
            >
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
