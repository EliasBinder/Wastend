import { Context, Static, t } from "elysia";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { User } from "../../lucia/model";
import { UserAlreadyExists } from "../../utils/errors";
import { auth } from "../../lucia/lucia";

export const registerBody = {
  type: "json",
  body: t.Object({
    firstName: t.String(),
    lastName: t.String(),
    email: t.String(),
    password: t.String(),
  }),
};

export const register = async (context: Context) => {
  const body = context.body as Static<typeof registerBody.body>;

  //TODO: Check body

  // Check if user already exists
  const _user = await User.findOne({ email: body.email }).exec();
  if (_user) return UserAlreadyExists();

  // Process
  const hashedPassword = await Bun.password.hash(body.password);
  const userId = generateId(20);

  const user = new User({
    _id: userId,
    email: body.email.toLowerCase(),
    first_name: body.firstName,
    last_name: body.lastName,
    hashed_password: hashedPassword,
  });
  await user.save();

  const session = await auth.createSession(userId, {});

  // Set cookie
  const sessionCookieHeader = auth.createSessionCookie(session.id);
  context.set.headers["Set-Cookie"] = sessionCookieHeader.serialize();

  //TODO: Send verification email

  console.info(`User ${user.email} registered`);

  return {
    sessionId: session.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
  };
};
