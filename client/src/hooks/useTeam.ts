import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

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
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit and Delete Modals
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchTeam = () => {
    fetch(`${API_BASE_URL}/team`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setMembers(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch team members:', err);
        toast.error('Failed to load team members');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeam();
  }, [token]);

  // Handle Invite Member
  const onInviteMember = async (data: InviteFormValues) => {
    const toastId = toast.loading(`Dispatching invitation to ${data.email}...`);
    try {
      const res = await fetch(`${API_BASE_URL}/team/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();

      if (resJson.success) {
        toast.success(`Invitation sent to ${data.email}!`, { id: toastId });
        inviteForm.reset();
        fetchTeam();
      } else {
        toast.error(resJson.message || 'Failed to invite member', { id: toastId });
      }
    } catch {
      toast.error('Network error inviting team member', { id: toastId });
    }
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

    const toastId = toast.loading(`Updating ${editingMember.name}...`);
    try {
      const res = await fetch(`${API_BASE_URL}/team/${editingMember.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();

      if (resJson.success) {
        toast.success(`Updated ${data.name} successfully!`, { id: toastId });
        setEditingMember(null);
        editForm.reset();
        fetchTeam();
      } else {
        toast.error(resJson.message || 'Failed to update member', { id: toastId });
      }
    } catch {
      toast.error('Network error updating member', { id: toastId });
    }
  };

  // Handle Delete Member
  const onConfirmDelete = async () => {
    if (!deletingMember) return;

    setIsDeleting(true);
    const toastId = toast.loading(`Removing ${deletingMember.name} from team...`);
    try {
      const res = await fetch(`${API_BASE_URL}/team/${deletingMember.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resJson = await res.json();

      if (resJson.success) {
        toast.success(`Removed ${deletingMember.name} from workspace.`, { id: toastId });
        setDeletingMember(null);
        fetchTeam();
      } else {
        toast.error(resJson.message || 'Failed to remove member', { id: toastId });
      }
    } catch {
      toast.error('Error removing team member', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    members,
    loading,
    editingMember,
    setEditingMember,
    deletingMember,
    setDeletingMember,
    isDeleting,
    inviteForm,
    editForm,
    fetchTeam,
    onInviteMember,
    handleOpenEdit,
    onSaveEdit,
    onConfirmDelete,
  };
}
