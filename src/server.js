import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoute from "./routes/ProductRoute.js";
import cartRoute from "./routes/CartRoute.js";
import errorHandler from "./middleware/errorHandler.js";
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import OrderRoute from "./routes/OrderRoute.js";
import ReviewRoute from "./routes/ReviewRoute.js";
import NotificationRoute from "./routes/NotificationRoute.js";
import WishlistRoute from "./routes/WishlistRoute.js";
import PromotionRoute from "./routes/PromotionRoute.js";
import LoyaltyRoute from "./routes/LoyaltyRoute.js";
import StatisticsRoute from "./routes/StatisticsRoute.js";
import sequelize from "../src/config/db.js";
import initModels from "../src/models/init-models.js";
import HookRoute from "./routes/HookRoute.js";
import VoucherRoute from "./routes/VoucherRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());

// Khởi tạo models
const models = initModels(sequelize);
const { Products } = models;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://192.168.100.134:5173", "http://tmdt2.cholimexfood.com.vn"],
    credentials: true,
  },
});
const allowedOrigins = [
  "http://192.168.100.134:5173",
  "http://tmdt2.cholimexfood.com.vn",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(8080, () => {
  console.log("Server running on port 8080 with WebSocket");
});

app.use(express.json());
app.use(errorHandler);

//routes
app.use("/api/auth", AuthRoute);
app.use("/api/cart", cartRoute);
app.use("/api/categories", CategoryRoute);
app.use("/api/notifications", NotificationRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/products", productRoute);
app.use("/api/promotions", PromotionRoute);
app.use("/api/reviews", ReviewRoute);
app.use("/api/users", UserRoute);
app.use("/api/wishlist", WishlistRoute);
app.use("/api/loyalty", LoyaltyRoute);
app.use("/api/statistics", StatisticsRoute);
app.use("/api/hooks", HookRoute);
app.use("/api/vouchers", VoucherRoute);
