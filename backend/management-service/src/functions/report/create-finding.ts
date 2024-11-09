import { Context, t, Static } from "elysia";
import { authContext } from "../../utils/request-authenticator";
import { Finding } from "../../lucia/model";
import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

export const createFindingBody = {
  type: "formdata",
  body: t.Object({
    image: t.File(),
    longitude: t.String(),
    latitude: t.String(),
  }),
};

export const createFinding = async (context: Context) => {
  const user = await authContext(context);
  if (user instanceof Response) return user;

  const { image, longitude, latitude } = context.body as Static<
    typeof createFindingBody.body
  >;

  // Store image to file system
  const imageId = uuid();
  const imageStream = await image.arrayBuffer();
  Bun.write(`./../images/${imageId}.jpeg`, imageStream);

  const longitudeNum = parseFloat(longitude);
  const latitudeNum = parseFloat(latitude);

  const finding = new Finding({
    _id: new mongoose.Types.ObjectId(),
    user_id: user.id,
    image: imageId,
    longitude: longitudeNum,
    latitude: latitudeNum,
    resolved: false,
    created_at: new Date(),
    updated_at: new Date(),
  });

  await finding.save();

  return {
    id: finding._id,
  };
};
