import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    // Store current request URL in custom header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", request.nextUrl.pathname);

    return NextResponse.next({
        request: {
            // Apply new request headers
            headers: requestHeaders,
        }
    })
}