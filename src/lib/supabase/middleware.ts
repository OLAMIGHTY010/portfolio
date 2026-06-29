import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not remove this. It refreshes the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      // TEMPORARY PREVIEW BYPASS: Normally this redirects to /login
      // const url = request.nextUrl.clone();
      // url.pathname = "/login";
      // url.searchParams.set("redirectTo", request.nextUrl.pathname);
      // return NextResponse.redirect(url);
      console.log("Preview bypass: allowing access to admin without session");
    }

    // Check if user is admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user && user.email !== adminEmail) {
      // TEMPORARY PREVIEW BYPASS
      // const url = request.nextUrl.clone();
      // url.pathname = "/";
      // return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
