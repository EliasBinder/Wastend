import { Context } from "elysia";
import { authContext } from "../../../utils/request-authenticator";
import { Finding } from "../../../lucia/model";
import { FindingNotFound } from "../../../utils/errors";

export const getImage = async (
  context: Context<{ params: { id: string } }>,
) => {
  const findingId = context.params.id;

  const finding = await Finding.findOne({
    _id: findingId,
  });

  if (!finding) return FindingNotFound();

  const imageId = finding.image;

  return Bun.file("./../images/" + imageId + ".jpeg");
};
