import { setupConvexAuthServer } from "@convex-dev/auth/ssr";
import { api } from "@/convex/_generated/api";

// The handlers mounted under `app/auth/`. Signing in, refreshing and signing
// out run on the Next.js server, which keeps the refresh token in an
// httpOnly cookie so it never reaches client JavaScript.
export const auth = setupConvexAuthServer({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  refreshSession: api.auth.refreshSession,
  signOut: api.auth.signOut,
  // Every function that signs a user in must be listed here. The sign-in route
  // refuses anything else.
  signIn: [
    api.auth.signInWithUsernamePassword,
    api.auth.signUpWithUsernamePassword,
  ],
  cookieOptions: { secure: process.env.NODE_ENV === "production" },
});
