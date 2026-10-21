import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Called by Convex Auth the first time someone signs up. Creates the row in
// your `users` table and returns its id. Add profile fields to the table in
// `schema.ts` and set them here.
export const createUser = internalMutation({
  args: {
    provider: v.object({
      name: v.literal("password"),
      accountId: v.string(),
      profile: v.object({}),
    }),
  },
  returns: v.id("users"),
  handler: async (ctx) => {
    return await ctx.db.insert("users", {});
  },
});
