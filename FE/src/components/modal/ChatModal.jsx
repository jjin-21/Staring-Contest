import { useEffect, useRef } from "react";
import Rodal from "rodal";

const ChatModal = ({
  isVisible,
  hideModal,
  chatMode,
  chatMessages,
  teamChatMessages,
  currentMessage,
  setCurrentMessage,
  sendChatMessage,
  setChatMode,
  setChatMessages,
  setTeamChatMessages,
  myTeam,
  myUserName,
}) => {
  const chatListRef = useRef(null);

  useEffect(() => {
    if (chatListRef.current) {
      // 채팅 목록의 스크롤을 맨 아래로 이동
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatMode, isVisible]);

  return (
    <Rodal
      visible={isVisible}
      customStyles={{ width: "90vw", height: "50vh" }}
      onClose={hideModal}
      height={400}
      animation="slideUp"
    >
      <div className="flex flex-col h-full">
        <div className="flex my-2">
          <button
            onClick={() => setChatMode("all")}
            className={`border-2 rounded border-solid border-sky-500 mr-4 h-8 w-12 ${chatMode === "all" ? "bg-sky-500" : ""}`}
          >
            전체
          </button>
          <button
            onClick={() => setChatMode(myTeam)}
            className={`border-2 rounded border-solid border-sky-500 mr-4 h-8 w-12 ${chatMode === myTeam ? "bg-sky-500" : ""}`}
          >
            팀
          </button>
        </div>
        <h2 className="border-2 rounded border-solid border-sky-500 px-1">
          {chatMode === "all" ? (
            <div className="flex justify-between">
              <div>전체 채팅</div>
              <button
                className="border-2 rounded-lg bg-red-300 border-red-300"
                onClick={() => {
                  setChatMessages([]);
                }}
              >
                내역 지우기
              </button>
            </div>
          ) : (
            <div className="flex justify-between">
              <div>팀 채팅({myTeam !== "W" ? myTeam + "팀" : "대기열"})</div>
              <button
                className="border-2 rounded-lg bg-red-300 border-red-300"
                onClick={() => {
                  setTeamChatMessages([]);
                }}
              >
                내역 지우기
              </button>
            </div>
          )}
        </h2>
        <div
          className="h-full overflow-y-auto border-2 rounded border-solid border-sky-500 my-1"
          ref={chatListRef}
        >
          {chatMode === "all" &&
            chatMessages.map((msg, index) => {
              // 이전 메시지의 발신자와 현재 메시지의 발신자를 비교
              const showSender = index === 0 || chatMessages[index - 1].sender !== msg.sender;
              return (
                <div key={index} className="m-1 p-1">
                  {msg.sender === myUserName ? (
                    <div className="text-right">
                      <span className="p-2 rounded-2xl bg-green-200 inline-block max-w-56 w-fit h-fit text-left">
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div>
                      {showSender && <div className="text-sm m-1 font-semibold">{msg.sender}</div>}
                      <span className="p-2 rounded-2xl bg-cyan-200 inline-block max-w-56 w-fit h-fit text-left">
                        {msg.content}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          {chatMode === myTeam &&
            teamChatMessages.map((msg, index) => {
              // 이전 메시지의 발신자와 현재 메시지의 발신자를 비교
              const showSender = index === 0 || teamChatMessages[index - 1].sender !== msg.sender;
              return (
                <div key={index} className="m-1 p-1">
                  {msg.sender === myUserName ? (
                    <div className="text-right">
                      <span className="p-2 rounded-2xl bg-green-200 inline-block max-w-56 w-fit h-fit text-left">
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div>
                      {showSender && <div className="text-sm m-1 font-semibold">{msg.sender}</div>}
                      <span className="p-2 rounded-2xl bg-cyan-200 inline-block max-w-56 w-fit h-fit text-left">
                        {msg.content}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        <div className="grid grid-flow-col justify-stretch h-8">
          <input
            type="text"
            value={currentMessage}
            className="border-2 rounded border-solid border-sky-500 mr-2 p-1"
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button
            onClick={() => {
              if (currentMessage.length > 0) {
                sendChatMessage();
              }
            }}
            disabled={currentMessage.length === 0}
            className="border-2 rounded border-solid border-sky-500 bg-sky-300 hover:bg-sky-500"
          >
            보내기
          </button>
        </div>
      </div>
    </Rodal>
  );
};

export default ChatModal;
