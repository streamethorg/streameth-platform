'use server'

import { cookies } from 'next/headers'

const USER_CONSENT_COOKIE_KEY = 'cookie_consent'
const EXPIRE_DATE = 12 * 31 * 24 * 60 * 60 * 1000 // 1 year

export const getCookie = async (name: string) => {
  return cookies().has(name)
}

export const cookieConsent = async () => {
  cookies().set(USER_CONSENT_COOKIE_KEY, 'true')
}
