import { NextResponse } from 'next/server'
import OrganizationController from '@/server/controller/organization'

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

export async function POST(request: Request) {
  const organizationController = new OrganizationController()
  try {
    const data = await organizationController.createOrganization(
      await request.json()
    )
    return NextResponse.json(data)
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: 'Malformed request' },
      { status: 400 }
    )
  }
}
