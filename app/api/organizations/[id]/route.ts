import { NextResponse } from "next/server";
import OrganizationController from "@/server/controller/organization";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const organizationController = new OrganizationController();
  const id = params.id;
  try {
    const data = await organizationController.getOrganization(id);
    return NextResponse.json({ data });
  } catch (e) {
    console.log(e);
    return NextResponse.json({});
  }
}
