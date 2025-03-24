import express from "express";
import {
  CheckAuth,
  Login,
  Logout,
  SignUp,
  UpdateProfile,
} from "../controller/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", SignUp);
authRoutes.post("/login", Login);
authRoutes.post("/logout", Logout);
authRoutes.put("/update-profile", protectRoute, UpdateProfile);
authRoutes.get("/checker", protectRoute, CheckAuth);

export default authRoutes;
