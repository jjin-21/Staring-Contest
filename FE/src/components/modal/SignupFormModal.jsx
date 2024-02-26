import React, { useState } from "react";
import ProfileImageModal from "@/components/modal/ProfileImageModal";
import ModalBtn from "@/components/modal/ModalBtn";
import usersApiCall from "@/api/axios/usersApiCall";
import useFormField from "@/hooks/useFormField";
import Rodal from "rodal";
import useShowRodal from "@/hooks/useShowRodal";
import "rodal/lib/rodal.css";
import LobbyBtn from "@/components/lobby/LobbyBtn";
import { validateEmail, validateNickname, validatePassword } from "@/utils/validateForm";
import ModalBackground from "@/assets/img/modal/ModalBackground.png";
import imageSelectBtn from "@/assets/img/modal/button2.png";
import LoginTemplate4 from "@/assets/img/modal/LoginTemplate4.png";
import logo from "@/assets/img/modal/logo.png";

const SignupFormModal = ({ visible, onClose }) => {
  const isProfileImageModalVisible = useShowRodal();
  const email = useFormField("", validateEmail);
  const nickname = useFormField("", validateNickname);
  const password = useFormField("", validatePassword);
  const passwordCheck = useFormField("");
  const profileImage = useFormField("");
  const ProfileImageIndex = useFormField("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const useUsersApiCall = usersApiCall();

  const signup = (event) => {
    event.preventDefault();
    useUsersApiCall.signup(ProfileImageIndex.value, email.value, password.value, nickname.value);
  };

  const passwordHandleChange = (event) => {
    password.onChange(event.target.value);
    validatePasswords(event.target.value, passwordCheck.value);
  };

  const passwordCheckHandleChange = (event) => {
    passwordCheck.onChange(event.target.value);
    validatePasswords(password.value, event.target.value);
  };

  const validatePasswords = (password, passwordCheck) => {
    if (passwordCheck === "") {
      return setPasswordsMatch(false);
    }
    setPasswordsMatch(password === passwordCheck);
  };

  const checkEmailDuplicate = async (event) => {
    try {
      event.preventDefault();
      await useUsersApiCall.checkEmailDuplicate(email.value, email.setIsValid);
      email.setHasChecked(true);
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  const checkNicknameDuplicate = async (event) => {
    try {
      event.preventDefault();
      await useUsersApiCall.checkNicknameDuplicate(nickname.value, nickname.setIsValid);
      nickname.setHasChecked(true);
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  const clearAllInput = () => {
    email.clear();
    nickname.clear();
    password.clear();
    passwordCheck.clear();
    profileImage.clear();
    ProfileImageIndex.clear();
    setPasswordsMatch(false);
  };

  return (
    <div className="boxControl">
      <Rodal
        visible={visible}
        customStyles={{
          width: "95vw",
          height: "90vh",
          background: `url(${ModalBackground}) no-repeat center center`,
          backgroundSize: "95vw 90vh",
        }}
        onClose={() => {
          clearAllInput();
          onClose();
        }}
        className="signup0"
      >
        <div className="flex flex-col">
          <img
            src={logo}
            alt="logoImage"
            style={{ width: "60vw", height: "13vh" }}
            className="ms-6vw mt-3vh self-center signup1"
          />
          <div className="mt-5vh signup2">
            <div className="flex flex-col items-center">
              <div
                style={{
                  background: `url(${LoginTemplate4}) no-repeat center center`,
                  backgroundSize: "40vw 15vh",
                  width: "40vw",
                  height: "15vh",
                }}
                className="flex justify-center items-center signup2-1"
              >
                {profileImage.value ? (
                  <img
                    src={profileImage.value}
                    alt="프로필 이미지"
                    className="w-30vw h-15vh signup2-2"
                  />
                ) : (
                  <div className="bg-gray-400 rounded-full w-16vw h-8vh signup2-3"></div>
                )}
              </div>
              <button
                onClick={isProfileImageModalVisible.showRodal}
                style={{
                  background: `url(${imageSelectBtn}) no-repeat`,
                  backgroundSize: "40vw 5vh",
                  backgroundPosition: "center center",
                  width: "40vw",
                  height: "3vh",
                }}
                className="mt-1vh flex justify-center items-center signup2-4"
              >
                캐릭터 선택
              </button>
            </div>
            <div className="flex flex-col mt-5vh ms-3vw">
              <div className="flex flex-col">
                <div className="flex ms-6vw signup3-1">
                  <label htmlFor="email1" className="text-4vw font-bold signup3-2">
                    이메일 :
                  </label>
                  <input
                    id="email1"
                    type="text"
                    value={email.value}
                    style={{ width: "30vw", height: "3vh" }}
                    className="signup3-3 ms-3vw border-2 border-amber-700 rounded-md focus:outline-none focus:ring focus:ring-amber-700 bg-transparent shadow"
                    onChange={(e) => email.onChange(e.target.value)}
                  />

                  <button
                    onClick={checkEmailDuplicate}
                    disabled={!email.isValid || !email.value}
                    className={`signup3-4 ms-3vw text-xs p-1vw border-2 rounded-md flex items-center justify-center ${
                      !email.isValid || !email.value
                        ? "border-orange-700"
                        : "border-amber-700 bg-amber-700 text-white"
                    }`}
                  >
                    중복 확인
                  </button>
                </div>
                <div className="ms-8vw signup3-5">
                  <div className="text-sm text-green-500">
                    {!email.isValid && email.hasChecked && (
                      <div style={{ color: "green" }}>중복확인이 완료 되었습니다.</div>
                    )}{" "}
                  </div>
                  <div className="text-sm text-red-500">
                    {email.isValid && email.hasChecked && (
                      <div style={{ color: "red" }}>중복된 이메일이 있습니다.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col mt-1vh">
                <div className="flex ms-6vw signup3-1">
                  <label htmlFor="nickname" className="text-4vw font-bold signup3-2">
                    닉네임 :
                  </label>
                  <input
                    id="nickname"
                    type="text"
                    value={nickname.value}
                    style={{ width: "30vw", height: "3vh" }}
                    className="signup3-3 ms-3vw border-2 border-amber-700 rounded-md focus:outline-none focus:ring focus:ring-amber-700 bg-transparent shadow"
                    onChange={(e) => nickname.onChange(e.target.value)}
                  />

                  <button
                    onClick={checkNicknameDuplicate}
                    disabled={!nickname.isValid || !nickname.value}
                    className={`signup3-4 ms-3vw text-xs p-1vw border-2 rounded-md flex items-center justify-center ${
                      !nickname.isValid || !nickname.value
                        ? "border-orange-700"
                        : "border-amber-700 bg-amber-700 text-white"
                    }`}
                  >
                    중복 확인
                  </button>
                </div>
                <div className="ms-15vw signup3-5">
                  {!(!nickname.isValid && nickname.hasChecked) && (
                    <div className="mt-1 text-xs text-amber-800 font-semibold">
                      ※ 닉네임은 최대 6자까지 가능합니다.
                    </div>
                  )}

                  <div className="text-sm text-green-600">
                    {!nickname.isValid && nickname.hasChecked && (
                      <div style={{ color: "green" }}>중복확인이 완료 되었습니다.</div>
                    )}
                  </div>
                  <div className="text-sm text-red-600">
                    {nickname.isValid && nickname.hasChecked && (
                      <div style={{ color: "red" }}>중복된 닉네임이 있습니다.</div>
                    )}
                  </div>
                </div>
              </div>

              <form className="mt-2vh flex flex-col">
                <div className="flex ms-6vw signup3-1">
                  <label htmlFor="password1" className="text-4vw font-bold signup3-2">
                    비밀번호 :
                  </label>
                  <input
                    id="password1"
                    type="password"
                    value={password.value}
                    style={{ width: "30vw", height: "3vh" }}
                    className="signup3-3 ms-3vw border-2 border-amber-700 rounded-md focus:outline-none focus:ring focus:ring-amber-700 bg-transparent shadow"
                    onChange={passwordHandleChange}
                  />
                </div>
                <div className="signup3-5 ms-15vw mt-1 text-xs text-amber-800 font-semibold">
                  ※ 비밀번호는 영문자 숫자의
                  <br /> 조합으로 6자리 이상 입력해주세요
                </div>
                <div className="mt-1vh flex ms-6vw signup3-1">
                  <label htmlFor="passwordCheck" className="text-4vw font-bold signup3-2">
                    비밀번호 확인 :
                  </label>
                  <input
                    id="passwordCheck"
                    type="password"
                    value={passwordCheck.value}
                    style={{ width: "30vw", height: "3vh" }}
                    className="signup3-3 ms-3vw border-2 border-amber-700 rounded-md focus:outline-none focus:ring focus:ring-amber-700 bg-transparent shadow"
                    onChange={passwordCheckHandleChange}
                  />
                </div>
                {!passwordsMatch && passwordCheck.value && (
                  <div className="text-red-600 ms-15vw mt-1vh signup3-5">
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
              </form>

              <button
                onClick={signup}
                disabled={
                  email.isValid ||
                  nickname.isValid ||
                  !passwordsMatch ||
                  !password.isValid ||
                  !ProfileImageIndex.value
                }
                className={`signup4 mt-1vh w-30vw h-5vh self-center text-sm border-4 rounded-md ${
                  email.isValid ||
                  nickname.isValid ||
                  !passwordsMatch ||
                  !password.isValid ||
                  !ProfileImageIndex.value
                    ? "border-orange-700"
                    : "border-amber-700 bg-amber-700 text-white"
                }`}
              >
                회원 가입
              </button>

              {/* <ModalBtn
                onClick={signup}
                type="submit"
                text="회원가입"
                disabled={
                  email.isValid ||
                  nickname.isValid ||
                  !passwordsMatch ||
                  !password.isValid ||
                  !ProfileImageIndex.value
                }
                className="text-xs border-2 border-orange-300 rounded-md flex items-center justify-center"
                style={{ width: "8vw", height: "5vh" }}
              /> */}
            </div>
          </div>
        </div>
      </Rodal>

      <ProfileImageModal
        visible={isProfileImageModalVisible.value}
        onClose={isProfileImageModalVisible.hideRodal}
        setProfileImage={profileImage.setValue}
        setProfileImageIndex={ProfileImageIndex.setValue}
      />
    </div>
  );
};

export default SignupFormModal;
