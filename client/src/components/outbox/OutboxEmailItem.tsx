import type { FC } from 'react';
import { CheckCircle2, AlertCircle, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import type { DispatchedEmail } from '../../hooks/useOutbox';

interface OutboxEmailItemProps {
  mail: DispatchedEmail;
  onPreview: (mail: DispatchedEmail) => void;
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  STAGE_UPDATE: { label: 'تحديث مرحلة / قبول', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  INTERVIEW_INVITATION: { label: 'دعوة مقابلة', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  APPLICATION_RECEIVED: { label: 'استلام طلب توظيف', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  AUTH_OTP: { label: 'كود تسجيل الدخول OTP', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  TEAM_INVITATION: { label: 'دعوة عضو فريق', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  TEST: { label: 'إيميل تجريبي', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

export const OutboxEmailItem: FC<OutboxEmailItemProps> = ({ mail, onPreview }) => {
  const typeInfo = TYPE_LABELS[mail.type] || { label: mail.type, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };

  return (
    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/30 transition-all space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                mail.status === 'DELIVERED'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : mail.status === 'DEV_SIMULATED'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {mail.status === 'DELIVERED' ? (
                <>
                  <CheckCircle2 size={11} /> 🟢 تم الإرسال للبريد الحقيقي
                </>
              ) : mail.status === 'DEV_SIMULATED' ? (
                <>
                  <AlertCircle size={11} /> 🟡 محاكاة (Dev Simulator)
                </>
              ) : (
                <>
                  <ShieldAlert size={11} /> 🔴 فشل الإرسال
                </>
              )}
            </span>

            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${typeInfo.color}`}>
              {typeInfo.label}
            </span>

            <span className="text-xs font-bold text-white tracking-tight">{mail.subject}</span>
          </div>

          {/* Audit Log: From -> To */}
          <div className="flex items-center gap-2 text-xs flex-wrap text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800/60">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500">الراسل:</span>
              <span className="font-mono text-slate-300 truncate max-w-[200px]">{mail.from || 'Hire ATS (System)'}</span>
            </div>
            <ArrowRight size={12} className="text-slate-600 shrink-0" />
            <div className="flex items-center gap-1">
              <UserCheck size={12} className="text-indigo-400 shrink-0" />
              <span className="text-[11px] text-slate-500">المرسل إليه:</span>
              <strong className="text-indigo-300 font-mono">{mail.to}</strong>
            </div>
            <span className="text-[11px] text-slate-500 ml-auto">
              🕒 {new Date(mail.createdAt).toLocaleTimeString()} ({new Date(mail.createdAt).toLocaleDateString()})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-1">
          <button
            type="button"
            onClick={() => onPreview(mail)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors cursor-pointer whitespace-nowrap"
          >
            معاينة الإيميل (View HTML)
          </button>
        </div>
      </div>

      {mail.error && (
        <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300/90 leading-relaxed">
          ℹ️ {mail.error}
        </div>
      )}
    </div>
  );
};
