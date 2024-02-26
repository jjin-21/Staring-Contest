import usersUrl from "@/api/url/usersUrl";
import { useNavigate } from "react-router-dom";
import { useAccessTokenState } from "@/context/AccessTokenContext";
import { useWebSocket } from "@/context/WebSocketContext";
import useAxiosConfig from "@/hooks/useAxiosConfig";

const usersApiCall = () => {
  const navigate = useNavigate();
  const accessToken = useAccessTokenState();
  const webSocket = useWebSocket();
  const privateAxios = useAxiosConfig().privateAxios;

  const signup = async (profileImage, email, password, nickname) => {
    const body = { profileImage, email, password, nickname };
    try {
      const response = await privateAxios.post(usersUrl.signUp(), body);
      await login(email, password, accessToken.accessToken);
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  const checkEmailDuplicate = async (email, setIsEmailValid) => {
    const url = usersUrl.checkEmailDuplicate() + "?email=" + email;
    try {
      const response = await privateAxios.get(url);
      if (response.data.check === false) {
        setIsEmailValid(true);
      } else if (response.data.check === true) {
        setIsEmailValid(false);
      }
    } catch (error) {
      throw error;
    }
  };

  const checkNicknameDuplicate = async (nickname, setIsNicknameValid) => {
    const url = usersUrl.checkNicknameDuplicate() + "?nickname=" + nickname;
    try {
      const response = await privateAxios.get(url);
      if (response.data.check === false) {
        setIsNicknameValid(true);
      } else if (response.data.check === true) {
        setIsNicknameValid(false);
      }
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    const url = usersUrl.login();
    const body = { email, password };
    try {
      const response = await privateAxios.post(url, body);
      accessToken.setAccessToken(response.data.accessToken);
      accessToken.setRefreshToken(response.data.refreshToken);
      accessToken.setEmail(response.data.email);
      accessToken.setNickname(response.data.nickname);
      accessToken.setProfileImageIndex(response.data.profileImage);
      accessToken.setClassicPt(response.data.classicPt);
      accessToken.setItemPt(response.data.itemPt);
      accessToken.setWinNumItem(response.data.winNumItem);
      accessToken.setLoseNumItem(response.data.loseNumItem);
      accessToken.setWinNumClassic(response.data.winNumClassic);
      accessToken.setLoseNumClassic(response.data.loseNumClassic);
      navigate("/lobby");
    } catch (error) {
      alert("이메일 또는 비밀번호가 정확하지 않습니다. 다시 시도해 주세요.");
    }
  };

  const logout = async () => {
    const url = usersUrl.logout();
    const body = {
      grantType: "Bearer",
      accessToken: accessToken.accessToken,
      refreshToken: accessToken.refreshToken,
    };

    try {
      await privateAxios.post(url, body);
      alert("로그아웃 되었습니다.");
      accessToken.clear(() => {
        webSocket.client.deactivate();
      });
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  const changeProfileImage = async (profileImage) => {
    const url = usersUrl.changeProfileImage();
    try {
      const response = await privateAxios.patch(url, {
        profileImage,
      });
    } catch (error) {
      alert(error.response);
    }
  };

  const changeNickname = async (nickname) => {
    const url = usersUrl.changeNickname();
    try {
      const response = await privateAxios.patch(url, {
        nickname,
      });
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const url = usersUrl.changePassword();

    try {
      const response = await privateAxios.patch(url, {
        currentPassword,
        newPassword,
      });
      alert("비밀번호가 수정 되었습니다");
      logout();
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  const deleteUser = async (password) => {
    const url = usersUrl.deleteUser();
    try {
      const response = await privateAxios.patch(url, { password });
      alert("회원이 탈퇴 되었습니다.");
      accessToken.clear();
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  return {
    signup,
    checkEmailDuplicate,
    checkNicknameDuplicate,
    login,
    logout,
    changeProfileImage,
    changeNickname,
    changePassword,
    deleteUser,
  };
};

export default usersApiCall;
