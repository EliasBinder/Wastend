import { Context } from "elysia";
import { authContext } from "../../utils/request-authenticator";
import { Resolve } from "../../lucia/model";
import { mapResolve } from "../../utils/mappers/resolve-mapper";

export const getResolves = async (context: Context) => {
  const user = await authContext(context as any);
  if (user instanceof Response) return user;

  const resolves = await Resolve.find({ user_id: user.id });

  return resolves.map(mapResolve);
};
