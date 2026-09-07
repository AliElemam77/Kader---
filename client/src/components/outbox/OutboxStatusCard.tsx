import type { FC, FormEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import type { OutboxData } from '../../hooks/useOutbox';

interface OutboxStatusCardProps {
  data: OutboxData | null;
  testEmail: string;
  sendingTest: boolean;
  onTestEmailChange: (val: string) => void;
  onSendTest: (e: FormEvent) => void;
}

export const OutboxStatusCard: FC<OutboxStatusCardProps> = ({
  data,
  testEmail,
  sendingTest,
  onTestEmailChange,
  onSendTest,
}) => {
  return (
    <div className="mb-6 p-4 rounded-2xl bg-[#070A14] border border-white/[0.08] space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-3 h-3 rounded-full ${
              data?.smtpConfig.configured ? 'bg-[#35D6A4] shadow-lg shadow-[#35D6A4]/50' : 'bg-[#F5B23D]'
            }`}
          />
          <div>
            <div className="text-xs font-bold text-[#EEF1F7] flex items-center gap-2">
              {data?.smtpConfig.configured
                ? `🟢 Real SMTP Active (${data.smtpConfig.service || data.smtpConfig.host})`
                : '🟡 Live Outbox Active (Development Mode)'}
            </div>
            <div className="text-[11px] text-[#8892A6]">
              {data?.smtpConfig.configured
                ? `Sender: ${data.smtpConfig.from || data.smtpConfig.user}`
                : 'يتم تسجيل كافة إيميلات كادر وتفاصيل المقابلات ورموز OTP هنا بشكل فوري.'}
            </div>
          </div>
        </div>

        {/* Test Send Form */}
        <form onSubmit={onSendTest} className="flex items-center gap-2 self-stretch sm:self-auto">
          <input
            type="email"
            placeholder="test-email@gmail.com"
            value={testEmail}
            onChange={(e) => onTestEmailChange(e.target.value)}
            className="px-3 py-1.5 bg-[#0E1524] border border-white/[0.12] rounded-xl text-xs text-[#EEF1F7] placeholder-[#5A6478] focus:outline-none focus:ring-1 focus:ring-[#F5B23D] w-full sm:w-56 font-mono"
          />
          <button
            type="submit"
            disabled={sendingTest}
            className="btn-pri px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Send size={12} />
            <span>إرسال تجريبي</span>
          </button>
        </form>
      </div>

      {/* Quick Setup Guide if not configured */}
      {!data?.smtpConfig.configured && (
        <div className="p-3 rounded-xl bg-[#151E31] border border-white/[0.08] text-xs text-[#8892A6] space-y-1">
          <div className="font-semibold text-[#F5B23D] flex items-center gap-1.5">
            <Sparkles size={13} /> لتشغيل إرسال الإيميلات الحقيقية عبر Gmail:
          </div>
          <p className="text-[11px] text-[#8892A6] leading-relaxed">
            ضع بريدك وكلمة مرور التطبيق في ملف <code className="text-[#4C8DFF] bg-[#070A14] px-1.5 py-0.5 rounded font-mono">server/.env</code> في: <code className="text-[#4C8DFF] font-mono">SMTP_USER</code> و <code className="text-[#4C8DFF] font-mono">SMTP_PASS</code>.
          </p>
        </div>
      )}
    </div>
  );
};
