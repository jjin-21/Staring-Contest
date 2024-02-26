import OpenViduVideoComponent from "./OvVideo";
import { useRef } from "react";
import nickname_plate from "../../assets/img/nickname_plate.png";
import frame from "../../assets/img/frame.png";
import changeProfileImage from "@/utils/changeProfileImage";

export default function OpponentVideoComponent({ streamManager, opponentInfoParsed }) {
  const videoRef = useRef(null);

  const getNicknameTag = () => {
    // Gets the nickName of the user
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div className="flex">
      {streamManager !== undefined ? (
        <div className="m-5 flex flex-col items-center justify-center ">
          <OpenViduVideoComponent streamManager={streamManager} ref={videoRef} />
          <div className="flex flex-row m-2">
            <div>
              <img
                src={changeProfileImage().profileImagePath(opponentInfoParsed.profileImage)}
                style={{
                  width: "50px",
                  backgroundImage: `url(${frame})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100%",
                  backgroundPosition: "center",
                }}
              />
            </div>
            <div
              className="p-3"
              style={{
                backgroundImage: `url(${nickname_plate})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                fontSize: "20px",
              }}
            >
              {getNicknameTag()}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
