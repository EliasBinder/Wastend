import { Elysia } from "elysia";
import { login, loginBody } from "./functions/auth/login";
import { connect } from "./lucia/lucia";
import { register, registerBody } from "./functions/auth/register";
import {
  createFinding,
  createFindingBody,
} from "./functions/report/create-finding";
import { cors } from "@elysiajs/cors";
import { getFindings } from "./functions/report/get-findings";
import {
  createResolve,
  createResolveBody,
} from "./functions/report/create-resolve";
import { getResolves } from "./functions/report/get-resolves";
import { getImage } from "./functions/report/findings/get-image";
import { getInventory } from "./functions/inventory/get-inventory";
import { mergeItems, mergeItemsBody } from "./functions/inventory/merge-items";
import { getEvents } from "./functions/events/get-events";

connect();

const app = new Elysia()
  .state("version", "barly usable")
  .use(
    cors({
      origin: "*",
    }),
  )
  .get("/", () => "Management service available")
  .group("/auth", (auth) =>
    auth
      .post("/login", login, loginBody)
      .post("/register", register, registerBody),
  )
  .group("/report", (report) =>
    report
      .get("/findings", getFindings)
      .post("/findings", createFinding, createFindingBody)
      .get("/findings/:id/image", getImage)
      .get("/resolves", getResolves)
      .post("/resolves", createResolve, createResolveBody),
  )
  .group("/inventory", (inventory) =>
    inventory
      .get("/items", getInventory)
      .post("/merge", mergeItems, mergeItemsBody),
  )
  .get("/events", getEvents)
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Management Service is running at ${app.server?.hostname}:${app.server?.port}`,
);
