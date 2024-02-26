import { useAccessTokenState } from "@/context/AccessTokenContext";
import LobbyBtn from "@/components/lobby/LobbyBtn";
import useShowRodal from "@/hooks/useShowRodal";
import ProfileImageModal from "@/components/modal/ProfileImageModal";
import useFormField from "@/hooks/useFormField";
import usersApiCall from "@/api/axios/usersApiCall";
import { useState } from "react";
import { validateNickname } from "@/utils/validateForm";

const Profile = () => {
  const myInfo = useAccessTokenState();
  const isProfileImageModalVisible = useShowRodal();
  const profileImage = useFormField("");
  const profileImageIndex = useFormField("");
  const useUsersApiCall = usersApiCall();
  const nickname = useFormField(myInfo.nickname, validateNickname);
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  return (
    <div className="p-4 max-w-sm mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center">
        <img
          src={myInfo.profile}
          alt="프로필 이미지"
          className="w-20 h-20 rounded-full mb-4 border-2 border-blue-300"
        />
        <LobbyBtn
          onClick={isProfileImageModalVisible.showRodal}
          className="mt-2 py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-200"
          text="캐릭터 변경"
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center">
          <span className="font-semibold">닉네임:</span>
          {isEditingNickname ? (
            <input
              type="text"
              value={nickname.value}
              onChange={(e) => nickname.onChange(e.target.value)}
              className="ml-2 border border-gray-300 p-1 rounded-md focus:outline-none focus:border-blue-500 transition duration-200"
            />
          ) : (
            <span className="ml-2">{myInfo.nickname}</span>
          )}
        </div>
        <div className="text-sm mt-1">
          {!nickname.isValid && nickname.hasChecked && (
            <div className="text-green-600">중복확인이 완료 되었습니다.</div>
          )}
          {nickname.isValid && nickname.hasChecked && (
            <div className="text-red-600">중복된 닉네임이 있습니다.</div>
          )}
        </div>
        <div className="mt-2">
          {isEditingNickname ? (
            <>
              <button
                onClick={() => {
                  useUsersApiCall.checkNicknameDuplicate(nickname.value, nickname.setIsValid);
                  nickname.setHasChecked(true);
                }}
                disabled={
                  !nickname.isValid || !nickname.value || nickname.value === myInfo.nickname
                }
                className={`mr-2 py-1 px-4 text-white font-semibold rounded-md transition duration-200 ${!nickname.isValid || !nickname.value || nickname.value === myInfo.nickname ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
              >
                중복 확인
              </button>
              <button
                onClick={() => {
                  myInfo.setNickname(nickname.value);
                  useUsersApiCall.changeNickname(nickname.value);
                  myInfo.setNickname(nickname.value);
                  setIsEditingNickname(false);
                  nickname.setHasChecked(false);
                }}
                className={`mr-2 py-1 px-4 text-white font-semibold rounded-md transition duration-200 ${!(!nickname.isValid && nickname.hasChecked) ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                disabled={!(!nickname.isValid && nickname.hasChecked)}
              >
                수정 완료
              </button>
              <button
                onClick={() => {
                  setIsEditingNickname(false);
                  nickname.onChange(myInfo.nickname);
                }}
                className="py-1 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition duration-200"
              >
                취소
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditingNickname(true)}
              className="py-1 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition duration-200"
            >
              수정
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 font-semibold">전적 </div>
      <div className="mt-4 font-semibold">아이템</div>
      <div>점수 : {myInfo.itemPt} pt </div>
      <div>
        승률 : {myInfo.winNumItem}승 {myInfo.loseNumItem} 패{" "}
        {myInfo.winNumItem + myInfo.loseNumItem != 0
          ? Number(
              (
                (myInfo.winNumItem / (Number(myInfo.winNumItem) + Number(myInfo.loseNumItem))) *
                100
              ).toFixed(2)
            )
          : 0}
        %
      </div>
      <div className="mt-4 font-semibold">클래식 </div>
      <div>점수 : {myInfo.classicPt} pt </div>
      <div>
        승률 : {myInfo.winNumClassic}승 {myInfo.loseNumClassic} 패{" "}
        {myInfo.winNumClassic + myInfo.loseNumClassic != 0
          ? Number(
              (
                (myInfo.winNumClassic /
                  (Number(myInfo.winNumClassic) + Number(myInfo.loseNumClassic))) *
                100
              ).toFixed(2)
            )
          : 0}
        %
      </div>
      {/* 나머지 프로필 정보 */}
      <ProfileImageModal
        visible={isProfileImageModalVisible.value}
        onClose={isProfileImageModalVisible.hideRodal}
        setProfileImage={profileImage.setValue}
        setProfileImageIndex={profileImageIndex.setValue}
        myInfo={myInfo}
      />
    </div>
  );
};

export default Profile;
