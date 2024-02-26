// import profile from "../assets/img/bird_weard_pirate-hat.png"; // 프로필 사진 파일 경로
import { QuickClassicUrl, QuickItemUrl } from "../api/url/RoomSearchUrl";
import CreatingRoomModal from "@/components/modal/CreatingRoomModal";
import { useNavigate } from "react-router-dom";
import subject_board from "../assets/img/subject_board.png";
import wooden_board from "../assets/img/wooden_board.png";
import { useState } from "react";
import post_it_4 from "../assets/img/post_it_4.png";
import post_it_5 from "../assets/img/post_it_5.png";
import post_it_6 from "../assets/img/post_it_6.png";
import post_it_7 from "../assets/img/post_it_7.png";
import axios from "axios";
import { SFX, playSFX } from "../utils/audioManager";

const NormalGameChoice = () => {
  const [creatingRoomVisible, setCreatingRoomVisible] = useState(false);
  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  const handleFastClassicClick = async () => {
    try {
      // 서버에게 현재 개설된 방 목록을 요청
      const response = await axios.get(QuickClassicUrl, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      const room = response.data;

      if (room) {
        navigate(`/room/${room.roomId}`, {
          state: { roomName: room.roomName, gameType: "classic" },
        });
      }
    } catch (error) {
      alert("참가 할 수 있는 방이 없습니다.");
    }
  };

  const handleFastItemClick = async () => {
    try {
      // 서버에게 현재 개설된 방 목록을 요청
      const response = await axios.get(QuickItemUrl, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      const room = response.data;

      if (room) {
        navigate(`/room/${room.roomId}`, { state: { roomName: room.roomName, gameType: "item" } });
      }
    } catch (error) {
      alert("참가 할 수 있는 방이 없습니다.");
    }
  };

  const handleCreatingRoomOpen = () => {
    playSFX(SFX.POPUP);
    setCreatingRoomVisible(true);
  };

  const handleCreatingRoomClose = () => {
    playSFX(SFX.POPUP);
    setCreatingRoomVisible(false);
  };

  const handleRoomSearchClick = () => {
    playSFX(SFX.CLICK);
    navigate("roomSearch"); // 랭킹전 화면으로 이동
  };

  return (
    <>
      <div className="h-screen flex flex-col items-center space-y-5 animate-fade-left animate-once">
        <div
          className="flex justify-center items-center"
          style={{
            position: "relative",
            height: "15%",
            width: "70%",
            backgroundImage: `url(${subject_board})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
          }}
        >
          <div
            className="object-cover absolute h-auto font-bold ];
            text-stone-100 w-full text-center"
            style={{
              fontSize: "300%",
              position: "absolute",
              // left: "50%",
              // transform: "translate(-30%,-50%)",
              // top: "50%",
              textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
              letterSpacing: "10px", // 글자 사이의 간격을 2px로 지정
            }}
          >
            일반전
          </div>
        </div>
        <div
          className="flex flex-col justify-center items-center"
          style={{ position: "relative", width: "80%" }}
        >
          <img src={wooden_board} />
          <div
            className="flex justify-center object-cover absolute z-0 w-4/5 h-4/5"
            style={{
              transform: "translateX(-50%)",
              left: "50%",
              top: "5%",
            }}
          >
            <div className="flex justify-center  " style={{ position: "relative" }}>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row">
                  <button
                    onClick={handleFastClassicClick}
                    style={{ position: "relative" }}
                    className=" text-white font-bold z-10"
                  >
                    <img src={post_it_4} />
                    <div
                      className="font-bold w-full"
                      style={{
                        fontSize: "120%",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
                      }}
                    >
                      <p>바로입장</p>
                      <p>클래식</p>
                    </div>
                  </button>
                  <button
                    onClick={handleFastItemClick}
                    style={{ position: "relative" }}
                    className=" text-white font-bold z-10"
                  >
                    <img src={post_it_5} />
                    <div
                      className="font-bold w-full"
                      style={{
                        fontSize: "120%",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
                      }}
                    >
                      <p>바로입장</p>
                      <p>아이템</p>
                    </div>
                  </button>
                </div>
                <div className="flex flex-row gap-3">
                  <button
                    onClick={handleCreatingRoomOpen}
                    style={{ position: "relative" }}
                    className=" text-white font-bold z-10"
                  >
                    <img src={post_it_6} />
                    <div
                      className="font-bold w-full"
                      style={{
                        fontSize: "120%",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
                      }}
                    >
                      방만들기
                    </div>
                  </button>
                  <button
                    onClick={handleRoomSearchClick}
                    style={{ position: "relative" }}
                    className=" text-white font-bold z-10"
                  >
                    <img src={post_it_7} />
                    <div
                      className="font-bold w-full"
                      style={{
                        fontSize: "120%",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
                      }}
                    >
                      방찾기
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreatingRoomModal visible={creatingRoomVisible} onClose={handleCreatingRoomClose} />
    </>
  );
};
export default NormalGameChoice;
