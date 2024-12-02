import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  // Extract the token from the request
  const token = req.headers.get("Authorization")?.split(" ")[1]; // Expected format: "Bearer <token>"

  // URL path
  const path = req.nextUrl.pathname;

  // Check if the path needs protection (e.g., /admin)
  const isAdminRoute = path.startsWith("/admin");

  if (!token) {
    // If no token, deny access
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);

    if (isAdminRoute && decoded.role !== "admin") {
      // If user is not an admin, deny access to admin routes
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Attach user info to the request if needed
    req.user = decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"], // Protect these routes
};
