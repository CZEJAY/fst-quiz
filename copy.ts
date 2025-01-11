import { auth as middleware } from "@/auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

export default middleware(async (req, ctx) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isApiRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // if (!isLoggedIn && !isPublicRoute) {
  //   let callbackUrl = nextUrl.pathname;
  //   if (nextUrl.search) {
  //     callbackUrl += nextUrl.search;
  //   }
  //   const encodedCallbackUrl = encodeURIComponent(callbackUrl);

  //   return Response.redirect(new URL(`/auth/signin`, nextUrl));
  // }

  return new Response(null, { status: 204 });
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
