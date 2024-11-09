import { Context, t, Static } from "elysia";
import { authContext } from "../../utils/request-authenticator";
import { Finding } from "../../lucia/model";
import { mapFinding } from "../../utils/mappers/finding-mapper";

export const getFindings = async (
  context: Context<{
    query: {
      scope?: "private" | "public";
      resolved?: boolean;
    };
  }>,
) => {
  const user = await authContext(context as any);
  if (user instanceof Response) return user;

  const { scope, resolved } = context.query;

  if (scope == "public" && resolved == true)
    return new Response("Public findings cannot be resolved", { status: 400 });

  const findings = await Finding.find({
    ...(scope == "private" ? { user_id: user.id } : {}),
    ...(resolved != undefined ? { resolved } : {}),
  });

  return new Response(JSON.stringify(findings.map(mapFinding)), {
    headers: {
      "content-type": "application/json",
    },
  });
};
