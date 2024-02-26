// CreatingRoomModal.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import Rodal from "rodal"; // Rodal import
import axios from "axios";
import "rodal/lib/rodal.css"; // Rodal CSS
import { RoomUrl } from "@/api/url/RoomUrl";
import background_modal from "@/assets/img/background_modal.png";
import ready_button from "@/assets/img/ready_button.png";
const CreatingRoomModal = ({ visible, onClose }) => {
  const token = sessionStorage.getItem("accessToken"); // test용
  const [roomName, setRoomName] = useState("");
  const [isItem, setIsItem] = useState(false);
  const [players, setPlayers] = useState("1vs1");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // useNavigate hook

  const resetModal = () => {
    setRoomName("");
    setIsItem(false);
    setPlayers("1vs1");
    setPassword("");
    setErrorMessage("");
  };

  const onCloseModal = () => {
    resetModal();
    onClose();
  };

  const handleCreate = async () => {
    if (roomName.length === 0) {
      setErrorMessage("방 제목을 입력해주세요.");
    } else if (roomName.length > 10) {
      setErrorMessage("방 제목은 10자를 초과할 수 없습니다.");
    } else if (!/^\d*$/.test(password)) {
      setErrorMessage("패스워드에는 숫자만 입력해주세요.");
    } else {
      try {
        const response = await axios.post(
          RoomUrl,
          {
            roomName: roomName,
            password: password,
            maxCapacity: players[0] * 2,
            isItem: isItem,
          },
          {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          }
        );

        const data = response.data;

        if (data === "fail") {
          setErrorMessage("방 생성에 실패했습니다.");
        } else {
          // 방 생성에 성공하면 모달을 닫고, 필요한 경우 추가 작업을 수행
          onClose();
          // 방으로 이동
          navigate(`/room/${data.sessionId}`, {
            state: { roomName, password, gameType: isItem ? "item" : "classic" },
          });
        }
      } catch (error) {
        if (error.response) {
          if (error.response.data.errorMessage === "방 생성: 최대 방 갯수 초과") {
            setErrorMessage("최대 방 갯수가 초과 되었습니다.");
          } else if (error.response.data.errorMessage === "방 생성: 방 이름 중복") {
            setErrorMessage("중복된 방 이름입니다.");
          }
        }
      }
    }
  };

  return (
    <Rodal
      visible={visible}
      onClose={onCloseModal}
      closeOnEsc={true}
      closeMaskOnClick={false}
      height={320}
      customStyles={{
        overflow: "auto",
        width: "80%",
        backgroundImage: `url(${background_modal})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundColor: "transparent", // 배경색 투명으로 설정
        borderRadius: "none", // border-radius 제거
        boxShadow: "none", // box-shadow 제거
      }}
      className="creatingRoom"
    >
      <div className="flex flex-col items-center p-3">
        <h3
          className="mb-6 text-2xl font-bold"
          style={{
            textShadow: "3px 3px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
          }}
        >
          방 만들기
        </h3>

        <div>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="방 제목"
            className=" p-3 rounded w-full placeholder-black"
            style={{
              background:
                "radial-gradient(circle, rgba(200,100,150,0.1) 80%, rgba(200,120,20,0.5) 100%)", // 피색 배경과 빛처럼 퍼지는 효과 추가
              borderRadius: "10px", // 모서리 둥글게
              boxShadow: "0 5px 5px rgba(0,0,0,0.5)", // 그림자 추가
            }}
          />
        </div>
        <div className="flex flex-row gap-9">
          <select
            value={isItem}
            onChange={(e) => setIsItem(e.target.value === "true")}
            className=" p-3 rounded mt-2"
            style={{
              background:
                "radial-gradient(circle, rgba(200,100,150,0.1) 80%, rgba(200,120,20,0.5) 100%)", // 피색 배경과 빛처럼 퍼지는 효과 추가
              borderRadius: "10px", // 모서리 둥글게
              boxShadow: "0 5px 5px rgba(0,0,0,0.5)", // 그림자 추가
            }}
          >
            <option value={false}>클래식전</option>
            <option value={true}>아이템전</option>
          </select>

          <select
            value={players}
            onChange={(e) => setPlayers(e.target.value)}
            className=" p-3 rounded mt-2"
            style={{
              background:
                "radial-gradient(circle, rgba(200,100,150,0.1) 80%, rgba(200,120,20,0.5) 100%)", // 피색 배경과 빛처럼 퍼지는 효과 추가
              borderRadius: "10px", // 모서리 둥글게
              boxShadow: "0 5px 5px rgba(0,0,0,0.5)", // 그림자 추가
            }}
          >
            <option value="1vs1">1vs1</option>
            <option value="2vs2">2vs2</option>
            <option value="3vs3">3vs3</option>
            <option value="4vs4">4vs4</option>
          </select>
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="방 비밀번호"
            className=" p-3 rounded mt-2 w-full placeholder-black"
            style={{
              background:
                "radial-gradient(circle, rgba(200,100,150,0.1) 80%, rgba(200,120,20,0.5) 100%)", // 피색 배경과 빛처럼 퍼지는 효과 추가
              borderRadius: "10px", // 모서리 둥글게
              boxShadow: "0 5px 5px rgba(0,0,0,0.5)", // 그림자 추가
            }}
          />
        </div>
        <div>
          <button
            onClick={handleCreate}
            className="  text-black font-bold py-2 px-4 rounded-full mt-2 w-full"
            style={{
              backgroundImage: `url(${ready_button})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              textShadow: "3px 3px 3px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
            }}
          >
            생성
          </button>
        </div>
        <div>{errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}</div>
      </div>
    </Rodal>
  );
};

export default CreatingRoomModal;
