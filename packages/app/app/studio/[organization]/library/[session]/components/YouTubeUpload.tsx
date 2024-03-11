'use client'

import { Button } from '@/components/ui/button'
import { createStateAction } from '@/lib/actions/state'
import { IExtendedSession, type IExtendedState } from '@/lib/types'
import { apiUrl } from '@/lib/utils/utils'
import { type RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { useRouter } from 'next/navigation'
import {
  StateStatus,
  StateType,
} from 'streameth-new-server/src/interfaces/state.interface'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { fetchState } from '@/lib/services/stateService'

const YouTubeUpload = ({
  session,
  googleToken,
  videoState,
}: {
  session: IExtendedSession
  googleToken: RequestCookie | undefined
  videoState: IExtendedState | null
}) => {
  const router = useRouter()
  const [pending, setPending] = useState<StateStatus>(
    videoState?.status!
  )

  const handleUpload = async () => {
    const queryParams = new URLSearchParams()
    queryParams.append('googleToken', googleToken?.value!)

    setPending(StateStatus.pending)
    const response = await fetch(
      `${apiUrl()}/sessions/upload/${session._id.toString()}?${queryParams}`,
      {
        cache: 'no-store',
        method: 'POST',
      }
    )
    const state = await fetchState({
      type: StateType.video,
      sessionId: session._id.toString(),
    })

    if (!response.ok || state?.status) {
      setPending(StateStatus.canceled)
    }

    setPending(state?.status!)
  }

  const handleLogin = async () => {
    const response = await fetch('/api/google/oauth2', {
      cache: 'no-store',
    })
    if (!response.ok) {
      throw new Error(await response.text())
    }
    const url = await response.json()
    router.push(url)
  }

  if (videoState?.status === StateStatus.pending) {
    const intervalId = setInterval(async () => {
      const state = await fetchState({
        type: StateType.video,
        sessionId: session._id.toString(),
      })

      if (state?.status !== StateStatus.pending) {
        setPending(state?.status!)
        clearInterval(intervalId)
      }
    }, 1000 * 10) // 10 seconds
  }

  if (!googleToken) {
    return (
      <Button className="w-full my-3" onClick={handleLogin}>
        Login with your Google Account
      </Button>
    )
  }

  if (pending === StateStatus.pending) {
    return (
      <Button className="w-full my-3" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Uploading video... Please wait
      </Button>
    )
  }

  if (pending === StateStatus.canceled) {
    return (
      <Button className="w-full my-3" variant="destructive" disabled>
        Something went wrong while uploading a video...
      </Button>
    )
  }

  if (pending === StateStatus.completed) {
    return (
      <Button className="w-full my-3" disabled>
        Video is uploaded to YouTube
      </Button>
    )
  }

  return (
    <Button className="w-full my-3" onClick={handleUpload}>
      Upload to YouTube
    </Button>
  )
}

export default YouTubeUpload
