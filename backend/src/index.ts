import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import tableRoutes from "./routes/table.route.js";
import orderRoutes from "./routes/order.route.js";
import menuRoutes from "./routes/menu.route.js";
import paymentRoutes from "./routes/payment.route.js";
// import adminPaymentRoutes from "./routes/adminPayment.route.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/payments", paymentRoutes);
// app.use("/api/admin", adminPaymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
