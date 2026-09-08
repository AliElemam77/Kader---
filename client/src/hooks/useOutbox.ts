import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config/api';
import { queryKeys } from '../config/queryKeys';

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
  const queryClient = useQueryClient();
  const [testEmail, setTestEmail] = useState('');
  const [previewEmail, setPreviewEmail] = useState<DispatchedEmail | null>(null);

  // Cached Outbox Query
  const {
    data = null,
    isLoading: loading,
    refetch: fetchOutbox,
  } = useQuery<OutboxData | null>({
    queryKey: queryKeys.outbox.all,
    enabled: isOpen,
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/mail/outbox`);
      const json = await res.json();
      if (json.success) {
        return json.data;
      }
      return null;
    },
  });

  // Test Email Mutation
  const testMutation = useMutation({
    mutationFn: async (targetEmail: string) => {
      const res = await fetch(`${API_BASE_URL}/mail/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to send test email');
      return json;
    },
    onSuccess: (json) => {
      toast.success(json.message || 'Test email sent successfully!');
      setTestEmail('');
      queryClient.invalidateQueries({ queryKey: queryKeys.outbox.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to send test email', {
        description: 'Check your Gmail App Password in server/.env',
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.outbox.all });
    },
  });

  // Clear Outbox Mutation
  const clearMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}/mail/outbox`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error('Error clearing outbox');
      return json;
    },
    onSuccess: () => {
      toast.success('Outbox cleared');
      queryClient.invalidateQueries({ queryKey: queryKeys.outbox.all });
    },
    onError: () => {
      toast.error('Error clearing outbox');
    },
  });

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    testMutation.mutate(testEmail);
  };

  const handleClearOutbox = async () => {
    clearMutation.mutate();
  };

  return {
    data,
    loading,
    testEmail,
    setTestEmail,
    sendingTest: testMutation.isPending,
    previewEmail,
    setPreviewEmail,
    fetchOutbox,
    handleSendTest,
    handleClearOutbox,
  };
}
