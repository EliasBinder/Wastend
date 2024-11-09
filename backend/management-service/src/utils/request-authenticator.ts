import { Context } from "elysia";
import { Unauthorized } from "./errors";
import { auth } from "../lucia/lucia";

export const authContext = async (context: Context) => {
  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader) return Unauthorized();

  // Get sessionid
  const sessionId = authHeader.split(" ")[1];
  if (!sessionId) return Unauthorized();

  // Validate session
  const { user, session } = await auth.validateSession(sessionId);
  if (!user) return Unauthorized();

  return user;
};
