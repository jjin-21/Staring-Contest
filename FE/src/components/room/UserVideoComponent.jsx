import { useState, useRef } from "react";
import OpenViduVideoComponent from "./OvVideo";

export default function UserVideoComponent({
  streamManager,
  streamId,
  clientStreamId,
  color,
  participantsReady,
}) {
  const [isActive, setIsActive] = useState(true);
  const videoRef = useRef(null);
  // const isMutedRef = React.useRef(isMuted);

  // React.useEffect(() => {
  //   isMutedRef.current = isMuted;
  // }, [isMuted]);

  // const toggleMute = () => {
  //   const newMuteState = !isMuted;
  //   muteAudio(streamId, isMuted);
  //   setIsMuted(newMuteState);
  // };

  // 오디오 제어 함수
  const toggleAudio = () => {
    const newIsActive = !isActive;
    streamManager.subscribeToAudio(newIsActive);
    setIsActive(newIsActive);
  };

  const getNicknameTag = () => {
    // Gets the nickName of the user
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  const readyState = participantsReady[getNicknameTag()];

  return (
    <div className={`h-4/6 w-4/6 ${color}`}>
      {streamManager !== undefined ? (
        <div className="flex-col w-full h-4/5 text-center text-sm justify-center font-bold">
          <OpenViduVideoComponent
            streamManager={streamManager}
            readyState={readyState}
            ref={videoRef}
          />
          <p className="w-100 h-1/4 inline-block bg-amber-500 rounded">{getNicknameTag()}</p>
          {/* <div className="text-right">
            {clientStreamId !== streamId ? (
              <button onClick={toggleAudio}>{isActive ? "들려요" : "안들려요"}</button>
            ) : null}
          </div> */}
        </div>
      ) : null}
    </div>
  );
}
