import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import mongoose from "mongoose";

export const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      _id: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      first_name: String,
      last_name: String,
      hashed_password: {
        type: String,
        required: true,
      },
    } as const,
    {
      _id: false,
      collection: "users",
    },
  ),
);

export const Session = mongoose.model(
  "Session",
  new mongoose.Schema(
    {
      _id: {
        type: String,
        required: true,
      },
      user_id: {
        type: String,
        required: true,
      },
      expires_at: {
        type: Date,
        required: true,
      },
    } as const,
    {
      _id: false,
      collection: "sessions",
    },
  ),
);

export const Finding = mongoose.model(
  "Finding",
  new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    resolved: {
      type: Boolean,
      required: false,
    },
    created_at: {
      type: Date,
      required: true,
    },
    updated_at: {
      type: Date,
      required: true,
    },
  }),
);

export const Resolve = mongoose.model(
  "Resolve",
  new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    finding_id: {
      type: String,
      required: false,
    },
    user_id: {
      type: String,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
    },
    updated_at: {
      type: Date,
      required: true,
    },
  }),
);

export const Inventory = mongoose.model(
  "Inventory",
  new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    items: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
  }),
);

export const Recipe = mongoose.model(
  "Recipe",
  new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    item1: {
      type: String,
      required: true,
    },
    item2: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
  }),
);

export const Icon = mongoose.model(
  "Icon",
  new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  }),
);

export const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  }),
);

export const luciaAdapter = new MongodbAdapter(
  mongoose.connection.collection("sessions") as any,
  mongoose.connection.collection("users") as any,
);
