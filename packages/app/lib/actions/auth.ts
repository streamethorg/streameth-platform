'use server'

import { cookies } from 'next/headers'

export async function storeSession({
  token,
  address,
}: {
  token: string
  address: string
}) {
  cookies().set('user-session', token)
  cookies().set('user-address', address)
}
