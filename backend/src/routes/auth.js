import express from "express";
import { Login, Logout, SignUp } from "../controller/auth.controllers.js";

const authRoutes = express.Router();

authRoutes.post("/register", SignUp);
authRoutes.post("/login", Login);
authRoutes.post("/logout", Logout);

export default authRoutes;
