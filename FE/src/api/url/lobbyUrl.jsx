import { baseUrl } from "@/api/url/baseUrl";

export default {
  getRankingList: () => "api/point/rank",
  searchUsers: () => "api/user/search",

  //웹소켓 메시지 매핑 (친구추가 버튼 눌렀을 때 가는 Url)
  addFriendRequest: () => `${baseUrl}/api/message/private`,

  //친구 수락을 눌렀을 때 보내야 하는 api 2가지 (두개 합쳐준다고 함)
  addFriend: () => `${baseUrl}/api/friend`, //친구관계 등록
  acceptFriendRequest: () => `${baseUrl}/api/message/friend`, //친구 메시지 삭제 및 상대방 친구 수락 알림

  //친구 요청 메시지 받아오는 url (명세에 생성해준다고 하심)
  getFriendRequestList: () => `${baseUrl}/api/message`,

  //친구 요청 메시지 거절하는 url
  rejectFriendRequest: (messageId) => `${baseUrl}/api/message/${messageId}`,
};
