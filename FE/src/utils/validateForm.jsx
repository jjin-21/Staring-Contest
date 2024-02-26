export const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const validateNickname = (nickname) => {
  const re = /^[a-zA-Z0-9가-힣]{1,6}$/;
  return re.test(nickname);
};

export const validatePassword = (password) => {
  const re = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!?@#$%^&*]{6,}$/;
  return re.test(password);
};
