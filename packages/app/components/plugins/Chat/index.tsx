'use client'
import {
  LiveKitRoom,
  ReceivedChatMessage,
} from '@livekit/components-react'
import { ConnectionState } from '@livekit/components-react'
import { cn, formatIdentify } from '@/lib/utils/utils'
import { useChat } from '@livekit/components-react'
import {
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
  useEffect,
} from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { jwtDecode, type JwtPayload } from 'jwt-decode'
import { createViewerToken } from '@/lib/actions/livekit'
import { Card } from '@/components/ui/card'
import Logo from '@/public/logo_dark.png'
import Livepeer from '@/public/livepeer-logo.png'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccount, useEnsName } from 'wagmi'
import { ConnectWalletButton } from '@/components/misc/ConnectWalletButton'
import { IExtendedChat } from '@/lib/types'
import { createChatAction } from '@/lib/actions/chat'
import { useSIWE } from 'connectkit'
interface Props {
  participantName: string
  stageId: string
  prevChatMessages: IExtendedChat[]
}

const ChatBar = ({
  stageId,
  prevChatMessages,
}: {
  stageId: string
  prevChatMessages: IExtendedChat[]
}) => {
  const serverUrl = 'wss://streameth-fjjg03ki.livekit.cloud'
  const [viewerToken, setViewerToken] = useState('')
  const [viewerName, setViewerName] = useState('')

  const account = useAccount()
  const { data, isLoading: loadingEns } = useEnsName({
    address: account?.address,
    chainId: 1,
  })

  const fakeName = data ? data : account.address
  const slug = stageId

  useEffect(() => {
    if (!account || loadingEns) {
      return
    }
    const getOrCreateViewerToken = async () => {
      const SESSION_VIEWER_TOKEN_KEY = `${slug}-viewer-token`
      const sessionToken = sessionStorage.getItem(
        SESSION_VIEWER_TOKEN_KEY
      )

      if (sessionToken) {
        const payload: JwtPayload = jwtDecode(sessionToken)

        if (payload.exp) {
          const expiry = new Date(payload.exp * 1000)
          if (expiry < new Date()) {
            sessionStorage.removeItem(SESSION_VIEWER_TOKEN_KEY)
            const token = await createViewerToken(
              slug,
              fakeName ?? 'anonymous'
            )
            setViewerToken(token)
            const jti = jwtDecode(token)?.jti
            jti && setViewerName(jti)
            sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token)
            return
          }
        }

        if (payload.jti) {
          setViewerName(payload.jti)
        }

        setViewerToken(sessionToken)
      } else {
        const token = await createViewerToken(
          slug,
          fakeName ?? 'anonymous'
        )
        setViewerToken(token)
        const jti = jwtDecode(token)?.jti
        jti && setViewerName(jti)
        sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token)
      }
    }
    void getOrCreateViewerToken()
  }, [fakeName, slug, data, account, loadingEns])

  if (!viewerToken || !viewerName) {
    return (
      <div className="flex h-full w-full flex-1 min-h-[400px]">
        <Card className="h-full w-full ">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={viewerToken}
      serverUrl={serverUrl}
      className="flex flex-1 flex-col">
      <div className="flex h-full flex-1 min-h-[400px]">
        <Card className="sticky border-l md:block h-full w-full">
          <div className="absolute top-0 bottom-0 right-0 flex h-full w-full flex-col gap-2 p-2">
            {
              <Chat
                prevChatMessages={prevChatMessages}
                stageId={stageId}
                participantName={viewerName}
              />
            }
          </div>
        </Card>
      </div>
    </LiveKitRoom>
  )
}

export default ChatBar

function Chat({ participantName, stageId, prevChatMessages }: Props) {
  const { chatMessages: messages, send } = useChat()
  const [chatMessages, setChatMessages] = useState<
    Array<IExtendedChat | ReceivedChatMessage>
  >([])
  const reverseMessages = useMemo(
    () => chatMessages.sort((a, b) => b.timestamp - a.timestamp),
    [chatMessages]
  )

  useEffect(() => {
    // Merge prevChatMessages and reverseMessages
    const mergedMessages = [...prevChatMessages, ...messages] as (
      | IExtendedChat
      | ReceivedChatMessage
    )[]
    setChatMessages(mergedMessages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])
  const { isSignedIn } = useSIWE()
  const account = useAccount()

  const [message, setMessage] = useState('')

  const sendMessage = useCallback(async () => {
    await createChatAction({
      chat: {
        stageId,
        message,
        from: {
          identity: participantName,
        },
        timestamp: new Date().getTime(),
      },
    })
  }, [stageId, message, participantName])

  const onEnter = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (message.trim().length > 0 && send) {
          send(message).catch((err) => console.error(err))
          setMessage('')
          sendMessage()
        }
      }
    },
    [message, sendMessage, send]
  )

  const onSend = useCallback(() => {
    if (message.trim().length > 0 && send) {
      send(message).catch((err) => console.error(err))
      setMessage('')
      sendMessage()
    }
  }, [message, sendMessage, send])

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto">
        <Card className="absolute top-0 left-0 right-0 m-1 flex flex-row p-2 space-x-2 justify-center items-center">
          <Image width={150} height={50} src={Logo} alt="Logo" />
          <span>❤️</span>
          <Image
            width={100}
            height={30}
            src={Livepeer}
            alt="Livepeer"
          />
        </Card>
        {reverseMessages.map((message) => (
          <div
            key={message.timestamp}
            className="flex items-center gap-2 p-2">
            <Card className="flex flex-col  p-2">
              <div className="flex items-center  gap-2">
                <div
                  className={cn(
                    'text-xs font-semibold',
                    participantName === message.from?.identity &&
                      'text-indigo-500'
                  )}>
                  {formatIdentify(message.from?.identity)}
                  {participantName === message.from?.identity &&
                    ' (you)'}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div className="text-sm text-white">
                {message.message}
              </div>
            </Card>
          </div>
        ))}
      </div>
      {account.isConnected && isSignedIn ? (
        <div className="flex flex-col  gap-2">
          <Textarea
            value={message}
            className="min-h-[50px] w-full border-box h-1 bg-white dark:bg-zinc-900"
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            onKeyDown={onEnter}
            placeholder="Type a message..."
          />
          <Button
            disabled={message.trim().length === 0}
            onClick={onSend}>
            <div className="flex items-center gap-2">
              <p>send</p>
            </div>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col  gap-2">
          <ConnectWalletButton />
        </div>
      )}
    </>
  )
}
