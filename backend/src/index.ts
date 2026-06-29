import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import settingsRouter from "./routes/settings";
import statsRouter from "./routes/stats";
import timelineRouter from "./routes/timeline";
import experiencesRouter from "./routes/experiences";
import skillsRouter from "./routes/skills";
import projectsRouter from "./routes/projects";
import certificatesRouter from "./routes/certificates";
import blogRouter from "./routes/blog";
import messagesRouter from "./routes/messages";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow request from both frontends
const allowedOrigins = [
  "http://localhost:3000", // frontend_public
  "http://localhost:3001", // frontend_admin
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/settings", settingsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/timeline", timelineRouter);
app.use("/api/experiences", experiencesRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/certificates", certificatesRouter);
app.use("/api/blog", blogRouter);
app.use("/api/messages", messagesRouter);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Backend Express server running on port ${PORT}`);
  });
}

export default app;
