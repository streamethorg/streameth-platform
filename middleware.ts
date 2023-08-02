import { NextRequest, NextResponse } from "next/server";
import EventController from "./server/controller/event";
import OrganizationController from "./server/controller/organization";
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * And the ones ending with:
     * - .png (image file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico)(?!.*\\.png$).*)",
  ],
};

export function middleware(request: NextRequest) {
  console.log("path ", request.url.split("/"));
  let org;
  let event;
  const eventController = new EventController();
  const organizationController = new OrganizationController();
  try {
    org = request.url.split("/")[4];
    event = request.url.split("/")[5];
    console.log(organizationController.getOrganization(org));
  } catch (e) {
    console.log(e);
  }

  // return NextResponse.redirect(new URL('/home', request.url))
}
