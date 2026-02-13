import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "ShadowSpeak <noreply@shadowspeak.net>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  async send({ to, subject, html }: SendEmailOptions) {
    if (!process.env.RESEND_API_KEY) {
      console.log("[Email] Skipping email (no API key configured):", { to, subject });
      return null;
    }

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      });

      if (result.error) {
        console.error("[Email] Resend API error:", {
          to,
          subject,
          error: result.error,
        });
        return null;
      }

      console.log("[Email] Sent successfully:", { to, subject, id: result.data?.id });
      return result;
    } catch (error) {
      console.error("[Email] Failed to send:", {
        to,
        subject,
        error: error instanceof Error ? error.message : error,
      });
      return null;
    }
  },

  // Notify teacher when student submits a lesson
  async notifyTeacherNewSubmission(
    teacherEmail: string,
    teacherName: string,
    studentName: string,
    lessonTitle: string
  ) {
    if (!teacherEmail) {
      console.log("[Email] Skipping teacher notification (no email):", teacherName);
      return null;
    }

    const subject = `New Submission: ${studentName} completed "${lessonTitle}"`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">New Lesson Submission</h2>
        <p>Hi ${teacherName},</p>
        <p><strong>${studentName}</strong> has submitted their recording for:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0; color: #333;">${lessonTitle}</h3>
        </div>
        <p>Please review the submission and provide feedback when ready.</p>
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/en/teacher/reviews"
           style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Review Submission
        </a>
        <p style="color: #666; margin-top: 24px; font-size: 14px;">
          — ShadowSpeak ESL App
        </p>
      </div>
    `;

    return this.send({ to: teacherEmail, subject, html });
  },

  // Notify student when teacher adds feedback
  async notifyStudentFeedback(
    studentEmail: string,
    studentName: string,
    lessonTitle: string,
    isCompleted: boolean
  ) {
    if (!studentEmail) {
      console.log("[Email] Skipping student notification (no email):", studentName);
      return null;
    }

    const subject = isCompleted
      ? `Lesson Completed: "${lessonTitle}"`
      : `New Feedback on "${lessonTitle}"`;

    const statusMessage = isCompleted
      ? `<p style="color: #2e7d32; font-weight: bold;">Your lesson has been marked as completed!</p>`
      : `<p>Your teacher has added feedback to your submission.</p>`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">${isCompleted ? "Lesson Completed!" : "New Feedback"}</h2>
        <p>Hi ${studentName},</p>
        ${statusMessage}
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0; color: #333;">${lessonTitle}</h3>
        </div>
        <p>Log in to view your feedback and continue practicing.</p>
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/en/student/lessons"
           style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 8px; margin-top: 16px;">
          View Feedback
        </a>
        <p style="color: #666; margin-top: 24px; font-size: 14px;">
          — ShadowSpeak ESL App
        </p>
      </div>
    `;

    return this.send({ to: studentEmail, subject, html });
  },

  // Notify user when they receive a reply on feedback
  async notifyFeedbackReply(
    recipientEmail: string,
    recipientName: string,
    lessonTitle: string,
    senderRole: "student" | "teacher"
  ) {
    if (!recipientEmail) {
      console.log("[Email] Skipping reply notification (no email):", recipientName);
      return null;
    }

    const senderLabel = senderRole === "teacher" ? "Your teacher" : "Your student";
    const subject = `New Reply on "${lessonTitle}"`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">New Reply</h2>
        <p>Hi ${recipientName},</p>
        <p>${senderLabel} has replied to the feedback on:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0; color: #333;">${lessonTitle}</h3>
        </div>
        <p>Log in to view the reply and continue the conversation.</p>
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/en/student/lessons"
           style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 8px; margin-top: 16px;">
          View Reply
        </a>
        <p style="color: #666; margin-top: 24px; font-size: 14px;">
          — ShadowSpeak ESL App
        </p>
      </div>
    `;

    return this.send({ to: recipientEmail, subject, html });
  },
};
