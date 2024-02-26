import lobbyUrl from "@/api/url/lobbyUrl";
import userUrl from "@/api/url/usersUrl";
import useAxiosConfig from "@/hooks/useAxiosConfig";

const lobbyApiCall = () => {
  const privateAxios = useAxiosConfig().privateAxios;
  // const { client } = useWebSocket();

  const getFriendsList = async (pageNum) => {
    const getFriendsUrl = `${userUrl.getFriendsList()}/${pageNum}`;
    try {
      const response = await privateAxios.get(getFriendsUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getRankingList = async (type, pageNum) => {
    const getRankUrl = `${lobbyUrl.getRankingList()}/${type}/${pageNum}`;
    try {
      const response = await privateAxios.get(getRankUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const searchUsers = async (keyword) => {
    const searchUsersUrl = `${lobbyUrl.searchUsers()}?searchWord=${keyword}`;
    try {
      const response = await privateAxios.get(searchUsersUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // const addFriendRequest = async (email) => {
  //   const addFriendUrl = lobbyUrl.addFriend();
  //   try {
  //     const response = await client.publish(addFriendUrl, {
  //       email,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  const getFriendRequestList = async () => {
    const getFriendRequestListUrl = lobbyUrl.getFriendRequestList();
    try {
      const response = await privateAxios.get(getFriendRequestListUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const acceptFriendRequest = async (userFrom) => {
    const acceptFriendRequestUrl = lobbyUrl.acceptFriendRequest();
    try {
      const response = await privateAxios.post(acceptFriendRequestUrl, {
        userFrom,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const rejectFriendRequest = async (messageId) => {
    const rejectFriendRequestUrl = `${lobbyUrl.rejectFriendRequest(messageId)}`;
    try {
      const response = await privateAxios.delete(rejectFriendRequestUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getFriendsList,
    getRankingList,
    searchUsers,
    acceptFriendRequest,
    getFriendRequestList,
    rejectFriendRequest,
  };
};

export default lobbyApiCall;
