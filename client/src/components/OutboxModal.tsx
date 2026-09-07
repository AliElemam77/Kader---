import type { FC } from 'react';
import { X } from 'lucide-react';
import { useOutbox } from '../hooks/useOutbox';
import { OutboxHeader } from './outbox/OutboxHeader';
import { OutboxStatusCard } from './outbox/OutboxStatusCard';
import { OutboxEmailItem } from './outbox/OutboxEmailItem';
import { EmailPreviewModal } from './outbox/EmailPreviewModal';

interface OutboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutboxModal: FC<OutboxModalProps> = ({ isOpen, onClose }) => {
  const {
    data,
    loading,
    testEmail,
    setTestEmail,
    sendingTest,
    previewEmail,
    setPreviewEmail,
    fetchOutbox,
    handleSendTest,
    handleClearOutbox,
  } = useOutbox(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0E1524] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-2 rounded-xl text-[#8892A6] hover:text-[#EEF1F7] hover:bg-[#151E31] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <OutboxHeader
          data={data}
          loading={loading}
          onRefresh={fetchOutbox}
          onClear={handleClearOutbox}
        />

        {/* SMTP Status & Instructions Card */}
        <OutboxStatusCard
          data={data}
          testEmail={testEmail}
          sendingTest={sendingTest}
          onTestEmailChange={setTestEmail}
          onSendTest={handleSendTest}
        />

        {/* Emails List */}
        <div className="flex-1 overflow-y-auto space-y-3 pe-1">
          {!data || data.outbox.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl text-[#8892A6] text-xs">
              لا توجد رسائل مرسلة بعد. قم بتجربة نقل مرشح، أو جدولة مقابلة، أو استبعاد مرشح لتظهر الرسائل الصادرة هنا.
            </div>
          ) : (
            data.outbox.map((mail) => (
              <OutboxEmailItem
                key={mail.id}
                mail={mail}
                onPreview={setPreviewEmail}
              />
            ))
          )}
        </div>

        {/* Modal: Full HTML Preview */}
        <EmailPreviewModal
          email={previewEmail}
          onClose={() => setPreviewEmail(null)}
        />
      </div>
    </div>
  );
};
