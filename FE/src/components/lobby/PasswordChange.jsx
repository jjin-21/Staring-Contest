import React, { useState } from "react";
import usersApiCall from "@/api/axios/usersApiCall";
import useFormField from "@/hooks/useFormField";
import { validatePassword } from "@/utils/validateForm";

const PasswordChange = () => {
  const currentPassword = useFormField("");
  const newPassword = useFormField("", validatePassword);
  const newPasswordCheck = useFormField("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const useUsersApiCall = usersApiCall();

  const passwordHandleChange = (event) => {
    newPassword.onChange(event.target.value);
    validatePasswords(event.target.value, newPasswordCheck.value);
  };

  const passwordCheckHandleChange = (event) => {
    newPasswordCheck.onChange(event.target.value);
    validatePasswords(newPassword.value, event.target.value);
  };

  const validatePasswords = (newPassword, newPasswordCheck) => {
    if (newPasswordCheck === "") {
      return setPasswordsMatch(false);
    }
    setPasswordsMatch(newPassword === newPasswordCheck);
  };

  const onClick = (e) => {
    e.preventDefault();
    useUsersApiCall.changePassword(currentPassword.value, newPassword.value);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <div className="space-y-4">
        <form>
          <div>
            기존 비밀번호:
            <input
              type="password"
              value={currentPassword.value}
              onChange={(e) => currentPassword.onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            새 비밀번호:
            <input
              type="password"
              value={newPassword.value}
              onChange={passwordHandleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            새 비밀번호 확인:
            <input
              type="password"
              value={newPasswordCheck.value}
              onChange={passwordCheckHandleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </form>
        {!passwordsMatch && newPasswordCheck.value && (
          <div className="text-red-500">비밀번호가 일치하지 않습니다</div>
        )}
        <button
          type="submit"
          onClick={onClick}
          disabled={!passwordsMatch || !newPasswordCheck.value || !currentPassword.value}
          className={`mr-2 py-1 px-4 text-white font-semibold rounded-md transition duration-200 ${!passwordsMatch || !newPasswordCheck.value || !currentPassword.value ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
};

export default PasswordChange;
