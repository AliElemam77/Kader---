import { useState, useRef, useEffect, type FC } from 'react';
import {
  ChevronDown,
  ExternalLink,
  Mail,
  User,
  Building2,
  LogOut,
} from 'lucide-react';
import type { AuthUser } from '../App';
import { useLanguage } from '../context/LanguageContext';
import { KaderMark } from './common/KaderLogo';
import { toast } from 'sonner';

interface NavbarProps {
  activeTab: 'careers' | 'pipeline' | 'builder' | 'jobs' | 'team';
  setActiveTab: (tab: 'careers' | 'pipeline' | 'builder' | 'jobs' | 'team') => void;
  user: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenOutbox: () => void;
  pipelineCount?: number;
  jobsCount?: number;
}

export const Navbar: FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenLogin,
  onLogout,
  onOpenOutbox,
  pipelineCount = 16,
  jobsCount = 4,
}) => {
  const { language, setLanguage } = useLanguage();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Numbers in Arabic digits if Arabic is active
  const toDigits = (n: number | string) => {
    if (language !== 'ar') return n;
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(n).replace(/[0-9]/g, (w) => arabicDigits[+w]);
  };

  // User display metadata (defaults to Sarah Al-Ghamdi from the reference design if guest)
  const displayName = user?.name || (language === 'ar' ? 'سارة الغامدي' : 'Sarah Al-Ghamdi');
  const displayRole = user?.role === 'RECRUITER'
    ? (language === 'ar' ? 'مسؤول توظيف' : 'Recruiter')
    : (language === 'ar' ? 'مديرة توظيف' : 'HR Manager');
  const displayEmail = user?.email || (language === 'ar' ? 'sarah@kader.sa' : 'sarah@kader.sa');

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : (language === 'ar' ? 'س' : 'SA');

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070A14]/95 border-b border-white/[0.08] mb-6 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* ================================================================= */}
        {/* ZONE 1: IDENTITY (Logo & Workspace / Org Selector) */}
        {/* ================================================================= */}
        <div className="flex items-center gap-3">
          {/* Logo Mark & Wordmark */}
          <div
            onClick={() => setActiveTab('pipeline')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            title="كادر — من التقديم إلى التعيين، في مسار واحد"
          >
            <KaderMark size={28} />
            <span className="font-bold text-lg text-white tracking-tight">
              {language === 'ar' ? 'كادر' : 'Kader'}
            </span>
          </div>

          {/* Org Selector Pill (TAR Group) */}
          <div
            onClick={() => toast.info(language === 'ar' ? 'مؤسسة تار — مساحة العمل النشطة' : 'TAR Group — Active Workspace')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer text-xs select-none"
            title="Workspace Organization"
          >
            <div className="w-5 h-5 rounded-md bg-[#4C8DFF] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
              {language === 'ar' ? 'ت' : 'T'}
            </div>
            <span className="font-semibold text-slate-200 text-xs">
              {language === 'ar' ? 'مؤسسة تار' : 'TAR Group'}
            </span>
            <ChevronDown size={13} className="text-slate-400" />
          </div>
        </div>

        {/* ================================================================= */}
        {/* ZONE 2: NAVIGATION (Center Tabs with Counters & Amber Underline) */}
        {/* ================================================================= */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Pipeline Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`relative flex items-center gap-1.5 py-5 text-sm font-semibold transition-colors cursor-pointer select-none ${
              activeTab === 'pipeline' ? 'text-white' : 'text-[#8892A6] hover:text-white'
            }`}
          >
            <span>{language === 'ar' ? 'المسار' : 'Pipeline'}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                activeTab === 'pipeline'
                  ? 'bg-[#F5B23D]/20 text-[#F5B23D]'
                  : 'bg-white/[0.06] text-[#8892A6]'
              }`}
            >
              {toDigits(pipelineCount)}
            </span>
            {/* Active Amber Underline Bar */}
            {activeTab === 'pipeline' && (
              <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-[#F5B23D] rounded-full shadow-sm shadow-[#F5B23D]/50" />
            )}
          </button>

          {/* Jobs Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`relative flex items-center gap-1.5 py-5 text-sm font-semibold transition-colors cursor-pointer select-none ${
              activeTab === 'jobs' ? 'text-white' : 'text-[#8892A6] hover:text-white'
            }`}
          >
            <span>{language === 'ar' ? 'الوظائف' : 'Jobs'}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-[#F5B23D]/20 text-[#F5B23D]'
                  : 'bg-white/[0.06] text-[#8892A6]'
              }`}
            >
              {toDigits(jobsCount)}
            </span>
            {activeTab === 'jobs' && (
              <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-[#F5B23D] rounded-full shadow-sm shadow-[#F5B23D]/50" />
            )}
          </button>

          {/* Team Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`relative flex items-center gap-1.5 py-5 text-sm font-semibold transition-colors cursor-pointer select-none ${
              activeTab === 'team' ? 'text-white' : 'text-[#8892A6] hover:text-white'
            }`}
          >
            <span>{language === 'ar' ? 'الفريق' : 'Team'}</span>
            {activeTab === 'team' && (
              <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-[#F5B23D] rounded-full shadow-sm shadow-[#F5B23D]/50" />
            )}
          </button>
        </nav>

        {/* ================================================================= */}
        {/* ZONE 3: UTILITIES & USER ACCOUNT MENU */}
        {/* ================================================================= */}
        <div className="flex items-center gap-3">
          {/* Public Careers Portal Link Icon */}
          <button
            type="button"
            onClick={() => setActiveTab('careers')}
            title={language === 'ar' ? 'بوابة الوظائف العامة' : 'Public Careers Portal'}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'careers' ? 'text-[#F5B23D] bg-white/[0.06]' : 'text-[#8892A6] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <ExternalLink size={16} />
          </button>

          {/* Outbox Modal Trigger */}
          <button
            type="button"
            onClick={onOpenOutbox}
            title={language === 'ar' ? 'صندوق البريد الصادر' : 'Email Outbox'}
            className="p-2 rounded-xl text-[#8892A6] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Mail size={16} />
          </button>

          {/* Segmented Language Switcher [ EN | ع ] */}
          <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-0.5 text-xs font-semibold select-none">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-[#8892A6] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer font-['IBM_Plex_Sans_Arabic'] ${
                language === 'ar'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-[#8892A6] hover:text-white'
              }`}
            >
              ع
            </button>
          </div>

          {/* User Account Trigger & Dropdown */}
          <div className="relative" ref={accountMenuRef}>
            <div
              onClick={() => setIsAccountMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-white/[0.05] cursor-pointer transition-colors select-none"
            >
              {/* Avatar circle */}
              <div className="w-8 h-8 rounded-full bg-[#F5B23D] text-[#1A1204] font-bold text-xs flex items-center justify-center shrink-0 shadow-md shadow-[#F5B23D]/20">
                {userInitials}
              </div>

              {/* User text: Name & Role */}
              <div className="hidden sm:block text-start">
                <div className="text-xs font-semibold text-white leading-tight">
                  {displayName}
                </div>
                <div className="text-[10px] text-[#8892A6] leading-tight">
                  {displayRole}
                </div>
              </div>

              <ChevronDown
                size={13}
                className={`text-[#8892A6] transition-transform duration-200 ${
                  isAccountMenuOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </div>

            {/* Account Menu Floating Card (Matches Screenshot 2) */}
            {isAccountMenuOpen && (
              <div className="absolute top-full mt-2 end-0 z-50 w-64 bg-[#0E1524] border border-white/10 rounded-2xl shadow-2xl p-4 space-y-3 backdrop-blur-xl animate-in fade-in duration-150 text-start">
                {/* Header: Name, Role Tag, Email */}
                <div className="space-y-1.5 pb-1">
                  <div className="text-sm font-bold text-white truncate">
                    {displayName}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-block bg-[#F5B23D]/10 text-[#F5B23D] border border-[#F5B23D]/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {displayRole}
                    </span>
                    <span className="font-mono text-[11px] text-[#8892A6] truncate">
                      {displayEmail}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/[0.08]" />

                {/* Menu Items */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      toast.info(`${displayName} • ${displayRole}`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-start"
                  >
                    <User size={14} className="text-[#8892A6]" />
                    <span>{language === 'ar' ? 'الملف الشخصي' : 'User Profile'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      setActiveTab('builder');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-start"
                  >
                    <Building2 size={14} className="text-[#8892A6]" />
                    <span>{language === 'ar' ? 'إعدادات المؤسسة' : 'Organization Settings'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      onOpenOutbox();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-start"
                  >
                    <Mail size={14} className="text-[#8892A6]" />
                    <span>{language === 'ar' ? 'قوالب الإيميلات' : 'Email Templates'}</span>
                  </button>
                </div>

                <div className="border-t border-white/[0.08]" />

                {/* Logout / Sign In Item */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    if (user) {
                      onLogout();
                    } else {
                      onOpenLogin();
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#FF7A85] hover:bg-[#FF7A85]/10 transition-colors cursor-pointer font-medium"
                >
                  <span>
                    {user
                      ? (language === 'ar' ? 'تسجيل الخروج' : 'Sign Out')
                      : (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
                  </span>
                  <LogOut size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
