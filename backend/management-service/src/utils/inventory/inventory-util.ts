import mongoose from "mongoose";
import { Inventory } from "../../lucia/model";

export const getInventory = async (userId: string) => {
  const inventory = await Inventory.findOne({
    user_id: userId,
  });

  if (inventory) return inventory;

  const newInventory = new Inventory({
    _id: new mongoose.Types.ObjectId(),
    user_id: userId,
    items: [],
  });

  return newInventory;
};

export const addItemToInventory = async (userId: string, item: string) => {
  const inventory = await getInventory(userId);

  // Check if item already exists in inventory
  if (inventory.items.filter((i) => i.name === item).length > 0) {
    // Increment quantity of item in inventory(documentarray)
    Inventory.findOneAndUpdate(
      { user_id: userId, "items.name": item },
      { $inc: { "items.$.quantity": 1 } },
    );
  } else {
    inventory.items.push({ name: item, quantity: 1 });
  }

  await inventory.save();
};

export const removeItemFromInventory = async (userId: string, item: string) => {
  const inventory = await getInventory(userId);

  await Inventory.findOneAndUpdate(
    { user_id: userId, "items.name": item },
    { $inc: { "items.$.quantity": -1 } },
  );

  await Inventory.findOneAndUpdate(
    { user_id: userId, "items.name": item, "items.quantity": 0 },
    { $pull: { items: { name: item } } },
  );

  await inventory.save();
};

export const inventoryHasItem = async (userId: string, item: string) => {
  const inventory = await getInventory(userId);

  return inventory.items.filter((i) => i.name === item).length > 0;
};
