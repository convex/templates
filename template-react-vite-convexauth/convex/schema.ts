import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires a `users` table to create a row for each account.
// The schema provides more precise TypeScript types.
export default defineSchema({
  users: defineTable({}),
  numbers: defineTable({
    value: v.number(),
  }),
});
