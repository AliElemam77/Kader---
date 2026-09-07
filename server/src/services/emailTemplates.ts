export interface PipelineStageInfo {
  id: string;
  name: string;
  order?: number;
  stageType?: string;
}

export interface InterviewDetails {
  date: string;
  dayOfWeek: string;
  time: string;
  durationMinutes: number;
  modality: 'ONLINE' | 'OFFLINE';
  locationOrLink: string;
  interviewerName: string;
  notes?: string;
}

export interface StageTaskDetails {
  title?: string;
  description?: string;
  taskUrl?: string;
  deadline?: string;
}

/**
 * Master email layout inspired by the modern aesthetic:
 * Floating pristine white card on deep cosmic dark space background,
 * black squircle logo, sleek typography, warm amber alert box,
 * and ambient glowing blue back-light with social links.
 */
function buildMasterEmailLayout(params: {
  title: string;
  subtitle: string;
  contentHtml: string;
  alertBoxTitle?: string;
  alertBoxContent?: string;
  badgePillText?: string;
  automatedNote?: string;
}): string {
  const {
    title,
    subtitle,
    contentHtml,
    alertBoxTitle = 'Important Note',
    alertBoxContent,
    badgePillText,
    automatedNote = 'This is an automated message. Please do not reply.',
  } = params;

  return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #070a14;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        @media only screen and (max-width: 520px) {
          .email-card {
            padding: 28px 20px !important;
            border-radius: 20px !important;
          }
          .otp-box {
            width: 38px !important;
            height: 44px !important;
            font-size: 18px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 40px 16px; background-color: #070a14; background-image: radial-gradient(circle at 50% 20%, #151c38 0%, #070a14 70%); min-height: 100vh;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto;">
        <!-- MAIN WHITE FLOATING CARD -->
        <tr>
          <td>
            <div class="email-card" style="background-color: #ffffff; border-radius: 28px; padding: 40px 36px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08); text-align: center; color: #111827;">
              
              <!-- Top App Logo Squircle Badge with Kader Mark -->
              <div style="margin: 0 auto 22px auto; width: 50px; height: 50px; background: #070A14; border-radius: 14px; box-shadow: 0 10px 25px -5px rgba(7, 10, 20, 0.5); text-align: center; line-height: 50px;">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-top: 11px;">
                  <circle cx="9" cy="23" r="4" fill="#5A6478" />
                  <rect x="5" y="29" width="8" height="13" rx="4" fill="#5A6478" />
                  <circle cx="24" cy="17" r="4" fill="#4C8DFF" />
                  <rect x="20" y="23" width="8" height="19" rx="4" fill="#4C8DFF" />
                  <circle cx="39" cy="10" r="4" fill="#F5B23D" />
                  <rect x="35" y="16" width="8" height="26" rx="4" fill="#F5B23D" />
                </svg>
              </div>

              <!-- Main Title -->
              <h1 style="color: #0f172a; font-size: 21px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.4px; line-height: 1.3;">
                ${title}
              </h1>

              <!-- Subtitle -->
              <p style="color: #64748b; font-size: 13.5px; margin: 0 0 24px 0; line-height: 1.5;">
                ${subtitle}
              </p>

              <!-- Dynamic Content Block -->
              <div style="text-align: left; margin-bottom: 24px;">
                ${contentHtml}
              </div>

              <!-- Soft Amber / Cream Warning Alert Box (matches the reference image) -->
              ${
                alertBoxContent
                  ? `
                <div style="background-color: #FEF9EE; border: 1px solid #FDE68A; border-radius: 16px; padding: 14px 18px; text-align: left; margin: 24px 0 18px 0;">
                  <div style="font-size: 12.5px; font-weight: 700; color: #92400E; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 14px;">⚠️</span> ${alertBoxTitle}
                  </div>
                  <div style="font-size: 11.5px; color: #A16207; line-height: 1.55;">
                    ${alertBoxContent}
                  </div>
                </div>
              `
                  : ''
              }

              <!-- Automated Message Note -->
              <p style="color: #94a3b8; font-size: 11.5px; margin: 20px 0 16px 0; line-height: 1.4;">
                ${automatedNote}
              </p>

              <!-- Meta / IP Pill Badge (matches the reference image) -->
              ${
                badgePillText
                  ? `
                <div style="margin-top: 4px;">
                  <span style="display: inline-block; background: #1e293b; color: #cbd5e1; font-size: 10.5px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 600; padding: 5px 14px; border-radius: 9999px; letter-spacing: 0.3px;">
                    ${badgePillText}
                  </span>
                </div>
              `
                  : ''
              }

            </div>
          </td>
        </tr>

        <!-- FOOTER: Ambient Glowing Backlight, Social Circles & Copyright -->
        <tr>
          <td style="padding-top: 24px; text-align: center;">
            <!-- Ambient Blue Glow Fan Container -->
            <div style="background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.4) 0%, rgba(56, 189, 248, 0.15) 45%, transparent 75%); padding: 16px 0 20px 0;">
              
              <!-- Social Media White Circle Badges -->
              <div style="margin-bottom: 16px;">
                <a href="https://twitter.com" target="_blank" style="display: inline-block; width: 34px; height: 34px; border-radius: 50%; background: #ffffff; margin: 0 5px; text-align: center; line-height: 34px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px; vertical-align: middle;">
                  𝕏
                </a>
                <a href="https://linkedin.com" target="_blank" style="display: inline-block; width: 34px; height: 34px; border-radius: 50%; background: #ffffff; margin: 0 5px; text-align: center; line-height: 34px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px; vertical-align: middle; color: #0284c7; font-weight: bold;">
                  in
                </a>
                <a href="https://kader.sa" target="_blank" style="display: inline-block; width: 34px; height: 34px; border-radius: 50%; background: #ffffff; margin: 0 5px; text-align: center; line-height: 34px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px; vertical-align: middle;">
                  🌐
                </a>
              </div>

              <!-- Copyright & Contact Information -->
              <p style="color: #93c5fd; font-size: 12px; font-weight: 500; margin: 0 0 6px 0; letter-spacing: 0.2px;">
                All rights reserved to Kader (كادر) ATS © 2026.
              </p>
              <p style="color: #60a5fa; font-size: 11px; margin: 0; opacity: 0.9;">
                Email: support@kader.sa &bull; One track from apply to hire.
              </p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * 1. Auth OTP Verification & 1-Click Magic Link Email
 * Matches the user's uploaded image with individual 6-digit boxes,
 * warning alert box, and dark cosmic background.
 */
export function generateAuthOtpEmail(params: {
  userName: string;
  otpCode: string;
  magicLinkUrl: string;
  clientIp?: string;
}): string {
  const { userName, otpCode, magicLinkUrl, clientIp = '192.135.152' } = params;

  // Split OTP into single characters for the individual rounded boxes
  const digits = otpCode.split('');
  const digitBoxesHtml = `
    <div style="text-align: center; margin: 18px 0 12px 0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
        <tr>
          ${digits
            .map(
              (digit) => `
            <td style="padding: 0 4px;">
              <div class="otp-box" style="width: 44px; height: 50px; line-height: 50px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 22px; font-weight: 800; color: #0f172a; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                ${digit}
              </div>
            </td>
          `
            )
            .join('')}
        </tr>
      </table>
      <p style="color: #94a3b8; font-size: 11.5px; margin: 12px 0 0 0; font-weight: 500;">
        Don't share this code with anyone!
      </p>
    </div>
  `;

  const contentHtml = `
    <p style="color: #334155; font-size: 14px; margin: 0 0 16px 0; text-align: center; line-height: 1.5;">
      Hello <strong>${userName}</strong>, use the secure 6-digit verification code below to log in to your HR workspace:
    </p>

    ${digitBoxesHtml}

    <div style="text-align: center; margin: 24px 0 14px 0;">
      <a href="${magicLinkUrl}" target="_blank" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 12px; font-weight: 700; display: inline-block; font-size: 13.5px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);">
        ✨ Or Log In Instantly with Magic Link
      </a>
    </div>
  `;

  const alertBoxContent = `
    This code was requested from an active browser session. If you did not initiate this request, someone may have mistyped their email. You can safely <strong>ignore this email</strong>.
  `;

  return buildMasterEmailLayout({
    title: 'Your Login Verification Code',
    subtitle: 'Sign in securely to your Hire ATS recruitment workspace',
    contentHtml,
    alertBoxTitle: 'Was this request not made by you?',
    alertBoxContent,
    badgePillText: `&bull; IP ${clientIp}`,
    automatedNote: 'This is an automated security message. Please do not reply.',
  });
}

/**
 * 2. Application Received Confirmation Email
 * Sent immediately when a candidate submits an application.
 */
export function generateApplicationReceivedEmail(params: {
  candidateName: string;
  jobTitle: string;
  stages?: PipelineStageInfo[];
  currentStageName?: string;
}): string {
  const { candidateName, jobTitle, stages = [], currentStageName } = params;
  const initialStage = currentStageName || (stages.length > 0 ? stages[0].name : 'Resume Screening & Review');

  const stageChipsHtml =
    stages.length > 0
      ? `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin: 18px 0;">
          <p style="color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 0.5px;">
            🗺️ Hiring Pipeline Stages:
          </p>
          <div>
            ${stages
              .map(
                (s, i) => `
              <span style="display: inline-block; background: ${i === 0 ? '#eff6ff' : '#ffffff'}; color: ${i === 0 ? '#2563eb' : '#64748b'}; border: 1px solid ${i === 0 ? '#93c5fd' : '#e2e8f0'}; font-size: 11.5px; font-weight: ${i === 0 ? '700' : '500'}; padding: 4px 10px; border-radius: 16px; margin: 3px;">
                ${i + 1}. ${s.name} ${i === 0 ? '📍 (Current)' : ''}
              </span>
            `
              )
              .join('')}
          </div>
        </div>
      `
      : '';

  const contentHtml = `
    <p style="color: #334155; font-size: 14px; margin: 0 0 14px 0; line-height: 1.6;">
      Dear <strong>${candidateName}</strong>,
    </p>
    <p style="color: #475569; font-size: 13.5px; margin: 0 0 16px 0; line-height: 1.6;">
      Thank you for your interest in joining our team! We have successfully received your application and resume for the <strong>${jobTitle}</strong> role.
    </p>

    <!-- Current Stage Highlight Box -->
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #a7f3d0; border-radius: 14px; padding: 16px 18px; margin: 16px 0;">
      <div style="font-size: 11.5px; color: #059669; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Your Current Hiring Stage:</div>
      <div style="font-size: 17px; font-weight: 800; color: #047857; margin-top: 4px;">📍 ${initialStage}</div>
      <div style="font-size: 12px; color: #065f46; margin-top: 4px;">Our talent team will notify you automatically by email as your application advances.</div>
    </div>

    ${stageChipsHtml}
  `;

  const alertBoxContent = `
    Our hiring managers review all qualified profiles carefully. You will receive an automated email notification at each stage with next steps, interview invitations, or assignments.
  `;

  return buildMasterEmailLayout({
    title: 'Application Received',
    subtitle: `We have received your application for ${jobTitle}`,
    contentHtml,
    alertBoxTitle: 'What happens next?',
    alertBoxContent,
    badgePillText: '• Status: Under Review',
    automatedNote: 'This is an automated notification from the Hire ATS Recruitment System.',
  });
}

/**
 * 3. Stage Transition & Interview/Task Scheduling Email
 * Sent when recruiter moves candidate, schedules an interview, or assigns a task.
 */
export function generateStageTransitionEmail(params: {
  candidateName: string;
  jobTitle: string;
  stageName: string;
  scheduledInterview?: InterviewDetails;
  stageTask?: StageTaskDetails;
  stageNotes?: string;
}): string {
  const { candidateName, jobTitle, stageName, scheduledInterview, stageTask, stageNotes } = params;

  let interviewCardHtml = '';
  if (scheduledInterview) {
    interviewCardHtml = `
      <div style="background: #f8fafc; padding: 18px 20px; border-radius: 14px; margin: 18px 0; border: 1px solid #e2e8f0; border-left: 4px solid #6366f1;">
        <h3 style="color: #4f46e5; margin: 0 0 12px 0; font-size: 14.5px; font-weight: 700;">
          📅 Scheduled Interview Details:
        </h3>
        <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
          <tr>
            <td style="padding: 5px 0; color: #64748b; width: 130px;"><strong>Date & Day:</strong></td>
            <td style="padding: 5px 0; color: #0f172a; font-weight: 600;">${scheduledInterview.dayOfWeek}, ${scheduledInterview.date}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;"><strong>Time & Duration:</strong></td>
            <td style="padding: 5px 0; color: #0f172a;">${scheduledInterview.time} (${scheduledInterview.durationMinutes} mins)</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;"><strong>Modality:</strong></td>
            <td style="padding: 5px 0; color: #0f172a;">${scheduledInterview.modality === 'ONLINE' ? '🌐 Video Call (Online)' : '🏢 In-Person (Office Headquarters)'}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;"><strong>Meeting Link / Place:</strong></td>
            <td style="padding: 5px 0;">
              <a href="${scheduledInterview.locationOrLink}" target="_blank" style="color: #4f46e5; text-decoration: underline; font-weight: 600;">
                ${scheduledInterview.locationOrLink}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;"><strong>Interviewer:</strong></td>
            <td style="padding: 5px 0; color: #0f172a;">${scheduledInterview.interviewerName}</td>
          </tr>
        </table>
        ${
          scheduledInterview.notes
            ? `
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 12px; color: #475569;">
            <strong style="color: #1e293b;">Preparation Notes:</strong> ${scheduledInterview.notes}
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  let taskCardHtml = '';
  if (stageTask && (stageTask.title || stageTask.description || stageTask.taskUrl || stageTask.deadline)) {
    taskCardHtml = `
      <div style="background: #f8fafc; padding: 18px 20px; border-radius: 14px; margin: 18px 0; border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b;">
        <h3 style="color: #d97706; margin: 0 0 10px 0; font-size: 14.5px; font-weight: 700;">
          📋 ${stageTask.title || 'Technical Task / Assignment Instructions:'}
        </h3>
        ${
          stageTask.description
            ? `
          <div style="color: #334155; font-size: 13px; line-height: 1.6; margin-bottom: 12px; white-space: pre-wrap; background: #ffffff; padding: 12px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
            ${stageTask.description}
          </div>
        `
            : ''
        }
        ${
          stageTask.taskUrl
            ? `
          <div style="margin-bottom: 10px; font-size: 12.5px; background: #eff6ff; border: 1px solid #bfdbfe; padding: 8px 12px; border-radius: 8px;">
            <strong style="color: #1d4ed8;">🔗 Task Repository / Resource:</strong>
            <a href="${stageTask.taskUrl}" target="_blank" style="color: #2563eb; text-decoration: underline; font-weight: 700; margin-left: 6px;">
              ${stageTask.taskUrl}
            </a>
          </div>
        `
            : ''
        }
        ${
          stageTask.deadline
            ? `
          <div style="font-size: 12px; background: #fef3c7; border: 1px solid #fde68a; padding: 6px 12px; border-radius: 6px; display: inline-block;">
            <strong style="color: #b45309;">⏰ Submission Deadline:</strong>
            <span style="color: #78350f; font-weight: 700; margin-left: 4px;">${stageTask.deadline}</span>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  let notesCardHtml = '';
  if (stageNotes) {
    notesCardHtml = `
      <div style="background: #f1f5f9; padding: 14px 18px; border-radius: 12px; margin: 16px 0; border-left: 4px solid #64748b;">
        <div style="color: #334155; font-size: 12px; font-weight: 700; margin-bottom: 4px;">📝 Note from the Hiring Team:</div>
        <div style="color: #475569; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${stageNotes}</div>
      </div>
    `;
  }

  const contentHtml = `
    <p style="color: #334155; font-size: 14px; margin: 0 0 14px 0; line-height: 1.6;">
      Dear <strong>${candidateName}</strong>,
    </p>
    <p style="color: #475569; font-size: 13.5px; margin: 0 0 16px 0; line-height: 1.6;">
      We are pleased to inform you that your application for <strong>${jobTitle}</strong> has advanced in our recruitment process.
    </p>

    <!-- Stage Announcement Badge -->
    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #93c5fd; border-radius: 14px; padding: 16px 18px; text-align: center; margin: 16px 0;">
      <div style="font-size: 11px; color: #1d4ed8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">New Stage:</div>
      <div style="font-size: 18px; font-weight: 800; color: #1e40af; margin-top: 3px;">🚀 ${stageName}</div>
    </div>

    ${interviewCardHtml}
    ${taskCardHtml}
    ${notesCardHtml}
  `;

  const alertBoxContent = `
    Please review the scheduled interview time or task requirements thoroughly. If you need to reschedule or have any questions, please reply directly to this email.
  `;

  return buildMasterEmailLayout({
    title: 'Application Status Update',
    subtitle: `You have advanced to: ${stageName}`,
    contentHtml,
    alertBoxTitle: 'Action Required / Next Steps',
    alertBoxContent,
    badgePillText: `• Stage: ${stageName}`,
    automatedNote: 'This is an automated notification from the Hire ATS Recruitment System.',
  });
}

/**
 * 4. Hired / Offer Congratulations Email
 */
export function generateHiredEmail(params: {
  candidateName: string;
  jobTitle: string;
}): string {
  const { candidateName, jobTitle } = params;

  const contentHtml = `
    <p style="color: #334155; font-size: 14px; margin: 0 0 14px 0; line-height: 1.6;">
      Dear <strong>${candidateName}</strong>,
    </p>
    <p style="color: #475569; font-size: 13.5px; margin: 0 0 16px 0; line-height: 1.6;">
      We are absolutely thrilled to inform you that you have successfully completed all evaluation rounds and been selected for the position of <strong>${jobTitle}</strong>!
    </p>

    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #6ee7b7; border-radius: 14px; padding: 18px 20px; margin: 18px 0; text-align: center;">
      <div style="font-size: 24px; margin-bottom: 6px;">🎉</div>
      <div style="font-size: 18px; font-weight: 800; color: #047857;">Job Offer Extended!</div>
      <div style="font-size: 12.5px; color: #065f46; margin-top: 4px;">Welcome to our growing team. We look forward to achieving great things together!</div>
    </div>
  `;

  const alertBoxContent = `
    A member of our Talent & People Operations team will reach out to you shortly with your official employment contract, benefit details, and onboarding schedule.
  `;

  return buildMasterEmailLayout({
    title: 'Congratulations on Your Offer! 🎉',
    subtitle: `Offer of Employment: ${jobTitle}`,
    contentHtml,
    alertBoxTitle: 'Welcome to the Team!',
    alertBoxContent,
    badgePillText: '• Status: Selected & Hired',
    automatedNote: 'Official offer notification from the Hire Talent Acquisition Team.',
  });
}

/**
 * 5. Constructive & Respectful Rejection Email
 */
export function generateRejectionEmail(params: {
  candidateName: string;
  jobTitle: string;
  rejectionReason: string;
}): string {
  const { candidateName, jobTitle, rejectionReason } = params;

  const contentHtml = `
    <p style="color: #334155; font-size: 14px; margin: 0 0 14px 0; line-height: 1.6;">
      Dear <strong>${candidateName}</strong>,
    </p>
    <p style="color: #475569; font-size: 13.5px; margin: 0 0 14px 0; line-height: 1.6;">
      Thank you sincerely for taking the time to apply for the <strong>${jobTitle}</strong> position and for sharing your experience with us.
    </p>
    <p style="color: #475569; font-size: 13.5px; margin: 0 0 16px 0; line-height: 1.6;">
      After careful review of all submissions, we regret to inform you that we will not be moving forward with your candidacy at this time. Out of respect for your time, here is specific feedback regarding our decision:
    </p>

    <!-- Feedback Reason Box -->
    <div style="background: #fff1f2; border: 1px solid #fecdd3; border-left: 4px solid #f43f5e; border-radius: 12px; padding: 14px 18px; margin: 16px 0;">
      <div style="font-size: 11.5px; color: #be123c; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Recruiter Feedback:</div>
      <div style="font-size: 13px; color: #881337; line-height: 1.55; margin-top: 4px; white-space: pre-wrap;">
        ${rejectionReason.trim()}
      </div>
    </div>

    <p style="color: #64748b; font-size: 12.5px; margin: 16px 0 0 0; line-height: 1.5;">
      We will keep your profile in our talent community and will reach out if a role better suited to your skill set opens up in the future. We wish you every success in your career.
    </p>
  `;

  const alertBoxContent = `
    Our talent pool is constantly reviewed for new openings. You are welcome to apply for future opportunities that align with your background.
  `;

  return buildMasterEmailLayout({
    title: 'Application Status Update',
    subtitle: `Update regarding your application for ${jobTitle}`,
    contentHtml,
    alertBoxTitle: 'Talent Community Notification',
    alertBoxContent,
    badgePillText: '• Status: Application Concluded',
    automatedNote: 'This is an automated notification from the Hire Talent Acquisition Team.',
  });
}
