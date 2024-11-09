export const InvalidCredentials = () =>
  new Response("Invalid credentials", { status: 401 });

export const UserAlreadyExists = () =>
  new Response("User already exists", { status: 409 });

export const Unauthorized = () => new Response("Unauthorized", { status: 401 });

export const ImagesNotSimilar = () =>
  new Response("Images not similar", { status: 400 });

export const FindingNotFound = () =>
  new Response("Finding not found", { status: 404 });

export const ItemNotFound = () =>
  new Response("Item not found", { status: 404 });

export const TrashNotRemoved = () =>
  new Response("Trash not removed", { status: 400 });
