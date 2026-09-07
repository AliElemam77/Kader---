import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ATS Database with Initial Data...');

  // 1. Seed HR Admin & Recruiter
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hire-ats.local' },
    update: {},
    create: {
      email: 'admin@hire-ats.local',
      name: 'Sarah Al-Ghamdi',
      role: 'HR_MANAGER',
      status: 'ACTIVE',
    },
  });

  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@hire-ats.local' },
    update: {},
    create: {
      email: 'recruiter@hire-ats.local',
      name: 'Karim Zaki',
      role: 'RECRUITER',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Users created: ${admin.email} (HR_MANAGER), ${recruiter.email} (RECRUITER)`);

  // 2. Seed Published Jobs
  const job1 = await prisma.job.upsert({
    where: { slug: 'sr-fullstack-engineer' },
    update: {},
    create: {
      title: 'Senior Full-Stack Engineer (Node.js & React)',
      slug: 'sr-fullstack-engineer',
      department: 'Engineering & Tech',
      location: 'Riyadh, Saudi Arabia / Remote',
      employmentType: 'Full-time',
      status: 'PUBLISHED',
      createdById: admin.id,
      description: 'We are seeking a seasoned Senior Full-Stack Engineer to architect high-throughput APIs, lead modern microservices, and craft responsive web applications using Express, TypeScript, and React.',
      formFields: [
        { id: 'full_name', label: 'Full Legal Name', type: 'text', required: true, order: 1 },
        { id: 'email', label: 'Work Email Address', type: 'email', required: true, order: 2 },
        { id: 'phone', label: 'Mobile Number', type: 'text', required: true, order: 3 },
        { id: 'years_experience', label: 'Years of Experience with Node & React', type: 'number', required: true, order: 4 },
        { id: 'github_url', label: 'GitHub Profile or Open Source Contributions', type: 'text', required: false, order: 5 },
        { id: 'notice_period', label: 'Notice Period (in days)', type: 'number', required: true, order: 6 },
      ],
      pipelineStages: [
        { id: 'applied', name: 'Applied / In Review', order: 1, color: '#38bdf8' },
        {
          id: 'screening',
          name: 'HR Screening',
          order: 2,
          color: '#818cf8',
          emailNotification: {
            enabled: true,
            subject: 'Interview Invitation: HR Screening',
            bodyTemplate: 'Hi {{candidate_name}}, let us connect for a 15-min call.',
          },
        },
        {
          id: 'technical',
          name: 'Technical Assessment',
          order: 3,
          color: '#fbbf24',
          emailNotification: {
            enabled: true,
            subject: 'Technical Coding Challenge Invitation',
            bodyTemplate: 'Hi {{candidate_name}}, congratulations on reaching the technical challenge.',
          },
        },
        { id: 'manager_interview', name: 'Engineering Manager Interview', order: 4, color: '#c084fc' },
        {
          id: 'offer',
          name: 'Offer & Hired',
          order: 5,
          color: '#34d399',
          emailNotification: {
            enabled: true,
            subject: 'Congratulations! Official Job Offer',
            bodyTemplate: 'We are pleased to offer you the position.',
          },
        },
      ],
    },
  });

  const job2 = await prisma.job.upsert({
    where: { slug: 'product-design-lead' },
    update: {},
    create: {
      title: 'Lead Product Designer (UI/UX)',
      slug: 'product-design-lead',
      department: 'Product & Design',
      location: 'Dubai, UAE / Hybrid',
      employmentType: 'Full-time',
      status: 'PUBLISHED',
      createdById: admin.id,
      description: 'Looking for a visionary Product Design Lead to own the design system, lead user research, and shape the end-to-end recruitment platform experience.',
      formFields: [
        { id: 'full_name', label: 'Full Legal Name', type: 'text', required: true, order: 1 },
        { id: 'email', label: 'Email Address', type: 'email', required: true, order: 2 },
        { id: 'phone', label: 'Phone Number', type: 'text', required: false, order: 3 },
        { id: 'portfolio_url', label: 'Figma or Online Portfolio URL', type: 'text', required: true, order: 4 },
        {
          id: 'primary_tool',
          label: 'Primary Design Tool',
          type: 'select',
          required: true,
          options: ['Figma', 'Sketch', 'Adobe XD', 'Framer'],
          order: 5,
        },
      ],
      pipelineStages: [
        { id: 'applied', name: 'Portfolio Review', order: 1, color: '#38bdf8' },
        { id: 'design_challenge', name: 'Design Challenge', order: 2, color: '#fbbf24' },
        { id: 'stakeholder_interview', name: 'Stakeholder & Culture Fit', order: 3, color: '#c084fc' },
        { id: 'offer', name: 'Offer Made', order: 4, color: '#34d399' },
      ],
    },
  });

  console.log(`✅ Jobs created: "${job1.title}", "${job2.title}"`);

  // 3. Seed Candidates
  const count = await prisma.candidate.count();
  if (count === 0) {
    await prisma.candidate.createMany({
      data: [
        {
          jobId: job1.id,
          name: 'Tariq Mansour',
          email: 'tariq.mansour@example.com',
          phone: '+966 50 123 4567',
          applicantData: {
            years_experience: 6,
            github_url: 'https://github.com/tmansour',
            notice_period: 30,
          },
          currentStage: 'screening',
          status: 'IN_PROGRESS',
        },
        {
          jobId: job1.id,
          name: 'Dina El-Sayed',
          email: 'dina.elsayed@example.com',
          phone: '+20 100 234 5678',
          applicantData: {
            years_experience: 5,
            github_url: 'https://github.com/dinaelsayed',
            notice_period: 15,
          },
          currentStage: 'technical',
          status: 'IN_PROGRESS',
        },
        {
          jobId: job2.id,
          name: 'Layla Al-Khatib',
          email: 'layla.design@example.com',
          phone: '+971 50 987 6543',
          applicantData: {
            portfolio_url: 'https://layla.design/portfolio',
            primary_tool: 'Figma',
          },
          currentStage: 'applied',
          status: 'PENDING',
        },
      ],
    });
    console.log('✅ Mock Candidates seeded.');
  }

  console.log('✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
