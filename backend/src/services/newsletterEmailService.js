import sendEmail from "./emailService.js";

const SERVER_URL = process.env.SERVER_URL || "https://browse-mart-backend.vercel.app";

/**
 * Sends a beautiful welcome email to a newly subscribed user.
 * @param {string} email - Subscriber's email address
 * @param {string} unsubscribeToken - Unique token for one-click unsubscribe
 */
export const sendWelcomeEmail = async (email, unsubscribeToken) => {
  const unsubscribeLink = `${SERVER_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

  const htmlContent = `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      Welcome to the Browse Mart Newsletter — exclusive deals await!
    </div>
    <div style="margin:0;padding:0;background-color:#f3f0ff;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
             style="border-collapse:collapse;background-color:#f3f0ff;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                   style="max-width:640px;border-collapse:collapse;">

              <!-- Logo / Brand -->
              <tr>
                <td style="padding:0 0 16px 0;text-align:center;font-size:24px;font-weight:900;
                           color:#4c1d95;letter-spacing:0.5px;">
                  Browse Mart
                </td>
              </tr>

              <!-- Card -->
              <tr>
                <td style="background-color:#ffffff;border:1px solid #ddd6fe;border-radius:16px;
                           overflow:hidden;box-shadow:0 14px 36px rgba(76,29,149,0.12);">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                         style="border-collapse:collapse;">

                    <!-- Header banner -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#7c3aed,#4c1d95);
                                 color:#ffffff;padding:22px 28px;font-size:20px;font-weight:700;">
                        🎉 You're subscribed!
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:28px 28px 12px 28px;color:#1e1b4b;font-size:15px;line-height:1.7;">
                        <p style="margin:0 0 14px 0;">Hello,</p>
                        <p style="margin:0 0 14px 0;">
                          Thank you for joining the <strong>Browse Mart Newsletter</strong>!
                          You'll be among the first to hear about:
                        </p>
                        <ul style="margin:0 0 14px 0;padding-left:20px;color:#4c1d95;font-weight:600;">
                          <li style="margin-bottom:8px;">🛍️ Exclusive deals &amp; flash sales</li>
                          <li style="margin-bottom:8px;">🆕 New product arrivals</li>
                          <li style="margin-bottom:8px;">💡 Tips, guides &amp; platform updates</li>
                        </ul>
                        <p style="margin:0;">
                          We promise to keep things interesting — no spam, only the good stuff.
                        </p>
                      </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                      <td align="center" style="padding:20px 28px;">
                        <a href="https://browse-mart.vercel.app"
                           style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4c1d95);
                                  color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;
                                  padding:14px 36px;border-radius:10px;
                                  box-shadow:0 6px 20px rgba(124,58,237,0.35);">
                          Shop Now →
                        </a>
                      </td>
                    </tr>

                    <!-- Footer note -->
                    <tr>
                      <td style="padding:16px 28px 24px 28px;color:#64748b;font-size:12px;
                                 border-top:1px solid #e2e8f0;line-height:1.7;">
                        If you didn't subscribe, you can safely ignore this email.<br/>
                        <a href="${unsubscribeLink}"
                           style="color:#7c3aed;text-decoration:underline;">Unsubscribe</a>
                        from our newsletter at any time.
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>

              <!-- Bottom disclaimer -->
              <tr>
                <td style="padding-top:14px;text-align:center;color:#94a3b8;font-size:12px;line-height:1.6;">
                  This is an automated message from Browse Mart.<br/>
                  © ${new Date().getFullYear()} Browse Mart. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  return sendEmail(email, "Welcome to Browse Mart Newsletter! 🎉", htmlContent);
};

/**
 * Sends a newsletter email to a single recipient.
 * Wraps the admin's HTML content in our branded email template.
 * @param {string} email - Recipient's email
 * @param {string} unsubscribeToken - Unique token for one-click unsubscribe
 * @param {string} subject - Newsletter subject line
 * @param {string} bodyHtml - Admin-composed HTML content (from TipTap)
 */
export const sendNewsletterEmail = async (email, unsubscribeToken, subject, bodyHtml) => {
  const unsubscribeLink = `${SERVER_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

  const htmlContent = `
    <div style="margin:0;padding:0;background-color:#f3f0ff;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
             style="border-collapse:collapse;background-color:#f3f0ff;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                   style="max-width:640px;border-collapse:collapse;">

              <!-- Brand -->
              <tr>
                <td style="padding:0 0 16px 0;text-align:center;font-size:24px;font-weight:900;
                           color:#4c1d95;letter-spacing:0.5px;">
                  Browse Mart
                </td>
              </tr>

              <!-- Card -->
              <tr>
                <td style="background-color:#ffffff;border:1px solid #ddd6fe;border-radius:16px;
                           overflow:hidden;box-shadow:0 14px 36px rgba(76,29,149,0.12);">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                         style="border-collapse:collapse;">

                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#7c3aed,#4c1d95);
                                 color:#ffffff;padding:22px 28px;font-size:20px;font-weight:700;">
                        📬 ${subject}
                      </td>
                    </tr>

                    <!-- Admin content -->
                    <tr>
                      <td style="padding:28px;color:#1e1b4b;font-size:15px;line-height:1.7;">
                        ${bodyHtml}
                      </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                      <td align="center" style="padding:12px 28px 24px 28px;">
                        <a href="https://browse-mart.vercel.app"
                           style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4c1d95);
                                  color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;
                                  padding:14px 36px;border-radius:10px;
                                  box-shadow:0 6px 20px rgba(124,58,237,0.35);">
                          Visit Browse Mart →
                        </a>
                      </td>
                    </tr>

                    <!-- Unsubscribe footer -->
                    <tr>
                      <td style="padding:16px 28px 24px 28px;color:#64748b;font-size:12px;
                                 border-top:1px solid #e2e8f0;line-height:1.7;">
                        You are receiving this because you subscribed to Browse Mart newsletters.<br/>
                        <a href="${unsubscribeLink}"
                           style="color:#7c3aed;text-decoration:underline;">Unsubscribe</a>
                        to stop receiving these emails.
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>

              <!-- Bottom -->
              <tr>
                <td style="padding-top:14px;text-align:center;color:#94a3b8;font-size:12px;line-height:1.6;">
                  © ${new Date().getFullYear()} Browse Mart. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  return sendEmail(email, subject, htmlContent);
};
