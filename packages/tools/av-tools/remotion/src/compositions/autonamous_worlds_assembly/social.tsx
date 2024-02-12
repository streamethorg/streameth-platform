import { AbsoluteFill, staticFile, Img } from "remotion";
import { Props } from "./intro";
import { CreateAvatar } from "../../utils/avatars";
import dayjs from "dayjs";

export const Social: React.FC<Props> = ({ session }) => {
  const bgFile = staticFile(`0xparc/images/AWA_still.png`);
  const logoFile = "";

  function titleClassName() {
    let className = "w-full text-center";
    if (session.name.length >= 140) className += " text-2xl leading-none";
    if (session.name.length > 60 && session.name.length < 140)
      className += " text-2xl leading-tight";
    if (session.name.length > 40 && session.name.length < 60)
      className += " text-3xl leading-tight";
    if (session.name.length < 40) className += " text-5xl leading-tight";

    return className;
  }

  function speakersClassName() {
    let className = "flex flex-row";
    if (session.speakers.length >= 7) className += " gap-8";
    if (session.speakers.length > 3 && session.speakers.length < 7)
      className += " gap-16";
    if (session.speakers.length <= 3) className += " gap-24";

    return className;
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <Img style={{ width: "100%" }} src={bgFile} />
      </AbsoluteFill>

      <AbsoluteFill>
        <div className="flex py-6 px-12 flex-col w-full space-between justify-between ">
          <div className="flex relative h-32">
            {logoFile && (
              <div className="absolute -top-4">
                <Img className="h-32 mt-4" src={logoFile} />
              </div>
            )}
          </div>
          <div className="flex relative mt-16 h-32 items-end">
            <h1
              className={titleClassName()}
              style={{
                transform: `translateY(90px)`,
                fontFamily: "FK Raster Grotesk",
              }}
            >
              {session.name}
            </h1>
          </div>
          <div
            className="flex relative mt-16"
            style={{
              transform: `translateY(60px)`,
            }}
          >
            <div className="flex w-full justify-center items-center">
              <div className={speakersClassName()}>
                {session.speakers.map((i) => {
                  return (
                    <div
                      key={i.id}
                      className="flex flex-col items-center gap-4"
                      style={{
                        fontFamily: "FK Raster Grotesk",
                      }}
                    >
                      <Img
                        className="w-20 object-cover rounded-full border-black shadow-md"
                        src={i.photo ?? CreateAvatar(i.name)}
                      />
                      <span className="text-1xl w-30 text-center leading-normal">
                        {i.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
