import { setupConvexAuthNextjs } from "@convex-dev/auth/ssr/nextjs";
import { api } from "@/convex/_generated/api";

export const {
  convexAuthNextjsProxy,
  nextjsProxyRedirect,
  convexAuthNextjsAccessToken,
  isAuthenticatedNextjs,
  ConvexAuthNextjsServerProvider,
} = setupConvexAuthNextjs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  refreshSession: api.auth.refreshSession,
  isAuthenticated: api.auth.isAuthenticated,
});
