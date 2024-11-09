import { Context } from "elysia";
import { authContext } from "../../utils/request-authenticator";
import { Event } from "../../lucia/model";

export const getEvents = async (context: Context) => {
  const user = await authContext(context);
  if (user instanceof Response) return user;

  const events = await Event.find();

  return events;
};
