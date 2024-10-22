'use client';
import { LiveKitRoom, ReceivedChatMessage } from '@livekit/components-react';
import { cn, formatIdentify } from '@/lib/utils/utils';
import { useChat } from '@livekit/components-react';
import {
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
  useEffect,
} from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { createViewerToken } from '@/lib/actions/livekit';
import { Card } from '@/components/ui/card';
import Logo from '@/public/logo_dark.png';
import Livepeer from '@/public/livepeer-logo.png';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccount, useEnsName } from 'wagmi';

import { IExtendedChat } from '@/lib/types';
import { createChatAction } from '@/lib/actions/chat';
import { useSIWE } from 'connectkit';
import Link from 'next/link';
interface Props {
  participantName: string;
  stageId: string;
  prevChatMessages: IExtendedChat[];
}

const ChatBar = ({
  stageId,
  prevChatMessages,
}: {
  stageId: string;
  prevChatMessages: IExtendedChat[];
}) => {
  const serverUrl = 'wss://streameth-fjjg03ki.livekit.cloud';
  const [viewerToken, setViewerToken] = useState('');
  const [viewerName, setViewerName] = useState('');

  const account = useAccount();
  const { data, isLoading: loadingEns } = useEnsName({
    address: account?.address,
    chainId: 1,
  });

  const fakeName = data ? data : account.address;
  const slug = stageId;

  useEffect(() => {
    if (!account || loadingEns || !fakeName || !stageId) {
      return;
    }
    const getOrCreateViewerToken = async () => {
      const SESSION_VIEWER_TOKEN_KEY = `${slug}-viewer-token`;
      const sessionToken = sessionStorage.getItem(SESSION_VIEWER_TOKEN_KEY);

      if (sessionToken) {
        const payload: JwtPayload = jwtDecode(sessionToken);

        if (payload.exp) {
          const expiry = new Date(payload.exp * 1000);
          if (expiry < new Date()) {
            sessionStorage.removeItem(SESSION_VIEWER_TOKEN_KEY);
            const token = await createViewerToken(slug, fakeName);
            setViewerToken(token);
            const jti = jwtDecode(token)?.jti;
            jti && setViewerName(jti);
            sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
            return;
          }
        }

        if (payload.jti) {
          setViewerName(payload.jti);
        }

        setViewerToken(sessionToken);
      } else {
        const token = await createViewerToken(slug, fakeName);
        setViewerToken(token);
        const jti = jwtDecode(token)?.jti;
        jti && setViewerName(jti);
        sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
      }
    };
    void getOrCreateViewerToken();
  }, [fakeName, slug, data, account, loadingEns]);

  if (!viewerToken || !viewerName) {
    return (
      <div className="flex h-full min-h-[400px] w-full flex-1">
        <Card className="h-full w-full">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={viewerToken}
      serverUrl={serverUrl}
      className="flex flex-1 flex-col"
    >
      <div className="flex h-full min-h-[400px] flex-1">
        <Card className="sticky h-full w-full border-l bg-opacity-30 md:block">
          <div className="absolute bottom-0 right-0 top-0 flex h-full w-full flex-col gap-2 p-2">
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
  );
};

export default ChatBar;

function Chat({ participantName, stageId, prevChatMessages }: Props) {
  const { chatMessages: messages, send } = useChat();
  const [chatMessages, setChatMessages] = useState<
    Array<IExtendedChat | ReceivedChatMessage>
  >([]);
  const reverseMessages = useMemo(
    () => chatMessages.sort((a, b) => b.timestamp - a.timestamp),
    [chatMessages]
  );

  useEffect(() => {
    // Merge prevChatMessages and reverseMessages
    const mergedMessages = [...prevChatMessages, ...messages] as (
      | IExtendedChat
      | ReceivedChatMessage
    )[];
    setChatMessages(mergedMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);
  const { isSignedIn } = useSIWE();
  const account = useAccount();

  const [message, setMessage] = useState('');

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
    });
  }, [stageId, message, participantName]);

  const onEnter = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (message.trim().length > 0 && send) {
          send(message).catch((err) => console.error(err));
          setMessage('');
          sendMessage();
        }
      }
    },
    [message, sendMessage, send]
  );

  const onSend = useCallback(() => {
    if (message.trim().length > 0 && send) {
      send(message).catch((err) => console.error(err));
      setMessage('');
      sendMessage();
    }
  }, [message, sendMessage, send]);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto">
        <Card className="absolute left-0 right-0 top-0 m-1 flex flex-row items-center justify-center space-x-2 p-2">
          <Image width={150} height={50} src={Logo} alt="Logo" />
          <span>❤️</span>
          <Image width={100} height={30} src={Livepeer} alt="Livepeer" />
        </Card>
        {reverseMessages.map((message) => (
          <div
            key={message.timestamp}
            className={cn(
              'flex items-center gap-2 p-2',
              participantName === message.from?.identity
                ? 'justify-end'
                : 'justify-start'
            )}
          >
            <Card className="flex flex-col p-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'text-xs font-semibold',
                    participantName === message.from?.identity
                      ? 'text-black'
                      : 'text-gray-500'
                  )}
                >
                  {formatIdentify(message.from?.identity)}
                  {participantName === message.from?.identity && ' (you)'}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div className="text-sm text-white">{message.message}</div>
            </Card>
          </div>
        ))}
      </div>
      {account.isConnected && isSignedIn ? (
        <div className="flex flex-col gap-2">
          <Textarea
            value={message}
            className="border-box h-1 min-h-[50px] w-full dark:bg-zinc-900"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={onEnter}
            placeholder="Type a message..."
          />
          <Button disabled={message.trim().length === 0} onClick={onSend}>
            <div className="flex items-center gap-2">
              <p>send</p>
            </div>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Link href={'/auth/login'}>Sign in</Link>
        </div>
      )}
    </>
  );
}
