'use server'

import { cookies } from 'next/headers'

const EXPIRE_DATE_YEAR = 12 * 31 * 24 * 60 * 60 * 1000 // 1 year

export const hasCookie = async (name: string) => {
  return cookies().has(name)
}

export const getCookie = async (name: string) => {
  return cookies().get(name)
}

/**
 *
 * Cookie will always be set to "Secure"
 *
 * @expires The amount of seconds until the cookie should expire
 */
export const setCookie = async (
  cookieName: string,
  cookieValue: string,
  expires: number = EXPIRE_DATE_YEAR
) => {
  cookies().set(cookieName, cookieValue, {
    secure: true,
    expires: Date.now() + expires,
  })
}
