import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { ENV } from "./config/env.js";

import childRoutes from "./routes/child.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import emotionRoutes from "./routes/emotion.routes.js";
import avatarRoutes from "./routes/avatar.routes.js";
import progressRoutes from "./routes/progress.routes.js";

import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();

// CORS
app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));

// JSON bodies
app.use(express.json({ limit: "1mb" }));

// File uploads - MUST be before routes
app.use(
  fileUpload({
    useTempFiles: false,
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
    preserveExtension: true,
  })
);

// 🔍 Debug: Log all incoming requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Mount routes
app.use("/api", childRoutes);
app.use("/api", sessionRoutes);
app.use("/api", emotionRoutes);
app.use("/api", avatarRoutes);
app.use("/api/progress", progressRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// 🔍 Debug: List all registered routes
console.log("\n🛣️  Registered Routes:");
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    // Direct routes
    const methods = Object.keys(middleware.route.methods).join(", ").toUpperCase();
    console.log(`  ${methods} ${middleware.route.path}`);
  } else if (middleware.name === "router") {
    // Router middleware
    middleware.handle.stack.forEach((handler: any) => {
      if (handler.route) {
        const methods = Object.keys(handler.route.methods).join(", ").toUpperCase();
        const path = middleware.regexp.source
          .replace("^\\", "")
          .replace("\\/?(?=\\/|$)", "")
          .replace(/\\\//g, "/");
        console.log(`  ${methods} ${path}${handler.route.path}`);
      }
    });
  }
});
console.log("");

// 404 handler - MUST be after all routes
app.use(notFound);

// Error handler - MUST be last
app.use(errorHandler);

export default app;