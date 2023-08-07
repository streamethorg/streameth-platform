"use client";
import { useContext } from "react";
import { ISession } from "@/server/model/session";
import {
  ShareIcon,
  CodeBracketIcon,
  ArrowUturnLeftIcon,
  
} from "@heroicons/react/24/outline";
import EmbedSessionModal from "@/components/sessions/EmbedSession";
import { ModalContext } from "@/components/context/ModalContext";
import { useRouter } from "next/navigation";

const ActionsComponent = ({ session }: { session: ISession }) => {
  const modal = useContext(ModalContext);
  const router = useRouter();
  const onBackClick = () => {
    router.back();
  };

  return (
    <div className="flex flex-row md:w-full p-2 bg-base rounded-t shadow">
      <ArrowUturnLeftIcon
        className="p-1 h-8 w-8 cursor-pointer "
        onClick={onBackClick}
      />
      <CodeBracketIcon
        className="p-1 cursor-pointer ml-auto h-8 w-8 text-accent font-medium"
        onClick={() => {
          modal.openModal(<EmbedSessionModal stageId={session.stageId} />);
        }}
      />
      <ShareIcon className="p-1 h-8 w-8 cursor-pointer ml-3 text-accent" />
    </div>
  );
};

export default ActionsComponent;