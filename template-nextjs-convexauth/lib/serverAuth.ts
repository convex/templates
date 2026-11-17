import { setupConvexAuthServer } from "@convex-dev/auth/ssr";
import { api } from "@/convex/_generated/api";

// Creates the route handlers under `app/auth/`. These handlers sign users in,
// refresh sessions and sign users out on the Next.js server. The server keeps
// the refresh token in an httpOnly cookie, so client JavaScript never sees it.
export const auth = setupConvexAuthServer({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  refreshSession: api.auth.refreshSession,
  signOut: api.auth.signOut,
  // The sign-in route rejects any function not listed here.
  signIn: [
    api.auth.signInWithUsernamePassword,
    api.auth.signUpWithUsernamePassword,
  ],
  cookieOptions: { secure: process.env.NODE_ENV === "production" },
});
