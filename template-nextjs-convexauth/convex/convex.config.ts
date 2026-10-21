import { defineApp } from "convex/server";
import { v } from "convex/values";
import auth from "@convex-dev/auth/convex.config.js";
import password from "@convex-dev/auth/components/password/convex.config.js";
import username from "@convex-dev/auth/components/username/convex.config.js";

// `npx @convex-dev/auth` (run by `setup.mjs` on the first `npm run dev`)
// generates the key pair and sets these on your deployment.
const app = defineApp({
  env: {
    AUTH_PRIVATE_KEY: v.string(),
    AUTH_JWKS: v.string(),
  },
});

app.use(auth, {
  httpPrefix: "/auth",
  env: {
    AUTH_PRIVATE_KEY: app.env.AUTH_PRIVATE_KEY,
    AUTH_JWKS: app.env.AUTH_JWKS,
  },
});
app.use(password);
app.use(username);

export default app;
