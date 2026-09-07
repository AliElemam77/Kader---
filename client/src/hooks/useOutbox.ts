import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

export interface DispatchedEmail {
  id: string;
  from?: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  type: 'AUTH_OTP' | 'INTERVIEW_INVITATION' | 'TEAM_INVITATION' | 'STAGE_UPDATE' | 'APPLICATION_RECEIVED' | 'TEST';
  status: 'DELIVERED' | 'FAILED' | 'DEV_SIMULATED';
  error?: string;
  messageId?: string;
  createdAt: string;
}

export interface OutboxData {
  outbox: DispatchedEmail[];
  stats: {
    total: number;
    delivered: number;
    simulated: number;
    failed: number;
  };
  smtpConfig: {
    configured: boolean;
    host: string;
    service?: string;
    port: number;
    from: string;
    user: string;
  };
}

export function useOutbox(isOpen: boolean) {
  const [data, setData] = useState<OutboxData | null>(null);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [previewEmail, setPreviewEmail] = useState<DispatchedEmail | null>(null);

  const fetchOutbox = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/mail/outbox`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch {
      toast.error('Failed to load email outbox');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOutbox();
    }
  }, [isOpen]);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSendingTest(true);
    const toastId = toast.loading(`Sending test email to ${testEmail}...`);

    try {
      const res = await fetch(`${API_BASE_URL}/mail/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(json.message || 'Test email sent successfully!', { id: toastId });
        setTestEmail('');
        fetchOutbox();
      } else {
        toast.error(json.message || 'Failed to send test email', {
          id: toastId,
          description: 'Check your Gmail App Password in server/.env',
        });
        fetchOutbox();
      }
    } catch {
      toast.error('Network error testing SMTP', { id: toastId });
    } finally {
      setSendingTest(false);
    }
  };

  const handleClearOutbox = async () => {
    try {
      await fetch(`${API_BASE_URL}/mail/outbox`, { method: 'DELETE' });
      toast.success('Outbox cleared');
      fetchOutbox();
    } catch {
      toast.error('Error clearing outbox');
    }
  };

  return {
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
  };
}
