/**
 * Standardized TanStack React Query Keys Factory
 * Ensures consistent cache management, invalidation, and optimistic updates
 */
export const queryKeys = {
  jobs: {
    all: ['jobs'] as const,
    detail: (id: string) => ['jobs', id] as const,
    public: ['public-jobs'] as const,
    publicDetail: (id: string) => ['public-jobs', id] as const,
  },
  candidates: {
    byJob: (jobId: string) => ['candidates', { jobId }] as const,
    detail: (id: string) => ['candidate', id] as const,
  },
  team: {
    all: ['team'] as const,
  },
  outbox: {
    all: ['outbox'] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
};
