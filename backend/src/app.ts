import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import childRoutes from "./routes/child.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import emotionRoutes from "./routes/emotion.routes.js";
import avatarRoutes from "./routes/avatar.routes.js";
import progressRoutes from "./routes/progress.routes.js"; // ✅ ADD THIS LINE
import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();

app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));

// ✅ Mount all API routes under /api
app.use("/api", childRoutes);
app.use("/api", sessionRoutes);
app.use("/api", emotionRoutes);
app.use("/api", avatarRoutes);
app.use("/api/progress", progressRoutes); 

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

export default app;
