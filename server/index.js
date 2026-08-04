import express from "express";
import cors from "cors";
import morgan from "morgan";
import cloudinary from "./src/config/cloudinary.js";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import AuthRouter from "./src/routers/authRouter.js";
import PublicRouter from "./src/routers/publicRouter.js";
import UserRouter from "./src/routers/userRouter.js";
import RestaurantRouter from "./src/routers/restaurantRouter.js";
import RiderRouter from "./src/routers/riderRouter.js";
import PaymentRouter from "./src/routers/paymentRouter.js";
import AdminRouter from "./src/routers/adminRouter.js";
import { verifyRazorPayConnect } from "./src/config/razorpay.js";

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://cravings-food-app.vercel.app",
  "https://cravings-food-qtn1482js-shiva-be4e.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests like Postman/server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/auth", AuthRouter);
app.use("/public", PublicRouter);
app.use("/user", UserRouter);
app.use("/restaurant", RestaurantRouter);
app.use("/rider", RiderRouter);
app.use("/payment", PaymentRouter);
app.use("/admin", AdminRouter);


// Test Route
app.get("/", (req, res) => {
  res.send("Cravings Server is Running 🚀");
});


// Error Handler
app.use((err, req, res, next) => {
  const ErrorMessage = err.message || "Internal Server Error";
  const StatusCode = err.statusCode || 500;

  console.log("Error Found:", {
    ErrorMessage,
    StatusCode
  });

  res.status(StatusCode).json({
    message: ErrorMessage
  });
});


const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log("Server Started at Port:", port);

  await connectDB();

  try {
    const res = await cloudinary.api.ping();
    console.log("Cloudinary API is Working:", res);
  } catch (error) {
    console.error("Error Connecting Cloudinary API:", error);
  }


  // Razorpay connection check
  const rzpKey = process.env.RAZORPAY_TEST_API_KEY?.trim();
  const rzpSecret = process.env.RAZORPAY_TEST_API_SECRET?.trim();

  if (
    !rzpKey ||
    !rzpSecret ||
    rzpKey.includes("1234567890") ||
    rzpSecret.includes("1234567890")
  ) {
    console.warn(
      "⚠️ RazorPay skipped — API keys not configured"
    );
  } else {
    try {
      const res = await verifyRazorPayConnect();
      console.log("✅ RazorPay connected", res);
    } catch (error) {
      console.error(
        "❌ RazorPay Error:",
        error?.error?.description || error
      );
    }
  }
});