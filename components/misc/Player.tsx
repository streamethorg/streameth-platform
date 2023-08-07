"use client";

import { Player as LivepeerPlayer, useAssetMetrics, useAsset} from "@livepeer/react";
import { useCallback } from "react";
import { useAccount } from "wagmi";
// @ts-ignore
import mux from "mux-embed";
import Image from "next/image";
import Logo from "@/public/logo.png";
const OfflinePlayer = () => {
  return (
    <div className="bg-black flex items-center justify-center flex-col w-full h-full">
      <span className="text-2xl font-bold text-black">Offline</span>
      <span className="text-black dark:text-gray-300 text-xs hidden md:block mt-2">
        Powered by
      </span>
      <a
        className="relative w-24 lg:w-32 h-6"
        href="https://streameth.org"
        target="_blank"
        rel="noreferrer"
      >
        <Image src={Logo} width={100} height={100} alt="streamETH" />
      </a>
    </div>
  );
};

export const Player = ({
  playbackId,
  playerName,
  coverImage,
}: {
  playbackId?: string;
  playerName: string;
  coverImage?: string;
}) => {
  const { address } = useAccount();


  const mediaElementRef = useCallback(
    (ref: HTMLMediaElement) => {
      if (ref && process.env.NEXT_PUBLIC_MUX_ENV_KEY) {
        const initTime = mux.utils.now();
        mux.monitor(ref, {
          debug: false,
          data: {
            env_key: process.env.NEXT_PUBLIC_MUX_ENV_KEY, // required
            // Metadata fields
            player_name: playerName ?? "livepeer player", // any arbitrary string you want to use to identify this player
            player_init_time: initTime,
          },
        });
      }
    },
    [playerName]
  );



  return (
    <LivepeerPlayer
      mediaElementRef={mediaElementRef}
      playbackId={playbackId}
      showTitle={false}
      showPipButton={false}
      muted={true}
      autoPlay
      priority
      lowLatency
      // poster={<OfflinePlayer />}
      showLoadingSpinner={true}
      controls={{ autohide: 0, hotkeys: false, defaultVolume: 0.6 }}
      viewerId={address}
    />
  );
};

export default Player;
