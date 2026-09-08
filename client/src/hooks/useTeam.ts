import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config/api';
import { queryKeys } from '../config/queryKeys';
import { useLanguage } from '../context/LanguageContext';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'HR_MANAGER' | 'RECRUITER';
  status: 'ACTIVE' | 'INVITED' | 'DEACTIVATED';
  createdAt: string;
}

export const inviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid work email address'),
  role: z.enum(['HR_MANAGER', 'RECRUITER']),
});

export type InviteFormValues = z.infer<typeof inviteSchema>;

export const editSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid work email address'),
  role: z.enum(['HR_MANAGER', 'RECRUITER']),
  status: z.enum(['ACTIVE', 'INVITED', 'DEACTIVATED']),
});

export type EditFormValues = z.infer<typeof editSchema>;

export function useTeam(token: string) {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  // Edit and Delete Modals
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);

  // Invite Form
  const inviteForm = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'RECRUITER',
    },
  });

  // Edit Form
  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
  });

  // Cached Team Members Query
  const {
    data: members = [],
    isLoading: loading,
    refetch: fetchTeam,
  } = useQuery<TeamMember[]>({
    queryKey: queryKeys.team.all,
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/team`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resJson = await res.json();
      if (resJson.success && Array.isArray(resJson.data)) {
        return resJson.data;
      }
      return [];
    },
  });

  // Invite Member Mutation
  const inviteMutation = useMutation({
    mutationFn: async (data: InviteFormValues) => {
      const res = await fetch(`${API_BASE_URL}/team/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();
      if (!resJson.success) throw new Error(resJson.message || 'Failed to invite member');
      return resJson;
    },
    onSuccess: (_, variables) => {
      toast.success(isAr ? `تم إرسال دعوة الانضمام إلى ${variables.email} بنجاح!` : `Invitation sent to ${variables.email}!`);
      inviteForm.reset();
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
    },
    onError: (err: any) => {
      toast.error(err.message || (isAr ? 'خطأ في إرسال الدعوة إلى العضو' : 'Network error inviting team member'));
    },
  });

  // Edit Member Mutation
  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EditFormValues }) => {
      const res = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();
      if (!resJson.success) throw new Error(resJson.message || 'Failed to update member');
      return resJson;
    },
    onSuccess: (_, { data }) => {
      toast.success(isAr ? `تم تحديث بيانات ${data.name} بنجاح!` : `Updated ${data.name} successfully!`);
      setEditingMember(null);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
    },
    onError: (err: any) => {
      toast.error(err.message || (isAr ? 'خطأ في تحديث بيانات العضو' : 'Network error updating member'));
    },
  });

  // Delete Member Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const resJson = await res.json();
      if (!resJson.success) throw new Error(resJson.message || 'Failed to remove member');
      return resJson;
    },
    onSuccess: () => {
      if (deletingMember) {
        toast.success(isAr ? `تم حذف العضو ${deletingMember.name} من مساحة العمل بنجاح.` : `Removed ${deletingMember.name} from workspace.`);
      }
      setDeletingMember(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
    },
    onError: (err: any) => {
      toast.error(err.message || (isAr ? 'خطأ أثناء حذف العضو' : 'Error removing team member'));
    },
  });

  // Handle Invite Member
  const onInviteMember = async (data: InviteFormValues) => {
    inviteMutation.mutate(data);
  };

  // Open Edit Modal
  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    editForm.setValue('name', member.name);
    editForm.setValue('email', member.email);
    editForm.setValue('role', member.role);
    editForm.setValue('status', member.status);
  };

  // Handle Save Edit
  const onSaveEdit = async (data: EditFormValues) => {
    if (!editingMember) return;
    editMutation.mutate({ id: editingMember.id, data });
  };

  // Handle Delete Member
  const onConfirmDelete = async () => {
    if (!deletingMember) return;
    deleteMutation.mutate(deletingMember.id);
  };

  return {
    members,
    loading,
    editingMember,
    setEditingMember,
    deletingMember,
    setDeletingMember,
    isDeleting: deleteMutation.isPending,
    inviteForm,
    editForm,
    fetchTeam,
    onInviteMember,
    handleOpenEdit,
    onSaveEdit,
    onConfirmDelete,
  };
}
