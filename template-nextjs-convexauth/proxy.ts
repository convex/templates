import { convexAuthNextjsProxy, nextjsProxyRedirect } from "@/lib/convexAuth";

const signInPages = ["/signin"];
const protectedPages = ["/", "/server"];

export default convexAuthNextjsProxy(async (request, { isAuthenticated }) => {
  const { pathname } = request.nextUrl;
  if (signInPages.includes(pathname) && (await isAuthenticated())) {
    return nextjsProxyRedirect(request, "/");
  }
  if (protectedPages.includes(pathname) && !(await isAuthenticated())) {
    return nextjsProxyRedirect(request, "/signin");
  }
});

export const config = {
  // Run on all routes except static assets and the `/auth` route handlers,
  // which set their own cookies.
  matcher: ["/((?!auth(?:/|$)|.*\\..*|_next).*)", "/"],
};
