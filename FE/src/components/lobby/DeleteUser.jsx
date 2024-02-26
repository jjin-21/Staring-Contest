import React, { useState } from "react";
import useFormField from "@/hooks/useFormField";
import { validatePassword } from "@/utils/validateForm";
import usersApiCall from "@/api/axios/usersApiCall";

const DeleteUser = () => {
  const password = useFormField("", validatePassword);
  const passwordCheck = useFormField("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const useUsersApiCall = usersApiCall();

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

  return (
    <div className="w-1/2 mx-auto">
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호:</label>
          <input
            type="password"
            value={password.value}
            onChange={passwordHandleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호 확인:</label>
          <input
            type="password"
            value={passwordCheck.value}
            onChange={passwordCheckHandleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </form>
      {!passwordsMatch && passwordCheck.value && (
        <div className="text-red-500">비밀번호가 일치하지 않습니다</div>
      )}
      <button
        onClick={() => useUsersApiCall.deleteUser(password.value)}
        disabled={!passwordsMatch || !passwordCheck.value}
        className={`mr-2 py-1 px-4 text-white font-semibold rounded-md transition duration-200 ${!passwordsMatch || !passwordCheck.value ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default DeleteUser;
