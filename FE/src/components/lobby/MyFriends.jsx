import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import lobbyApiCall from "@/api/axios/lobbyApiCall";
import "rodal/lib/rodal.css";

const MyFriends = ({ visible }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [friends, setFriends] = useState([]);
  const [isOnline, setIsOnline] = useState([]);

  const [totalItems, setTotalItems] = useState(0);

  const useLobbyApiCall = lobbyApiCall();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getFriends = async (currentPage) => {
    try {
      const response = await useLobbyApiCall.getFriendsList(currentPage);
      setFriends(response);
      setTotalItems(10);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (visible) {
      getFriends(currentPage);
    }
  }, [visible, currentPage]);

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
                접속중
              </th>
            </tr>
          </thead>
          {friends.length > 0 ? (
            <tbody>
              {friends.map((friend, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="py-4 px-6">{friend.nickname}</td>
                  <td className="py-4 px-6">
                    {friend.classicPt} / {friend.itemPt}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${friend.isOnline ? "bg-green-500" : "bg-gray-500"}`}
                    ></span>
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
        totalItemsCount={friends.length * 10}
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

export default MyFriends;
