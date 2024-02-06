'use server'

import { cookies } from 'next/headers'

export async function storeSession({ token }: { token: string }) {
  cookies().set('user-session', token)
}
