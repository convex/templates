import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({}),
  numbers: defineTable({
    value: v.number(),
  }),
});
