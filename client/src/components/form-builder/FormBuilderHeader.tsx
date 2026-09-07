import { type FC } from 'react';
import { Sparkles, Save, CheckCircle2 } from 'lucide-react';
import type { Job, FormField } from '../../types/ats';

interface FormBuilderHeaderProps {
  jobs: Job[];
  selectedJob: Job | undefined;
  selectedJobId: string;
  fields: FormField[];
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSelectJob: (jobId: string) => void;
  onSave: () => void;
}

export const FormBuilderHeader: FC<FormBuilderHeaderProps> = ({
  jobs,
  selectedJob,
  selectedJobId,
  fields,
  hasUnsavedChanges,
  isSaving,
  onSelectJob,
  onSave,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1524] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">
            {selectedJob ? `استمارة التقديم: ${selectedJob.title}` : 'منشئ استمارات التقديم الديناميكية'}
          </h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#35D6A4]/10 text-[#35D6A4] border border-[#35D6A4]/20">
            <Sparkles size={11} /> مزامنة مباشرة
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#8892A6]">
          تخصيص أسئلة وحقول التقديم لكل وظيفة مع السحب والإفلات لإعادة الترتيب.
        </p>
      </div>

      <div className="flex items-center gap-3 self-stretch md:self-auto">
        {jobs.length > 1 && (
          <select
            value={selectedJobId}
            onChange={(e) => onSelectJob(e.target.value)}
            className="px-3 py-2 bg-[#070A14] border border-white/[0.12] rounded-xl text-xs text-[#EEF1F7] focus:outline-none focus:ring-2 focus:ring-[#F5B23D] cursor-pointer"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            hasUnsavedChanges
              ? 'btn-pri'
              : 'btn-sec'
          }`}
        >
          {isSaving ? (
            <span>جاري الحفظ...</span>
          ) : hasUnsavedChanges ? (
            <>
              <Save size={15} />
              <span>حفظ التعديلات ({fields.length} حقل)</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={15} className="text-[#35D6A4]" />
              <span>تمت المزامنة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
