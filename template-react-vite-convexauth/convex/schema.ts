import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is optional, but it gives more precise TypeScript types.
export default defineSchema({
  // `users.ts` creates a row here for each new account. Convex Auth stores
  // only the row's id, so you choose the fields.
  users: defineTable({}),
  numbers: defineTable({
    value: v.number(),
  }),
});
