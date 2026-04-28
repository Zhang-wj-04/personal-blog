import { auth } from "@/lib/auth";

export default auth((req) => {
  // auth() 已处理未登录重定向
  // 已登录用户继续访问
  return undefined;
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
