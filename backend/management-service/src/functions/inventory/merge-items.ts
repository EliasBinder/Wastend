import { Context, t, Static } from "elysia";
import { authContext } from "../../utils/request-authenticator";
import {
  addItemToInventory,
  getInventory,
  inventoryHasItem,
  removeItemFromInventory,
} from "../../utils/inventory/inventory-util";
import { ItemNotFound } from "../../utils/errors";
import { generateItem, getIcon } from "../../utils/inventory/item-generator";

export const mergeItemsBody = {
  type: "json",
  body: t.Object({
    item1: t.String(),
    item2: t.String(),
  }),
};

export const mergeItems = async (context: Context) => {
  const user = await authContext(context);
  if (user instanceof Response) return user;

  const { item1, item2 } = context.body as Static<typeof mergeItemsBody.body>;

  let hasItem1 = false;
  let hasItem2 = false;
  if (item1 != item2) {
    hasItem1 = await inventoryHasItem(user.id, item1);
    hasItem2 = await inventoryHasItem(user.id, item2);
  } else {
    // Deprecated
    // hasItem1 = hasItem2 = await inventoryHasItem(user.id, item1, 2);
  }

  if (!hasItem1 || !hasItem2) return ItemNotFound();

  await removeItemFromInventory(user.id, item1);
  await removeItemFromInventory(user.id, item2);

  const new_item = await generateItem(item1, item2);

  await addItemToInventory(user.id, new_item);

  const inventory = await getInventory(user.id);
  inventory.save();

  const mappedItems = [];

  for (const item of inventory.items) {
    const icon = await getIcon(item.name);
    mappedItems.push({
      name: item.name,
      quantity: item.quantity,
      icon,
    });
  }

  return {
    items: mappedItems,
  };
};
