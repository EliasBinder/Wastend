import { Context } from "elysia";
import { authContext } from "../../utils/request-authenticator";
import { getInventory as getUserInventory } from "../../utils/inventory/inventory-util";
import { getIcon } from "../../utils/inventory/item-generator";

export const getInventory = async (context: Context) => {
  const user = await authContext(context);
  if (user instanceof Response) return user;

  const inventory = await getUserInventory(user.id);
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
