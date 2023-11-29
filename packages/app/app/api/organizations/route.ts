import { NextResponse } from 'next/server'
import OrganizationController from '../../../../server/controller/organization'

export async function GET() {
  const organizationController = new OrganizationController()
  const data = await organizationController.getAllOrganizations()

  return NextResponse.json(
    data.map((org) => {
      return {
        ...org,
        link: `/organizations/${org.id}`,
      }
    })
  )
}
