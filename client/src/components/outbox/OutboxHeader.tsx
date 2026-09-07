import type { FC } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import type { OutboxData } from '../../hooks/useOutbox';

interface OutboxHeaderProps {
  data: OutboxData | null;
  loading: boolean;
  onRefresh: () => void;
  onClear: () => void;
}

export const OutboxHeader: FC<OutboxHeaderProps> = ({
  data,
  loading,
  onRefresh,
  onClear,
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Mail size={11} /> Email Dispatch & Outbox
          </span>
          <span className="text-xs font-semibold text-slate-400">البريد الصادر وحالة الإرسال</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1">
          Live System Emails & SMTP Status
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          title="Refresh outbox"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
        {data && data.outbox.length > 0 && (
          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/50 transition-colors cursor-pointer"
          >
            Clear History
          </button>
        )}
      </div>
    </div>
  );
};
