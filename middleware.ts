import { createServerSupabase } from "./lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const supabase = createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect only admin pages
  if (req.nextUrl.pathname.startsWith("/admin") && (!user || !user.user_metadata?.is_admin)) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Do NOT redirect regular pages here, let page handle session
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"], // Only protect admin paths
}
