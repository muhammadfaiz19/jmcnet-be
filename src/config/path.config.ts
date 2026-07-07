import path from "path";
import { env } from "./env";

export const UPLOADS_PATH = path.isAbsolute(env.UPLOADS_PATH)
  ? env.UPLOADS_PATH
  : path.join(process.cwd(), env.UPLOADS_PATH);
