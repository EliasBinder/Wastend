import { Context, t, Static } from "elysia";
import { authContext } from "../../utils/request-authenticator";
import {
  FindingNotFound,
  ImagesNotSimilar,
  TrashNotRemoved,
} from "../../utils/errors";
import { Finding, Resolve } from "../../lucia/model";
import mongoose from "mongoose";
import { addItemToInventory } from "../../utils/inventory/inventory-util";

export const createResolveBody = {
  type: "formdata",
  body: t.Object({
    imageTrash: t.File(),
    imageNoTrash: t.File(),
    longitude: t.String(),
    latitude: t.String(),
    findingId: t.Optional(t.String()),
  }),
};

export const createResolve = async (context: Context) => {
  const user = await authContext(context as any);
  if (user instanceof Response) return user;

  const body = context.body as Static<typeof createResolveBody.body>;
  const longitudeNum = parseFloat(body.longitude);
  const latitudeNum = parseFloat(body.latitude);

  // Similarity check for images
  const similarityFormData = new FormData();
  similarityFormData.append("trash", body.imageTrash);
  similarityFormData.append("no_trash", body.imageNoTrash);
  const similarityResult = await fetch(process.env.SIMILARITY_URL!, {
    method: "POST",
    body: similarityFormData,
  }).then((res) => res.json());
  if (similarityResult.result != "True") return ImagesNotSimilar();

  // Object detection for both images
  const primaryObjectFormData = new FormData();
  primaryObjectFormData.append("file", body.imageTrash);
  const primaryObjectResult = await fetch(process.env.OBJECT_DETECTION_URL!, {
    method: "POST",
    body: primaryObjectFormData,
  }).then((res) => res.json());
  const trashItem = primaryObjectResult.item;

  const secondaryObjectFormData = new FormData();
  secondaryObjectFormData.append("file", body.imageNoTrash);
  const secondaryObjectResult = await fetch(process.env.OBJECT_DETECTION_URL!, {
    method: "POST",
    body: secondaryObjectFormData,
  }).then((res) => res.json());
  const noTrashItem = secondaryObjectResult.item;

  if (trashItem == noTrashItem) return TrashNotRemoved();

  // Mark finding as resolved if necessary
  if (body.findingId) {
    const finding = await Finding.findOne({
      _id: body.findingId,
      resolved: false,
    });
    if (!finding) return FindingNotFound();
    finding.resolved = true;
    await finding.save();
  }

  // Create database entry
  const resolve = new Resolve({
    _id: new mongoose.Types.ObjectId(),
    user_id: user.id,
    ...(body.findingId ? { finding_id: body.findingId } : {}),
    longitude: longitudeNum,
    latitude: latitudeNum,
    item: trashItem,
    created_at: new Date(),
    updated_at: new Date(),
  });
  await resolve.save();

  // Add item to inventory
  addItemToInventory(user.id, trashItem);

  return {
    id: resolve._id,
  };
};
