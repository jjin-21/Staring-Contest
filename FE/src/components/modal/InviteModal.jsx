import { useWebSocket } from "../../context/WebSocketContext"; // Import useWebSocket
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "rodal/lib/rodal.css"; // Rodal CSS
import Rodal from "rodal"; // Rodal import
import axios from "axios";
import QRCode from "qrcode.react";
// import { baseUrl } from "../../api/url/baseUrl";

const InviteModal = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState("friendlist");
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { client } = useWebSocket(); // Get the WebSocket client
  const location = useLocation();
  const [showQRCode, setShowQRCode] = useState(false); // Add this line
  const homeUrl = "https://i10e206.p.ssafy.io";

  useEffect(() => {
    // 친구 목록을 가져오는 API 호출
    axios
      .get("/api/friends")
      .then((response) => {
        if (Array.isArray(response.data)) {
          // friends가 배열인지 확인
          setFriends(response.data);
        } else {
          console.error("Error: friends is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching friends", error);
      });
  }, []);

  const handleInvite = () => {
    // WebSocket을 사용하여 초대 상태를 실시간으로 업데이트
    if (client && client.connected) {
      client.publish({
        destination: "/app/invite",
        body: JSON.stringify({ friendId: selectedFriend }),
      });
      onClose();
    } else {
    }
  };

  const handleCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(`${homeUrl}${location.pathname}`);
      alert("클립보드에 링크가 복사되었어요.");
    } catch (err) {
    }
  };

  const handleGenerateQRCode = () => {
    setShowQRCode(true); // Add this line
  };

  return (
    <Rodal visible={visible} onClose={onClose} closeOnEsc={true} closeMaskOnClick={false}>
      <div className="flex flex-col items-center p-5 bg-gray-100 rounded-lg">
        <h2 className="mb-4">친구 초대하기</h2>
        <div className="flex justify-between mb-5">
          <button
            onClick={() => setActiveTab("friendlist")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full"
          >
            친구 목록
          </button>
          <button
            onClick={() => setActiveTab("inviteadress")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-full"
          >
            링크/QR
          </button>
        </div>
        {activeTab === "friendlist" && (
          <div className="flex-row">
            <select
              className="mb-4 p-2 rounded border border-gray-300"
              onChange={(e) => setSelectedFriend(e.target.value)}
            >
              {Array.isArray(friends)
                ? friends.map(
                    (
                      friend // friends가 배열인지 확인
                    ) => (
                      <option key={friend.id} value={friend.id}>
                        {friend.name}
                      </option>
                    )
                  )
                : null}
            </select>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
              onClick={handleInvite}
            >
              초대하기
            </button>
          </div>
        )}
        {activeTab === "inviteadress" && (
          <div className="flex flex-col">
            <button
              className="button-container"
              onClick={() => handleCopyClipBoard(`${homeUrl}${location.pathname}`)}
            >
              링크 복사하기
            </button>
            <button onClick={handleGenerateQRCode}>QR코드 생성하기</button>
            {showQRCode && <QRCode value={`${homeUrl}${location.pathname}`} />}{" "}
            {/* Add this line */}
          </div>
        )}
      </div>
    </Rodal>
  );
};

export default InviteModal;
