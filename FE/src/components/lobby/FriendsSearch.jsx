import React, { useState } from "react";
import lobbyApiCall from "@/api/axios/lobbyApiCall";
import Pagination from "react-js-pagination";
import useShowRodal from "@/hooks/useShowRodal";
import ProfileModal from "@/components/modal/ProfileModal";

const FriendsSearch = () => {
  const useLobbyApiCall = lobbyApiCall();
  const [keyword, setKeyword] = useState("");
  const [friends, setFriends] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastFriend = currentPage * itemsPerPage;
  const [selectedUser, setSelectedUser] = useState(null);
  const isProfileModalVisible = useShowRodal();

  const indexOfFirstFriend = indexOfLastFriend - itemsPerPage;
  const currentFriends = friends.slice(indexOfFirstFriend, indexOfLastFriend);

  const handleChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = async (event) => {
    try {
      event.preventDefault();
      let data = await useLobbyApiCall.searchUsers(keyword);
      data = data.sort((a, b) => {
        if (a.nickname < b.nickname) {
          return -1;
        }
        if (a.nickname > b.nickname) {
          return 1;
        }
        return 0;
      });
      setFriends(data);
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openProfileModal = (user) => {
    setSelectedUser(user);
    isProfileModalVisible.showRodal();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">친구 찾기</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={keyword}
          onChange={handleChange}
          placeholder="검색어를 입력하세요"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3">
          확인
        </button>
      </form>
      <div>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">No.</th>
              <th className="border px-4 py-2">닉네임</th>
              <th className="border px-4 py-2">포인트(클래식/아이템)</th>
              <th className="border px-4 py-2">프로필</th>
            </tr>
          </thead>
          <tbody>
            {currentFriends.length > 0 ? (
              currentFriends.map((item, index) => (
                <tr key={item.nickname}>
                  <td className="border px-4 py-2">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="border px-4 py-2">{item.nickname}</td>
                  <td className="border px-4 py-2">
                    {item.classicPt} / {item.itemPt}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        openProfileModal(item);
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      프로필
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border px-4 py-2 text-center">
                  해당 닉네임을 가진 유저가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        activePage={currentPage}
        totalItemsCount={friends.length}
        itemsCountPerPage={itemsPerPage}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        itemClass="page-item"
        linkClass="page-link text-blue-500 hover:text-blue-600"
        innerClass="flex pl-0 rounded list-none flex-wrap justify-center space-x-2"
        activeClass="active bg-blue-500 text-white"
        firstPageText="처음"
        lastPageText="마지막"
      />
      <ProfileModal
        visible={isProfileModalVisible.value}
        user={selectedUser}
        onClose={isProfileModalVisible.hideRodal}
      />
    </div>
  );
};

export default FriendsSearch;
