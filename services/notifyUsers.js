import cron from "node-cron";
import { borrowModel } from "../models/borrowModel.js";
import { userModel } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getDueDateReminderTemplate } from "../utils/emailTemplates.js";

export const notifyUsers = () => {
  // "0 */2 * * *" means "at minute 0 of every 2nd hour"
  // This will run at: 12:00, 2:00, 4:00, 6:00, etc.
  cron.schedule("0 */2 * * *", async () => {
    try {
      console.log(
        `Running overdue book check at ${new Date().toLocaleString()}`
      );

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await borrowModel.find({
        dueDate: {
          $lt: oneDayAgo,
        },
        returnDate: null,
        notified: false,
      });

      console.log(`Found ${borrowers.length} overdue books to notify about`);

      for (const element of borrowers) {
        if (element.user) {
          const userId = element.user._id || element.user.id;

          if (userId) {
            const user = await userModel.findById(userId);

            if (user && user.email) {
              const htmlContent = getDueDateReminderTemplate(user.name);
              const subject = "Library Book Return Reminder";

              console.log(`Sending email to: ${user.email}`);

              const emailSent = await sendEmail(
                user.email, // to
                subject, // subject
                htmlContent // htmlContent
              );

              if (emailSent) {
                element.notified = true;
                await element.save();
                console.log(
                  `Email notification marked as sent for ${user.email}`
                );
              } else {
                console.log(`Failed to send email to ${user.email}`);
              }
            } else {
              console.log(`User with ID ${userId} not found or has no email`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error while notifying due date through email: ", error);
    }
  });

  console.log("Email notification scheduler started - will run every 2 hours");
};
