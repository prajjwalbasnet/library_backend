import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { connectCloudinary } from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import bookRouter from "./routes/bookRoute.js";
import { borrowRouter } from "./routes/borrowRoute.js";
import { adminRouter } from "./routes/adminRouter.js";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccount.js";
import { reservationRouter } from "./routes/reservationRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

notifyUsers();
removeUnverifiedAccounts();
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", (req, res) => {
  res.send("API Working");
});

// api endpopints
app.use("/api/user", userRouter);
app.use("/api/book", bookRouter);
app.use("/api/borrow", borrowRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reservation", reservationRouter);

app.listen(port, () => {
  console.log(`server started on ${port}.`);
});
