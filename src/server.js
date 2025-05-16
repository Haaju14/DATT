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
app.use(AuthRoute);
app.use(cartRoute);
app.use(CategoryRoute);
app.use(NotificationRoute);
app.use(OrderRoute);
app.use(productRoute);
app.use(PromotionRoute);
app.use(ReviewRoute);
app.use(UserRoute);
app.use(WishlistRoute);
app.use(LoyaltyRoute);
app.use(StatisticsRoute);
app.use(HookRoute);
app.use(VoucherRoute);
