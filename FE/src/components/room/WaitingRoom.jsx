import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
// import Rodal from "rodal";
// import "rodal/lib/rodal.css";
import UserVideoComponent from "./UserVideoComponent";
import AudioControlModal from "../modal/AudioControlModal";
import ChatModal from "../modal/ChatModal";
import back_mark from "../../assets/img/back_mark.png";
import room_name from "../../assets/img/room_name.png";
import EachTemplate from "@/assets/img/room/EachTemplate.png";
// import InviteModal from "../modal/InviteModal";
const WaitingRoom = ({
  roomName,
  gameType,
  publisher,
  subscribers,
  mySessionId,
  myStreamId,
  myUserName,
  myTeam,
  teamA,
  teamB,
  teamW,
  cameraOn,
  micOn,
  toggleCamera,
  toggleMic,
  leaveSession,
  handleSelectTeam,
  isTeamFull,
  isTeamFull2,
  MicON,
  MicOFF,
  CameraON,
  CameraOFF,
  Chat,
  Sound,
  chatMessages,
  teamChatMessages,
  currentMessage,
  chatMode,
  setChatMessages,
  setTeamChatMessages,
  setCurrentMessage,
  sendChatMessage,
  setChatMode,
  ready,
  sendReady,
  participantsReady,
  setGameState,
  sendStart,
}) => {
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [isAudioModalVisible, setIsAudioModalVisible] = useState(false);
  const [selectedAudioOption, setSelectedAudioOption] = useState("off");
  const [inviteVisible, setInviteVisible] = useState(false); // 설정 모달 가시성 state

  const navigate = useNavigate();

  // const handleInviteOpen = () => {
  //   setInviteVisible(true); // 설정 모달 열기
  // };

  // const handleInviteClose = () => {
  //   setInviteVisible(false); // 설정 모달 닫기
  // };

  const toggleAudio = (Team, turn) => {
    Team.map((streamId) => {
      const streamManager = subscribers.find((sub) => sub.stream.streamId === streamId);
      if (streamManager) {
        streamManager.subscribeToAudio(turn);
      }
    });
  };

  useEffect(() => {
    // 현재 사용자가 선택한 음성 옵션에 따라 다른 팀의 오디오를 업데이트
    const updateAudioBasedOnTeamChange = () => {
      if (selectedAudioOption === "team" && myTeam !== "W") {
        // 현재 사용자의 팀만 오디오 켜기
        toggleAudio(myTeam === "A" ? teamA : teamB, true);
        // 다른 팀 오디오 끄기
        toggleAudio(myTeam === "A" ? teamB : teamA, false);
      } else if (selectedAudioOption === "all" && myTeam !== "W") {
        // 모든 팀의 오디오 켜기
        toggleAudio(teamA, true);
        toggleAudio(teamB, true);
      } else if (selectedAudioOption === "off") {
        // 모든 팀의 오디오 끄기
        toggleAudio(teamA, false);
        toggleAudio(teamB, false);
      }
    };

    updateAudioBasedOnTeamChange();
  }, [teamA, teamB, myTeam, selectedAudioOption]);

  return (
    <div
      className="waiting-room h-screen flex flex-col animate-fade-left animate-once"
      style={{ backgroundColor: "#69492E", height: "100%vh" }}
    >
      <div className="h-2/3 mt-3vh">
        <div className="h-full text-center flex justify-center items-end relative">
          <Link
            to="/lobby"
            className="btn btn-large btn-danger flex absolute left-5"
            onClick={() => leaveSession()}
          >
            <img src={back_mark} />
          </Link>
          {/* <button
            className="btn btn-large btn-primary bg-green-600"
            id="buttonInviteModal"
            onClick={handleInviteOpen}
          >
            초대하기
          </button> */}
          <div
            className="flex flex-col p-4 waitingRoom0"
            style={{
              background: `url(${room_name})`,
              backgroundSize: "50vw 8vh",
              backgroundRepeat: "no-repeat",
              width: "50vw",
              height: "8vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <h2 className="text-7vw waitingRoom1">{roomName}</h2>
            <h2 className="text-4vw waitingRoom2">
              {gameType === "classic" ? "클래식전" : "아이템전"}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex justify-between h-5/6 mt-2vh">
        <div
          id="teamA-container"
          // className="grid grid-rows-[auto_1fr_auto] border-4 border-sky-500 bg-sky-300 m-2 h-full w-2/5"
          className="grid grid-rows-[auto_1fr_auto] m-2 h-full w-2/5"
        >
          <div className="text-center text-xs bg-amber-700 p-2 mb-1vh">
            A 팀 : {teamA.filter((id) => id !== null).length} / 4 명
          </div>
          <div className="grid grid-rows-4 overflow-hidden justify-items-center h-65vh">
            {teamA.map((streamId, idx) => (
              <div
                key={idx}
                style={{
                  background: `url(${EachTemplate}) no-repeat center center`,
                  backgroundSize: "30vw 15vh",
                  width: "30vw",
                  height: "15vh",
                }}
                className="flex justify-center items-center waitingRoom3"
              >
                {streamId && (
                  <UserVideoComponent
                    streamManager={
                      streamId === publisher?.stream.streamId
                        ? publisher
                        : subscribers.find((sub) => sub.stream.streamId === streamId)
                    }
                    streamId={streamId}
                    clientStreamId={myStreamId}
                    color="border-sky-500"
                    participantsReady={participantsReady}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center p-2">
            <button
              onClick={() => handleSelectTeam(publisher.stream.streamId, "A")}
              className={`rounded-md w-full ${isTeamFull(teamA) ? "bg-gray-400" : "bg-amber-500"}`}
              disabled={isTeamFull(teamA)}
              style={{
                transition: "background-color 0.3s, box-shadow 0.3s",
                boxShadow: isTeamFull(teamA) ? "none" : "0 0 0 2px transparent",
              }}
              onMouseEnter={(e) => {
                if (!isTeamFull(teamA)) {
                  e.currentTarget.style.boxShadow = "0 0 0 2px #DAA520";
                }
              }}
              onMouseLeave={(e) => {
                if (!isTeamFull(teamA)) {
                  e.currentTarget.style.boxShadow = "0 0 0 2px transparent";
                }
              }}
            >
              A팀 선택
            </button>
          </div>
        </div>

        <div
          id="waiting-area-container"
          className="flex flex-col-reverse items-center overflow-hidden mt-2 w-3/12"
          style={{
            borderColor: "#5C4033", // 진한 갈색으로 변경
            backgroundColor: "#8B4513",
            border: "4px solid",
            minHeight: "100px", // 대기열의 최소 높이 설정
            flexGrow: 0,
            flexShrink: 1,
          }}
        >
          <div
            onClick={() => handleSelectTeam(publisher.stream.streamId, "W")}
            className="text-center text-3vw p-2 w-full bg-amber-600 cursor-pointer hover:bg-amber-700"
          >
            <div>대기열 이동</div> <div>( {teamW.filter((id) => id !== null).length} / 8 )</div>
          </div>
          {teamW.map((streamId, idx) => {
            const streamManager =
              streamId === publisher?.stream.streamId
                ? publisher
                : subscribers.find((sub) => sub.stream.streamId === streamId);
            return (
              streamManager && (
                <div
                  key={idx}
                  className="flex justify-center items-center border-2 border-green-500 m-1 text-sm w-full h-4vh"
                >
                  {JSON.parse(streamManager.stream.connection.data).clientData}
                </div>
              )
            );
          })}
        </div>

        <div id="teamB-container" className="grid grid-rows-[auto_1fr_auto] m-2 h-full w-2/5">
          <div className="text-center text-xs bg-amber-700 p-2 mb-1vh">
            B 팀 : {teamB.filter((id) => id !== null).length} / 4 명
          </div>
          <div className="grid grid-rows-4 overflow-hidden justify-items-center h-65vh">
            {teamB.map((streamId, idx) => (
              <div
                key={idx}
                style={{
                  background: `url(${EachTemplate}) no-repeat center center`,
                  backgroundSize: "30vw 15vh",
                  width: "30vw",
                  height: "15vh",
                }}
                className="flex justify-center items-center"
              >
                {streamId && (
                  <UserVideoComponent
                    streamManager={
                      streamId === publisher?.stream.streamId
                        ? publisher
                        : subscribers.find((sub) => sub.stream.streamId === streamId)
                    }
                    streamId={streamId}
                    clientStreamId={myStreamId}
                    color="border-red-500"
                    participantsReady={participantsReady}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center p-2">
            <button
              onClick={() => handleSelectTeam(publisher.stream.streamId, "B")}
              className={`rounded-md w-full ${isTeamFull(teamA) ? "bg-gray-400" : "bg-amber-500"}`}
              disabled={isTeamFull(teamB)}
              style={{
                transition: "background-color 0.3s, box-shadow 0.3s",
                boxShadow: isTeamFull(teamA) ? "none" : "0 0 0 2px transparent",
              }}
              onMouseEnter={(e) => {
                if (!isTeamFull(teamB)) {
                  e.currentTarget.style.boxShadow = "0 0 0 2px #DAA520";
                }
              }}
              onMouseLeave={(e) => {
                if (!isTeamFull(teamB)) {
                  e.currentTarget.style.boxShadow = "0 0 0 2px transparent";
                }
              }}
            >
              B팀 선택
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex items-center ms-3vw gap-4 w-full">
          <img
            className="p-1 w-12vw h-6vh border-2 rounded-full"
            src={cameraOn ? CameraON : CameraOFF}
            onClick={toggleCamera}
          />
          <img
            className="p-1 w-12vw h-6vh border-2 rounded-full"
            src={micOn ? MicON : MicOFF}
            onClick={toggleMic}
          />

          <button
            onClick={() => setIsChatModalVisible(true)}
            className="flex items-center justify-center rounded-full border-2"
          >
            <img className={`p-2 w-12vw h-6vh object-contain `} src={Chat} />
          </button>

          <button
            onClick={() => setIsAudioModalVisible(true)}
            className="flex items-center justify-center"
            disabled={myTeam === "W"}
          >
            <div className="relative p-1.5 w-12vw h-6vh object-contain rounded-full border-2">
              {myTeam === "W" && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <div className="absolute bg-black h-[2px] w-full transform rotate-45"></div>{" "}
                </div>
              )}
              <img
                className="w-full h-full object-contain"
                src={Sound}
                alt="Sound Icon"
                style={{ opacity: myTeam === "W" ? 0.5 : 1 }} // 사용 불가능 시 투명도 조절
              />
            </div>
          </button>

          <AudioControlModal
            isVisible={isAudioModalVisible}
            hideModal={() => setIsAudioModalVisible(false)}
            toggleAudio={toggleAudio}
            selectedAudioOption={selectedAudioOption}
            setSelectedAudioOption={setSelectedAudioOption}
            myTeam={myTeam}
            teamA={teamA}
            teamB={teamB}
          />
        </div>

        <ChatModal
          isVisible={isChatModalVisible}
          hideModal={() => setIsChatModalVisible(false)}
          chatMode={chatMode}
          chatMessages={chatMessages}
          teamChatMessages={teamChatMessages}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          sendChatMessage={sendChatMessage}
          setChatMode={setChatMode}
          setChatMessages={setChatMessages}
          setTeamChatMessages={setTeamChatMessages}
          myTeam={myTeam}
          myUserName={myUserName}
        />
        <div className="flex justify-center items-center h-full">
          {teamA[0] === myStreamId &&
          teamA.filter((id) => id !== null).length === teamB.filter((id) => id !== null).length &&
          Object.values(participantsReady).every((value) => value === true) ? (
            <button
              className="w-[45px] h-[45px] mx-4 flex justify-center items-center rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 border border-transparent text-white"
              onClick={() => {
                sendStart();
              }}
            >
              시작
            </button>
          ) : (
            <button
              className={`w-[45px] h-[45px] mx-4 flex justify-center items-center rounded-lg ${ready ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"} focus:outline-none focus:ring-2 focus:ring-opacity-50 border border-transparent text-white`}
              onClick={() => {
                sendReady();
              }}
              disabled={myTeam === "W"}
            >
              준비
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
