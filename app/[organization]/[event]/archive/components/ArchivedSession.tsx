import { ISession } from "@/server/model/session";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { useState } from "react";
import Link from "next/link";

const ArchivedSession = ({
  session,
  learnMore = false,
  goToStage = false,
}: {
  session: ISession;
  learnMore?: boolean;
  goToStage?: boolean;
}) => {
  const [image, setImage] = useState(session.coverImage);
  const alt = "/events/" + session.eventId + ".png"
  const component = (
    <div className="flex flex-col rounded h-full p-4 shadow box-border bg-base">
      <div className="aspect-video relative">
        <Image
          className="rounded"
          alt="session image"
          quality={80}
          src={image ?? ""}
          fill
          style={{
            objectFit: "cover",
          }}
          onError={() => {
            setImage(alt);
          }}
          onLoadingComplete={(result) => {
            if (result.naturalHeight === 0) {
              setImage(alt);
            }
          }}
        />
      </div>
      <p className="border-b-2 border-accent  p-2 py-4 flex flex-grow text-md ">
        {session.name}
      </p>
    </div>
  );
  if (learnMore) return <Link href={"session/" + session.id}>{component}</Link>;
  if (goToStage)
    return <Link href={"/stage/" + session.stageId}>{component}</Link>;
  return component;
};

export default ArchivedSession;
