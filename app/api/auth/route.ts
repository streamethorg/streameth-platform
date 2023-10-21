import Session, { WHITELISTED_ADDRESSES, tap } from '@/utils/session'
import { NextRequest, NextResponse } from 'next/server'
import { SiweErrorType, SiweMessage, generateNonce } from 'siwe'

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const session = await Session.fromRequest(req)
  if (!session) {
    return NextResponse.json(new Session().toJSON())
  }

  return NextResponse.json(session.toJSON())
}

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  let session = await Session.fromRequest(req)
  if (!session) {
    session = new Session()
  }

  if (!session?.nonce) session.nonce = generateNonce()

  return tap(new NextResponse(session.nonce), (res) => session!.persist(res))
}

export const POST = async (req: NextRequest) => {
  const { message, signature } = await req.json()
  let session = await Session.fromRequest(req)

  if (!session) {
    session = new Session()
  }

  try {
    const siweMessage = new SiweMessage(message)
    const { data: fields } = await siweMessage.verify({
      signature,
      nonce: session.nonce,
    })

    // Check for whitelisted addresses on the admin panel
    if (!WHITELISTED_ADDRESSES.includes(fields.address)) {
      return tap(new NextResponse('Invalid address.', { status: 422 }), (res) => session!.clear(res))
    }

    if (fields.nonce !== session.nonce) {
      return tap(new NextResponse('Invalid nonce.', { status: 422 }), (res) => session!.clear(res))
    }

    session.address = fields.address
    session.chainId = fields.chainId
  } catch (error) {
    switch (error) {
      case SiweErrorType.INVALID_NONCE:
      case SiweErrorType.INVALID_SIGNATURE:
        return tap(new NextResponse(String(error), { status: 422 }), (res) => session!.clear(res))

      default:
        return tap(new NextResponse(String(error), { status: 400 }), (res) => session!.clear(res))
    }
  }

  return tap(new NextResponse(''), (res) => session!.persist(res))
}

export const DELETE = async (req: NextRequest) => {
  const session = await Session.fromRequest(req)
  if (!session) {
    return NextResponse
  }

  return tap(new NextResponse(''), (res) => session!.clear(res))
}
