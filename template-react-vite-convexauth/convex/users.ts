import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Creates a `users` row for a new account and returns its id. Convex Auth
// calls this when someone signs up. To store profile fields, add them to the
// `users` table in `schema.ts` and set them here.
export const createUser = internalMutation({
  args: {
    method: v.object({
      name: v.literal("usernamePassword"),
      profile: v.object({}),
    }),
  },
  returns: v.id("users"),
  handler: async (ctx) => {
    return await ctx.db.insert("users", {});
  },
});
