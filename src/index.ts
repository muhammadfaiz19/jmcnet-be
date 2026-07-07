import app from "./server";
import { env } from "./config/env";

const port = env.PORT;

app.listen(port, () => {
  console.log(`🚀 Server is running on: ${env.BASE_URL}`);
  console.log(`📂 Static files served from: ${env.UPLOADS_PATH}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
});
