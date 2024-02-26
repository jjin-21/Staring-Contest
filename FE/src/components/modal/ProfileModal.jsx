import Rodal from "rodal";
import "rodal/lib/rodal.css";
import changeProfileImage from "@/utils/changeProfileImage";
import lobbyApiCall from "@/api/axios/lobbyApiCall";

const ProfileModal = ({ visible, user, onClose }) => {
  const requestFriend = lobbyApiCall();
  const handleRequestFriend = (email) => {
    try {
      requestFriend.addFriend(email);
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  return (
    <Rodal visible={visible} onClose={onClose}>
      <div className="p-4 max-w-sm mx-auto bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          <img
            src={changeProfileImage().profileImagePath(user?.profileImage)}
            alt="프로필 이미지"
            className="w-20 h-20 rounded-full mb-4 border-2 border-blue-300"
          />
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <span className="font-semibold">닉네임: {user?.nickname} </span>
          </div>
        </div>
        <div className="mt-4 font-semibold">전적 </div>
        <div className="mt-4 font-semibold">아이템</div>
        <div>점수 : {user?.itemPt} pt </div>
        <div>
          승률 : {user?.winNumItem}승 {user?.loseNumItem} 패{" "}
          {user?.winNumItem + user?.loseNumItem != 0
            ? (user?.winNumItem / (user?.winNumItem + user?.loseNumItem)) * 100
            : 0}
          %
        </div>
        <div className="mt-4 font-semibold">클래식 </div>
        <div>점수 : {user?.classicPt} pt </div>
        <div>
          승률 : {user?.winNumClassic}승 {user?.loseNumClassic} 패{" "}
          {user?.winNumClassic + user?.loseNumClassic != 0
            ? (user?.winNumClassic / (user?.winNumClassic + user?.loseNumClassic)) * 100
            : 0}
          %
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              handleRequestFriend(user?.email);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            친구 추가
          </button>
        </div>
      </div>
    </Rodal>
  );
};

export default ProfileModal;
