import { NextRequest, NextResponse } from 'next/server'
import OrganizationController from '@/server/controller/organization'
import { AddOrUpdateFile } from '@/server/utils/github'
import Session from '@/utils/session'

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

export async function POST(request: NextRequest) {
  const organizationController = new OrganizationController()
  try {
    const session = await Session.fromRequest(request)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    if (!body.organizationId) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    // Create event in the fs
    const data = await organizationController.createOrganization(await request.json())

    // Write data to db
    const folderName = `data/organizations`
    const fileName = `${body.name.replace(/ /g, '_').toLowerCase()}.json`
    await AddOrUpdateFile(fileName, JSON.stringify(body), folderName)

    return NextResponse.json(data)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 })
  }
}
