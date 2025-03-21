import express from "express";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
