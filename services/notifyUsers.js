import cron from "node-cron";
import { borrowModel } from "../models/borrowModel.js";
import { userModel } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getDueDateReminderTemplate } from "../utils/emailTemplates.js";

export const notifyUsers = () => {
  cron.schedule("*/50 * * * *", async () => {
    try {
      const oneDayAgo = new Data(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await borrowModel.find({
        dueDate: {
          $lt: oneDayAgo,
        },
        returnDate: null,
        notified: false,
      });

      for (const element of borrowers) {
        if (element.user && element.user.email) {
          const user = await userModel.findById(element.user.id);
          const htmlContent = getDueDateReminderTemplate(element.user.name);
          sendEmail({
            to: element.user.email,
            htmlContent,
          });
          element.notified = true;
          await element.save();
          console.log(`Email sent to ${element.user.email}`);
        }
      }
    } catch (error) {
      console.error("Error while notifying due date through email. ", error);
    }
  });
};
