export const getVerificationEmailTemplate = (name, verificationCode) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #1e40af; text-align: center;">CIHE Library Account Verification</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering with the CIHE Library System. Please use the verification code below to complete your registration:</p>
        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${verificationCode}
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Regards,<br>CIHE Library Team</p>
    </div>
    `;
};

export const getDueDateReminderTemplate = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #d32f2f; text-align: center;">IMPORTANT: Books Due Tomorrow</h2>
        <p>Hello ${name},</p>
        <p>This is an important reminder that the books you had borrowed are <strong>due tomorrow</strong>:</p>
        <p><strong>Please note:</strong> Fines will be applied for any delays in returning these items as per library policy.</p>
        <div style="background-color: #fff4e5; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Fine Policy:</p>
            <p style="margin: 5px 0 0 0;">Overdue items are charged at the rate of 0.1$ per item per hour.</p>
        </div>
        <p>If you have any questions, please contact the library desk.</p>
        <p>Thank you for using the CIHE Library services.</p>
        <p>Regards,<br>CIHE Library Team</p>
    </div>
    `;
};
