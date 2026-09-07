import { type FC } from 'react';
import { Shield, CheckCircle2, Clock, Pencil, Trash2 } from 'lucide-react';
import type { TeamMember } from '../../hooks/useTeam';

interface TeamRosterListProps {
  members: TeamMember[];
  loading: boolean;
  onOpenEdit: (member: TeamMember) => void;
  onOpenDelete: (member: TeamMember) => void;
}

export const TeamRosterList: FC<TeamRosterListProps> = ({
  members,
  loading,
  onOpenEdit,
  onOpenDelete,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-base font-bold text-white mb-4">Team Roster</h3>

      {loading ? (
        <div className="text-center py-12 text-slate-500 animate-pulse">Loading members...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No team members found</div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-950 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    member.role === 'HR_MANAGER'
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  }`}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{member.name}</div>
                  <div className="text-xs text-slate-400">{member.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    member.role === 'HR_MANAGER'
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                  }`}
                >
                  <Shield size={11} /> {member.role === 'HR_MANAGER' ? 'HR Manager' : 'Recruiter'}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    member.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : member.status === 'INVITED'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {member.status === 'ACTIVE' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                  {member.status}
                </span>

                <button
                  onClick={() => onOpenEdit(member)}
                  title="Edit team member"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={() => onOpenDelete(member)}
                  title="Remove from team"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
