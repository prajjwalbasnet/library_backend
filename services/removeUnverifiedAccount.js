import cron from "node-cron";
import { userModel } from "../models/userModel.js";

export const removeUnverifiedAccounts = () => {
  cron.schedule("*/5 * * * *", async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    await userModel.deleteMany({
      isActive: false,
      createdAt: { $lt: thirtyMinutesAgo },
    });
  });
};
