import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "../config/db.js";
import authRoutes from "../routes/auth.js";
import adminRoutes from "../routes/admin.js";
import userRoutes from "../routes/user.js";
import ownerRoutes from "../routes/owner.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
console.log("DB_USER:", process.env.DB_USER, "DB_NAME:", process.env.DB_NAME);

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/owner", ownerRoutes);
app.use("/", userRoutes);

const PORT = process.env.PORT || 5000;

console.log("Registered routes:");
app._router?.stack?.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path, Object.keys(middleware.route.methods));
  } else if (middleware.name === "router") {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(handler.route.path, Object.keys(handler.route.methods));
      }
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
