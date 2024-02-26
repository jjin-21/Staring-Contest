import usersApiCall from "@/api/axios/usersApiCall";
import Rodal from "rodal";
import useFormField from "@/hooks/useFormField";
import ModalBackground from "@/assets/img/modal/ModalBackground.png";
import LoginTemplate2 from "@/assets/img/modal/LoginTemplate2.png";
import LoginTemplate4 from "@/assets/img/modal/LoginTemplate4.png";
import btn_main from "@/assets/img/btn_main.png";
import "rodal/lib/rodal.css";

const LoginFormModal = ({ visible, onClose }) => {
  const email = useFormField("");
  const password = useFormField("");
  const useUsersApiCall = usersApiCall();

  const login = async (event) => {
    event.preventDefault();
    await useUsersApiCall.login(email.value, password.value);
  };

  const clearAllInput = () => {
    email.clear();
    password.clear();
  };

  return (
    <div className="boxControl">
      <Rodal
        visible={visible}
        customStyles={{
          width: "80vw",
          height: "90vh",
          background: `url(${ModalBackground}) no-repeat center 23vh`,
          backgroundSize: "80vw 50vh",
          justifyContent: "center",
          alignItems: "center",
          padding: "0px",
        }}
        className="flex flex-col loginContent0"
        onClose={() => {
          clearAllInput();
          onClose();
        }}
      >
        <div className="ml-2vw mt-26vh text-center text-7vw text-amber-700 loginContent1">
          Welcome !
        </div>
        <form
          className="flex flex-col mx-auto items-center loginContent2"
          style={{
            background: `url(${LoginTemplate4}) no-repeat`,
            backgroundSize: "55vw 30vh",
            backgroundPosition: "center 4vh",
            height: "100%",
          }}
          onSubmit={login}
        >
          <div className="flex flex-col mt-11vh items-center loginContent3">
            <input
              id="email"
              placeholder="이메일"
              type="text"
              value={email.value}
              className="loginContent4 w-37vw h-5vh text-center border-2 border-black rounded-md focus:outline-none focus:ring focus:ring-black bg-transparent shadow placeholder-black"
              onChange={(e) => email.onChange(e.target.value)}
            />

            <input
              id="password"
              placeholder="비밀번호"
              type="password"
              value={password.value}
              className="loginContent4 w-37vw h-5vh text-center border-2 border-black rounded-md focus:outline-none focus:ring focus:ring-black bg-transparent text-sm shadow placeholder-black"
              onChange={(e) => password.onChange(e.target.value)}
            />

            <button
              className="w-15vw h-5vh text-3vw mt-2vh loginContent5"
              style={{
                background: `url(${btn_main}) no-repeat`,
                backgroundSize: "15vw 5vh",
                backgroundPosition: "center",
                color: "white",
                textShadow: "5px 5px 4px rgba(0,0,0,0.5)", // 텍스트 주위에 테두리 효과 추가
              }}
            >
              로그인
            </button>
          </div>
        </form>
      </Rodal>
    </div>
  );
};

export default LoginFormModal;
