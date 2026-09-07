import { type FC } from 'react';
import { useTeam } from '../hooks/useTeam';
import { TeamHeader } from './team/TeamHeader';
import { TeamRosterList } from './team/TeamRosterList';
import { InviteMemberCard } from './team/InviteMemberCard';
import { EditMemberModal } from './team/EditMemberModal';
import { DeleteMemberModal } from './team/DeleteMemberModal';

interface TeamManagementProps {
  token: string;
}

export const TeamManagement: FC<TeamManagementProps> = ({ token }) => {
  const {
    members,
    loading,
    editingMember,
    setEditingMember,
    deletingMember,
    setDeletingMember,
    isDeleting,
    inviteForm,
    editForm,
    onInviteMember,
    handleOpenEdit,
    onSaveEdit,
    onConfirmDelete,
  } = useTeam(token);

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <TeamHeader memberCount={members.length} />

      {/* 2. Main Roster & Invite Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <TeamRosterList
            members={members}
            loading={loading}
            onOpenEdit={handleOpenEdit}
            onOpenDelete={setDeletingMember}
          />
        </div>

        <div className="lg:col-span-5">
          <InviteMemberCard form={inviteForm} onSubmit={onInviteMember} />
        </div>
      </div>

      {/* 3. Modals */}
      <EditMemberModal
        editingMember={editingMember}
        form={editForm}
        onClose={() => setEditingMember(null)}
        onSubmit={onSaveEdit}
      />

      <DeleteMemberModal
        deletingMember={deletingMember}
        isDeleting={isDeleting}
        onClose={() => setDeletingMember(null)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};
