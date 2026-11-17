import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is optional, but it gives more precise TypeScript types.
export default defineSchema({
  users: defineTable({}),
  numbers: defineTable({
    value: v.number(),
  }),
});
