import { Context, t, Static } from "elysia";
import { User } from "../../lucia/model";
import { InvalidCredentials } from "../../utils/errors";
import { auth } from "../../lucia/lucia";

export const loginBody = {
  type: "json",
  body: t.Object({
    email: t.String(),
    password: t.String(),
  }),
};

export const login = async (context: Context) => {
  const body = context.body as Static<typeof loginBody.body>;

  const { email, password } = body;

  const user = await User.findOne({ email }).exec();
  if (!user) return InvalidCredentials();

  const passwordMatches = await Bun.password.verify(
    password,
    user.hashed_password,
  );
  if (!passwordMatches) return InvalidCredentials();

  console.info(`User ${user.email} logged in`);

  const session = await auth.createSession(user._id, {});

  // Set cookie
  const sessionCookieHeader = auth.createSessionCookie(session.id);
  context.set.headers["Set-Cookie"] = sessionCookieHeader.serialize();

  // Return user data
  return {
    sessionId: session.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
  };
};
