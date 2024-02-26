import React, { useState, useEffect } from "react";
import lobbyApiCall from "@/api/axios/lobbyApiCall";
import Pagination from "react-js-pagination";

const FriendsRequest = ({ visible }) => {
  const useLobbyApiCall = lobbyApiCall();
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getFriendRequestList = async (currentPage) => {
    try {
      const response = await useLobbyApiCall.getFriendRequestList(currentPage);
      setFriendRequestList(response);
      setTotalItems(10);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (visible) {
      getFriendRequestList(currentPage);
    }
  }, [visible, currentPage]);

  const handleAccept = async (nickname) => {
    try {
      await useLobbyApiCall.acceptFriendRequest(nickname);
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  const handleReject = async (messageId) => {
    try {
      await useLobbyApiCall.rejectFriendRequest(nickname);
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  return (
    <>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                닉네임
              </th>
              <th scope="col" className="py-3 px-6">
                포인트(클래식/아이템)
              </th>
              <th scope="col" className="py-3 px-6">
                수락/거절
              </th>
            </tr>
          </thead>
          {friendRequestList.length > 0 ? (
            <tbody>
              {friendRequestList.map((request, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="py-4 px-6">{request.nickname}</td>
                  <td className="py-4 px-6">
                    {request.classicPt} / {request.itemPt}
                  </td>
                  <td>
                    <button onClick={() => handleAccept(request.nickname)}>수락</button>
                    {/* <button onClick={() => handleReject(messageId)}>거절</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td colSpan="3" className="py-4 px-6 text-center">
                  등록된 친구가 없습니다
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <Pagination
        activePage={currentPage}
        totalItemsCount={friendRequestList.length * 10}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        itemClass="page-item"
        linkClass="page-link text-blue-500 hover:text-blue-600"
        innerClass="flex pl-0 rounded list-none flex-wrap justify-center space-x-2"
        activeClass="active bg-blue-500 text-white"
        firstPageText="처음"
        lastPageText="마지막"
      />
    </>
  );
};

export default FriendsRequest;
