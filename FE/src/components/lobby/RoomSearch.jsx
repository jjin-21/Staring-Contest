import { RoomClassicUrl, RoomItemUrl } from "../../api/url/RoomSearchUrl"; // URL import
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Rodal from "rodal";
import axios from "axios";
import { baseUrl } from "../../api/url/baseUrl";
import room_search from "../../assets/img/room_search.png";
import old_paper from "../../assets/img/old_paper.png";
import post_it_4 from "../../assets/img/post_it_4.png";
import button_pagenation from "../../assets/img/button_pagenation.png";
import button_pagenation_on from "../../assets/img/button_pagenation_on.png";
const RoomSearch = () => {
  const [refresh, setRefresh] = useState(false);
  const [roomsClassic, setRoomsClassic] = useState([]);
  const [roomsItem, setRoomsItem] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [tabName, setTapName] = useState("클래식 ▼");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null); // 선택된 방
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 표시 여부
  const navigate = useNavigate(); // useNavigate hook
  const roomsPerPage = 5;
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");

  const token = sessionStorage.getItem("accessToken");
  const location = useLocation();

  const handleButtonClick = () => {
    setShowMenu(!showMenu);
  };

  const handleItemClick = (name) => {
    setTapName(name);
    setShowMenu(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 방을 더블 클릭했을 때의 처리
  const handleRoomDoubleClick = (room) => {
    if (room.currentCapacity === room.maxCapacity) {
      alert("입장 가능한 자리가 없습니다.");
      return;
    }
    setSelectedRoom(room);
    if (room.hasPassword) {
      // 방이 비밀번호로 보호되어 있으면 비밀번호 입력 모달을 표시
      setIsPasswordModalOpen(true);
    } else {
      // 방이 비밀번호로 보호되어 있지 않으면 바로 입장
      navigate(`/room/${room.roomId}`, {
        state: {
          roomName: room.roomName,
          password,
          gameType: tabName === "클래식 ▼" ? "classic" : "item",
        },
      });
    }
  };

  // [[예]] 버튼을 클릭했을 때의 처리
  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        baseUrl + "/api/room/enter",
        { roomId: selectedRoom.roomId, password: password },
        {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        }
      );
      navigate(`/room/${selectedRoom.roomId}`, {
        state: {
          roomName,
          password,
          hastoken: response.data.connectionToken,
          gameType: tabName === "클래식 ▼" ? "classic" : "item",
        },
      });
    } catch (error) {
      alert("비밀번호 오류");
    }
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms =
    tabName === "아이템 ▼"
      ? roomsItem.slice(indexOfFirstRoom, indexOfLastRoom)
      : roomsClassic.slice(indexOfFirstRoom, indexOfLastRoom);

  useEffect(() => {
    refreshroom();
    // 서버에 GET 요청을 보내 방 목록을 가져옴
    async function refreshroom() {
      await axios
        .get(RoomClassicUrl, {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        })
        .then((response) => {
          setRoomsClassic(response.data);
        });
      await axios
        .get(RoomItemUrl, {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        })
        .then((response) => {
          setRoomsItem(response.data);
        });
    }
    setRefresh(false);
  }, [refresh]);

  return (
    <>
      <div className="h-screen flex flex-col items-center animate-fade-left animate-once">
        <div className="flex justify-center items-center" style={{ position: "relative" }}>
          <div>
            <img src={room_search} />
          </div>
          <div className="absolute right-0">
            <div
              className="items-center justify-center"
              style={{
                backgroundImage: `url(${post_it_4})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
              }}
            >
              <button className="mb-5" onClick={handleButtonClick}>
                {tabName}
              </button>
              {showMenu && (
                <div className="absolute right-0 m-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      onClick={() => {
                        handleItemClick("클래식 ▼");
                        setRefresh(true);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      클래식전
                    </button>
                    <button
                      onClick={() => {
                        handleItemClick("아이템 ▼");
                        setRefresh(true);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      아이템전
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="p-2 flex flex-col"
          style={{
            position: "relative",
            textShadow: "3px 3px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
          }}
        >
          <div
            className="absolute w-4/5 h-3/5 flex flex-col items-center mt-1"
            style={{ top: "43%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            {currentRooms.map((room) => (
              <div
                key={room.roomName}
                className=" w-64 py-1 px-4 mb-3 text-center animate-jump-in animate-duration-500 animate-once"
                style={{
                  background:
                    "radial-gradient(circle, rgba(200,100,150,0.1) 0%, rgba(200,120,20,0.5) 100%)", // 피색 배경과 빛처럼 퍼지는 효과 추가
                  borderRadius: "20px", // 모서리 둥글게
                  boxShadow: "0 5px 5px rgba(0,0,0,0.5)", // 그림자 추가
                }} // room을 이미지 위로 이동
                onClick={() => {
                  setRoomName(room.roomName);
                  handleRoomDoubleClick(room);
                }}
              >
                <div className="flex justify-between ">
                  <p style={{ flexGrow: 1, width: "2rem" }}>{room.hasPassword ? "🔒" : ""}</p>
                  <p style={{ flexGrow: 3, width: "14rem" }}>{room.roomName}</p>
                  <p style={{ flexGrow: 2, width: "8rem" }}>
                    {room.maxCapacity} vs {room.maxCapacity}
                  </p>
                </div>
                <hr style={{ border: "none", height: "2px", backgroundColor: "#A0522D" }} />
                <div className="flex justify-between ">
                  <p style={{ flexGrow: 1, width: "12rem" }}>현재인원 / 최대인원</p>
                  <p style={{ flexGrow: 1, width: "6rem" }}>
                    {room.currentCapacity} / {room.maxCapacity}
                  </p>
                </div>
              </div>
              // </Link>
            ))}
          </div>
          {/* 비밀번호 입력 모달 */}
          <Rodal visible={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
            <p>비밀번호를 입력하세요:</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleConfirm}>입장</button>
          </Rodal>
          <img src={old_paper} />
        </div>

        <div className="p-4">
          <div className="flex justify-center space-x-2">
            {/* 페이지 번호 버튼을 출력합니다. 여기서는 1~7까지 출력합니다. */}
            {Array.from(
              {
                length: Math.ceil(
                  (tabName === "아이템 ▼" ? roomsItem.length : roomsClassic.length) / roomsPerPage
                ),
              },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className="text-white p-3 "
                style={{
                  fontSize: "20px",
                  backgroundImage: `url(${currentPage === page ? button_pagenation_on : button_pagenation})`,
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomSearch;
