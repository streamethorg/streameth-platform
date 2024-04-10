'use client'

import React, { useState, useEffect } from 'react'
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  setCookie as setNextCookie,
  hasCookie,
} from '@/lib/actions/cookieConsent'

const CookieBanner = () => {
  const [cookie, setCookie] = useState<boolean>(true)
  const [shouldFadeOut, setShouldFadeOut] = useState(false)
  const [isFadingIn, setIsFadingIn] = useState(true)

  useEffect(() => {
    const checkCookieConsent = async () => {
      const cookieValue = await hasCookie('cookie_consent')
      setCookie(cookieValue)
    }

    checkCookieConsent()

    const fadeTimer = setTimeout(() => {
      setIsFadingIn(false)
    }, 800)

    return () => clearTimeout(fadeTimer)
  }, [])

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    await setNextCookie('cookie_consent', 'true')
    setShouldFadeOut(true)

    setTimeout(() => {
      setCookie(true)
    }, 800)
  }

  if (cookie) return null

  return null
  return (
    <Alert
      className={`lg:w-[35%] w-full transition-opacity duration-800 ${
        isFadingIn ? 'opacity-0' : 'opacity-100'
      } ${shouldFadeOut ? 'opacity-0' : ''}`}>
      <AlertTitle>We Use Cookies 🍪</AlertTitle>
      <AlertDescription>
        Your privacy is paramount to us. As a &quot;Privacy by
        Default&quot; platform, we only save essential cookies to
        enhance your experience without compromising your data.
      </AlertDescription>
      <div className="mt-3">
        <Button onClick={handleClick} className="mr-1">
          Ok
        </Button>
        <Link href={'/privacy'}>
          <Button>More information...</Button>
        </Link>
      </div>
    </Alert>
  )
}

export default CookieBanner
