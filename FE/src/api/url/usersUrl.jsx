import { baseUrl } from "@/api/url/baseUrl";

export default {
  signUp: () => "api/user/signup",
  login: () => "api/auth/login",
  logout: () => "api/auth/logout",
  checkEmailDuplicate: () => "api/user/check/email",
  checkNicknameDuplicate: () => "api/user/check/nickname",
  changeProfileImage: () => "api/user/profile-image",
  changeNickname: () => "api/user/nickname",
  changePassword: () => "api/user/password",
  deleteUser: () => "api/user",
  getFriendsList: () => "api/friend",
  getReissue: () => "api/auth/reissue",
};
