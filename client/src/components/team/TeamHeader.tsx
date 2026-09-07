import { type FC } from 'react';
import { Users } from 'lucide-react';

interface TeamHeaderProps {
  memberCount: number;
}

export const TeamHeader: FC<TeamHeaderProps> = ({ memberCount }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0E1524] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#EEF1F7] tracking-tight">إدارة فريق العمل • Team Members</h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#35D6A4]/10 text-[#35D6A4] border border-[#35D6A4]/20 font-mono">
            <Users size={12} /> {memberCount}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#8892A6] mt-1">
          دعوة مسؤولي ومدراء التوظيف في كادر، وإدارة أدوارهم وصلاحياتهم.
        </p>
      </div>
    </div>
  );
};
