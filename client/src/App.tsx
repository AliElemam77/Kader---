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

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'HR_MANAGER' | 'RECRUITER';
}

export function App() {
  const [activeTab, setActiveTab] = useState<'careers' | 'pipeline' | 'builder' | 'jobs' | 'team'>('careers');
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [loginInitialEmail, setLoginInitialEmail] = useState<string | undefined>(undefined);
  const [isOutboxOpen, setIsOutboxOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('ats_token'));
  const [user, setUser] = useState<AuthUser | null>(null);

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

  // 2. Validate Existing Token on Startup
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
            setToken(storedToken);
            setActiveTab('pipeline');
          } else {
            handleLogout(false);
          }
        })
        .catch(() => handleLogout(false));
    } else {
      setUser(null);
      setToken(null);
      setActiveTab('careers');
    }
  }, []);

  const handleLoginSuccess = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem('ats_token', newToken);
    setToken(newToken);
    setUser(newUser);
    setActiveTab('pipeline');
  };

  // Strict Role Guard: Ensure non-HR_MANAGER users can never access or remain on the Team tab
  useEffect(() => {
    if (user && user.role !== 'HR_MANAGER' && activeTab === 'team') {
      setActiveTab('pipeline');
    }
  }, [user, activeTab]);

  const handleLogout = (showToast = true) => {
    localStorage.removeItem('ats_token');
    setToken(null);
    setUser(null);
    setActiveTab('careers');
    if (showToast) {
      toast.info('تم تسجيل الخروج من مساحة العمل بنجاح');
    }
  };

  const handleNavigateFromJobs = (tab: 'pipeline' | 'builder', jobId: string) => {
    localStorage.setItem('ats_selected_job_id', jobId);
    localStorage.setItem('ats_builder_job_id', jobId);
    setActiveTab(tab);
  };

  const isLoggedIn = user !== null && token !== null;

  return (
    <div className="min-h-screen flex flex-col bg-[#070A14] text-[#EEF1F7] antialiased selection:bg-[#F5B23D]/20 selection:text-[#F5B23D]">
      <Toaster richColors position="top-right" theme="dark" closeButton />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
          <PublicCareers />
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
          toast.success(`مرحباً بك، ${usr.name}! تم تسجيل الدخول بنجاح`);
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
