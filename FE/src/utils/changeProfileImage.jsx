import profileImage1 from "../assets/img/profile/bird1.png";
import profileImage2 from "../assets/img/profile/bird2.png";
import profileImage3 from "../assets/img/profile/bird3.png";
import profileImage4 from "../assets/img/profile/bird4.png";

const changeProfileImage = () => {
  const profileImages = {
    1: profileImage1,
    2: profileImage2,
    3: profileImage3,
    4: profileImage4,
  };

  const profileImagePath = (index) => {
    return profileImages[index];
  };

  return {
    profileImagePath,
  };
};

export default changeProfileImage;
