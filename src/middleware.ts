import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  
  // Get the pathname of the request
  const path = req.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const publicPaths = ["/", "/signin", "/signup", "/forgot-password", "/verify-email"];
  const isPublicPath = publicPaths.some(pubPath => path === pubPath || path.startsWith(pubPath + "/"));
  
  // Admin paths that require admin role
  const adminPaths = ["/admin"];
  const isAdminPath = adminPaths.some(adminPath => path === adminPath || path.startsWith(adminPath + "/"));
  
  // Check if user is trying to access protected route without authentication
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }
  
  // Check if user is trying to access admin route without admin role
  if (isAuthenticated && isAdminPath && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  
  // Check if authenticated user is trying to access auth pages
  if (isAuthenticated && isPublicPath && path !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  
  return NextResponse.next();
}

// Configure the matcher to include all paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};