import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
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
  const [isOutboxOpen, setIsOutboxOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('ats_token'));
  const [user, setUser] = useState<AuthUser | null>(null);

  // 1. Handle Magic Link Token in URL on Page Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get('token');

    if (magicToken) {
      const toastId = toast.loading('Verifying single-click Magic Link...');
      fetch(`${API_BASE_URL}/auth/verify-magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: magicToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.token) {
            handleLoginSuccess(data.data.token, data.data.user);
            toast.success(`Welcome back, ${data.data.user.name}! Logged in via Magic Link.`, { id: toastId });
          } else {
            toast.error(data.message || 'Magic link is invalid or expired.', { id: toastId });
          }
        })
        .catch(() => {
          toast.error('Error connecting to authentication server.', { id: toastId });
        })
        .finally(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
        });
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
            handleLogout();
          }
        })
        .catch(() => handleLogout());
    }
  }, []);


  const handleLoginSuccess = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem('ats_token', newToken);
    setToken(newToken);
    setUser(newUser);
    setActiveTab('pipeline');
  };

  const handleLogout = () => {
    localStorage.removeItem('ats_token');
    setToken(null);
    setUser(null);
    setActiveTab('careers');
    toast.info('Logged out of HR Workspace');
  };

  const handleNavigateFromJobs = (tab: 'pipeline' | 'builder', jobId: string) => {
    localStorage.setItem('ats_selected_job_id', jobId);
    localStorage.setItem('ats_builder_job_id', jobId);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070A14] text-[#EEF1F7] antialiased selection:bg-[#F5B23D]/20 selection:text-[#F5B23D]">
      <Toaster richColors position="top-right" theme="dark" closeButton />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenOutbox={() => setIsOutboxOpen(true)}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 pb-16">
        {activeTab === 'careers' && <PublicCareers />}
        {activeTab === 'pipeline' && <PipelinePreview token={token} />}
        {activeTab === 'builder' && <FormBuilderPreview />}
        {activeTab === 'jobs' && <JobsPreview onNavigate={handleNavigateFromJobs} />}
        {activeTab === 'team' && token && <TeamManagement token={token} />}
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
      </footer>

      <HRLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={(tok, usr) => {
          handleLoginSuccess(tok, usr);
          toast.success(`Authenticated successfully as ${usr.name}`);
        }}
      />

      <OutboxModal
        isOpen={isOutboxOpen}
        onClose={() => setIsOutboxOpen(false)}
      />
    </div>
  );
}

export default App;
