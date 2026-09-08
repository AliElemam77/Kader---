import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Lock } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PublicCareers } from './components/PublicCareers';
import { PipelinePreview } from './components/PipelinePreview';
import { FormBuilderPreview } from './components/FormBuilderPreview';
import { JobsPreview } from './components/JobsPreview';
import { TeamManagement } from './components/TeamManagement';
import { HRLoginModal } from './components/HRLoginModal';
import { OutboxModal } from './components/OutboxModal';
import { API_BASE_URL } from './config/api';
import { queryClient } from './config/queryClient';
import { useLanguage } from './context/LanguageContext';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'HR_MANAGER' | 'RECRUITER';
}

export type TabType = 'careers' | 'pipeline' | 'builder' | 'jobs' | 'team';

function getInitialTab(): TabType {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get('tab')?.toLowerCase();
  const hash = window.location.hash.replace(/^#+/, '').toLowerCase();

  const validTabs: TabType[] = ['careers', 'pipeline', 'builder', 'jobs', 'team'];

  // 1. Check URL pathname (e.g. /pipeline, /jobs, /team, /builder, /careers)
  if (validTabs.includes(path as TabType)) {
    return path as TabType;
  }

  // 2. Check ?tab= query parameter
  if (tabParam && validTabs.includes(tabParam as TabType)) {
    return tabParam as TabType;
  }

  // 3. Check #hash
  if (validTabs.includes(hash as TabType)) {
    return hash as TabType;
  }

  // 4. If user has active session, restore last viewed tab from localStorage
  const hasToken = !!localStorage.getItem('ats_token');
  const savedTab = localStorage.getItem('ats_active_tab') as TabType;
  if (hasToken && savedTab && validTabs.includes(savedTab)) {
    return savedTab;
  }

  return 'careers';
}

export function App() {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [loginInitialEmail, setLoginInitialEmail] = useState<string | undefined>(undefined);
  const [isOutboxOpen, setIsOutboxOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ats_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('ats_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Centralized tab navigation with URL history and localStorage synchronization
  const handleTabChange = (tab: TabType, replace = false) => {
    setActiveTab(tab);
    localStorage.setItem('ats_active_tab', tab);
    const targetPath = tab === 'careers' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({ tab }, '', targetPath);
      } else {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  };

  // Sync browser URL bar with activeTab on mount and on tab changes
  useEffect(() => {
    const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    const expectedPath = activeTab === 'careers' ? '' : activeTab;
    const targetPath = activeTab === 'careers' ? '/' : `/${activeTab}`;
    if (currentPath !== expectedPath && !window.location.search && !window.location.hash) {
      window.history.replaceState({ tab: activeTab }, '', targetPath);
    }
  }, [activeTab]);

  // Handle browser Back / Forward navigation (popstate)
  useEffect(() => {
    const onPopState = () => {
      const currentTab = getInitialTab();
      setActiveTab(currentTab);
      localStorage.setItem('ats_active_tab', currentTab);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // 1. Detect Direct Login Page Link & Email Pre-fill from Email
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authParam = params.get('auth');
    const emailParam = params.get('email');
    const pathname = window.location.pathname;

    if (authParam === 'login' || pathname === '/login' || pathname === '/admin' || pathname === '/hr') {
      setIsLoginOpen(true);
      if (emailParam) {
        setLoginInitialEmail(emailParam);
      }
      // Clean up the URL query params without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // 2. Validate Existing Token on Startup in background
  useEffect(() => {
    const storedToken = localStorage.getItem('ats_token');
    if (storedToken) {
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('ats_user', JSON.stringify(res.data));
            setToken(storedToken);
          } else {
            handleLogout(false);
          }
        })
        .catch(() => handleLogout(false));
    } else {
      setUser(null);
      setToken(null);
    }
  }, []);

  // 3. Prompt login if user lands on an authenticated tab without a token
  useEffect(() => {
    const storedToken = localStorage.getItem('ats_token');
    if (!storedToken && activeTab !== 'careers') {
      setIsLoginOpen(true);
    }
  }, [activeTab]);

  const handleLoginSuccess = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem('ats_token', newToken);
    localStorage.setItem('ats_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    const currentTab = getInitialTab();
    const nextTab = currentTab !== 'careers' ? currentTab : 'pipeline';
    handleTabChange(nextTab, true);
  };

  // Strict Role Guard: Ensure non-HR_MANAGER users can never access or remain on the Team tab
  useEffect(() => {
    if (user && user.role !== 'HR_MANAGER' && activeTab === 'team') {
      handleTabChange('pipeline', true);
      toast.warning(
        isAr
          ? 'تبويب إدارة الفريق وصلاحيات الأعضاء متاح فقط لمدير الموارد البشرية (HR Manager)'
          : 'Team management is restricted to HR Managers only'
      );
    }
  }, [user, activeTab, isAr]);

  const handleLogout = (showToast = true) => {
    localStorage.removeItem('ats_token');
    localStorage.removeItem('ats_user');
    localStorage.removeItem('ats_active_tab');
    queryClient.clear();
    setToken(null);
    setUser(null);
    handleTabChange('careers', true);
    if (showToast) {
      toast.info(isAr ? 'تم تسجيل الخروج من مساحة العمل بنجاح' : 'Signed out of workspace successfully');
    }
  };

  const handleNavigateFromJobs = (tab: 'pipeline' | 'builder', jobId: string) => {
    localStorage.setItem('ats_selected_job_id', jobId);
    localStorage.setItem('ats_builder_job_id', jobId);
    handleTabChange(tab);
  };

  const isLoggedIn = user !== null && token !== null;

  return (
    <div className="min-h-screen flex flex-col bg-[#070A14] text-[#EEF1F7] antialiased selection:bg-[#F5B23D]/20 selection:text-[#F5B23D]">
      <Toaster
        richColors
        position={isRtl ? 'top-left' : 'top-right'}
        dir={isRtl ? 'rtl' : 'ltr'}
        theme="dark"
        closeButton
      />

      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        user={user}
        onOpenLogin={() => {
          setLoginInitialEmail(undefined);
          setIsLoginOpen(true);
        }}
        onLogout={() => handleLogout(true)}
        onOpenOutbox={() => setIsOutboxOpen(true)}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 pb-16">
        {/* Regular users only see Public Careers. Authenticated HR can navigate between tabs */}
        {!isLoggedIn || activeTab === 'careers' ? (
          <PublicCareers onOpenLogin={!isLoggedIn ? () => setIsLoginOpen(true) : undefined} />
        ) : activeTab === 'pipeline' ? (
          <PipelinePreview token={token} />
        ) : activeTab === 'builder' ? (
          <FormBuilderPreview />
        ) : activeTab === 'jobs' ? (
          <JobsPreview onNavigate={handleNavigateFromJobs} />
        ) : activeTab === 'team' && token && user?.role === 'HR_MANAGER' ? (
          <TeamManagement token={token} />
        ) : (
          <PipelinePreview token={token} />
        )}
      </main>

      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-[#8892A6]">
        <div className="flex items-center justify-center gap-2 mb-2 font-medium">
          <span className="font-bold text-[#EEF1F7]">كادر • Kader</span>
          <span className="text-[#5A6478]">•</span>
          <span>من التقديم إلى التعيين، في مسار واحد</span>
        </div>
        <p className="text-[11px] text-[#5A6478]">
          ATS Platform • Express & Prisma • Tailwind CSS v4 • Vite
        </p>

        {/* Discreet Recruiter Portal Entry Link (hidden from regular applicants) */}
        {!isLoggedIn && (
          <div className="mt-4 pt-3 border-t border-white/[0.04]">
            <button
              type="button"
              onClick={() => {
                setLoginInitialEmail(undefined);
                setIsLoginOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#5A6478] hover:text-[#8892A6] transition-colors cursor-pointer"
              title="دخول فريق التوظيف"
            >
              <Lock size={12} />
              <span>بوابة فريق التوظيف • Recruiter Portal</span>
            </button>
          </div>
        )}
      </footer>

      {/* HR Login Modal */}
      <HRLoginModal
        isOpen={isLoginOpen}
        initialEmail={loginInitialEmail}
        onClose={() => {
          setIsLoginOpen(false);
          setLoginInitialEmail(undefined);
        }}
        onSuccess={(tok, usr) => {
          handleLoginSuccess(tok, usr);
        }}
      />

      {/* Live Outbox Modal (for inspecting sent emails) */}
      <OutboxModal
        isOpen={isOutboxOpen}
        onClose={() => setIsOutboxOpen(false)}
      />
    </div>
  );
}

export default App;
