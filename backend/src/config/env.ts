import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 8080,
  MONGODB_URI: process.env.MONGODB_URI || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*"
};

if (!ENV.MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}
