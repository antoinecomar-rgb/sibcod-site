import { createHash } from "crypto";
export function jeton() {
  const mdp = process.env.STUDIO_PASSWORD || "";
  return createHash("sha256").update("sibcod-studio:" + mdp).digest("hex");
}
