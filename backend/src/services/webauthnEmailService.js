import sendEmail from "./emailService.js";

const emailWrapper = (title, bodyContent) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .content { padding: 32px 24px; color: #374151; font-size: 15px; line-height: 1.6; }
    .badge { display: inline-block; padding: 6px 14px; background: #e0e7ff; color: #3730a3; border-radius: 9999px; font-weight: 600; font-size: 13px; margin-bottom: 16px; }
    .alert-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 6px; margin: 20px 0; }
    .alert-title { color: #991b1b; font-weight: 600; margin-bottom: 4px; }
    .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 20px 0; text-align: center; }
    .btn-danger { background: #dc2626; color: #ffffff !important; }
    .footer { padding: 20px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BrowseMart Security</h1>
    </div>
    <div class="content">
      <div class="badge">Security Alert</div>
      <h2 style="margin-top: 0; color: #111827;">${title}</h2>
      ${bodyContent}
    </div>
    <div class="footer">
      <p>This is an automated security notification from BrowseMart. If you have questions, please contact our support team.</p>
    </div>
  </div>
</body>
</html>
`;

export const sendPasskeyAddedEmail = async ({ to, name, deviceName }) => {
  const subject = "Security Alert: New Passkey Added to Your BrowseMart Account";
  const bodyContent = `
    <p>Hi ${name || "there"},</p>
    <p>A new passkey <strong>"${deviceName || "Passkey Device"}"</strong> was successfully registered on your BrowseMart account.</p>
    <p>With passkeys enabled, you can log in securely and passwordlessly using your device's biometric sensor or security key.</p>
    <div class="alert-box">
      <div class="alert-title">Didn't register this passkey?</div>
      <p style="margin: 0; color: #7f1d1d; font-size: 13px;">If you did not perform this action, your account may be compromised. Please sign in to your BrowseMart settings immediately and remove any unrecognized passkeys.</p>
    </div>
  `;
  return await sendEmail(to, subject, emailWrapper("New Passkey Added", bodyContent));
};

export const sendPasskeyRemovedEmail = async ({ to, name, deviceName }) => {
  const subject = "Security Alert: Passkey Removed from Your BrowseMart Account";
  const bodyContent = `
    <p>Hi ${name || "there"},</p>
    <p>The passkey <strong>"${deviceName || "Passkey Device"}"</strong> has been removed from your BrowseMart account.</p>
    <div class="alert-box">
      <div class="alert-title">Didn't remove this passkey?</div>
      <p style="margin: 0; color: #7f1d1d; font-size: 13px;">If you did not initiate this change, someone else may have gained unauthorized access to your account. Please log in immediately, check your registered devices, and update your security settings.</p>
    </div>
  `;
  return await sendEmail(to, subject, emailWrapper("Passkey Removed", bodyContent));
};

export const sendRecoveryEmailVerification = async ({ to, name, verifyUrl, otpCode }) => {
  const subject = "Verify Your Recovery Email for BrowseMart Passwordless Account";
  const bodyContent = `
    <p>Hi ${name || "there"},</p>
    <p>Thank you for setting up passwordless passkey login with BrowseMart!</p>
    <p>Because your account uses passwordless passkeys, having a verified recovery email is essential to ensure you are never permanently locked out if you lose your device.</p>
    ${
      otpCode
        ? `<div style="text-align: center; margin: 24px 0;"><span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4f46e5; background: #eef2ff; padding: 12px 24px; border-radius: 8px; display: inline-block;">${otpCode}</span></div>`
        : ""
    }
    ${
      verifyUrl
        ? `<p style="text-align: center;"><a href="${verifyUrl}" class="btn">Verify Recovery Email</a></p>`
        : ""
    }
    <p style="font-size: 13px; color: #6b7280;">If you did not create a BrowseMart account, you can safely ignore this email.</p>
  `;
  return await sendEmail(to, subject, emailWrapper("Verify Recovery Email", bodyContent));
};

export const sendPasskeyRecoveryInitiatedEmail = async ({
  to,
  name,
  coolingOffHours,
  statusUrl,
  cancelUrl,
}) => {
  const subject = "URGENT: Passkey Recovery Initiated for Your BrowseMart Account";
  const bodyContent = `
    <p>Hi ${name || "there"},</p>
    <p>A request was made to recover access to your passwordless BrowseMart account via this recovery email.</p>
    <div class="alert-box">
      <div class="alert-title">Security Cooling-Off Period Active</div>
      <p style="margin: 0; color: #7f1d1d; font-size: 13px;">
        To protect your account against unauthorized recovery, a mandatory <strong>${coolingOffHours}-hour cooling-off period</strong> has started. During this time, the recovery cannot be finalized without giving you time to respond.
      </p>
    </div>
    <p>If you requested this recovery, you can track the cooling-off status and register your replacement passkey once the period ends:</p>
    <p style="text-align: center;"><a href="${statusUrl}" class="btn">View Recovery Status</a></p>
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #e5e7eb;">
      <p style="color: #dc2626; font-weight: 600; margin-bottom: 8px;">If you DID NOT request this recovery:</p>
      <p style="font-size: 14px; margin-top: 0;">Click the button below immediately to cancel the recovery and protect your account:</p>
      <p style="text-align: center;"><a href="${cancelUrl}" class="btn btn-danger">Cancel Recovery Immediately</a></p>
    </div>
  `;
  return await sendEmail(to, subject, emailWrapper("Passkey Recovery Initiated", bodyContent));
};

export const sendPasskeyRecoveryCancelledEmail = async ({ to, name }) => {
  const subject = "Passkey Recovery Cancelled for Your BrowseMart Account";
  const bodyContent = `
    <p>Hi ${name || "there"},</p>
    <p>The pending passkey recovery request for your BrowseMart account has been successfully <strong>cancelled</strong>.</p>
    <p>Your existing passkeys remain active and secure.</p>
  `;
  return await sendEmail(to, subject, emailWrapper("Recovery Cancelled", bodyContent));
};
