import { NextRequest, NextResponse } from "next/server"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://ridenow-pro-api.onrender.com/api/v1"

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const pathString = path.join("/")
    const url = `${BACKEND_API_URL}/${pathString}${request.nextUrl.search}`

    // Clone headers and remove host/connection to avoid mismatch and connection pool issues
    const headers = new Headers(request.headers)
    headers.delete("host")
    headers.delete("connection")

    const method = request.method
    let body: any = undefined

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      try {
        body = await request.text()
      } catch {
        // No body or error reading it
      }
    }

    const res = await fetch(url, {
      method,
      headers,
      body,
      cache: "no-store",
    })

    const resText = await res.text()

    // Forward response with the same status and a clean content-type header
    const responseHeaders = new Headers()
    const contentType = res.headers.get("content-type")
    if (contentType) {
      responseHeaders.set("content-type", contentType)
    }

    return new NextResponse(resText, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    })
  } catch (error: any) {
    console.error("Proxy handler error:", error)
    return new NextResponse(
      JSON.stringify({ success: false, message: `Proxy error: ${error.message}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const DELETE = handleProxy
export const PATCH = handleProxy
