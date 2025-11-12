import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

async function start() {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Emobuddy API running on http://localhost:${ENV.PORT}`);
  });
}

start();
