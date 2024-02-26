import background_pirate_home from "../assets/img/background_pirate_home.png";

const HomeLayout = ({ children }) => {
  return (
    <div
      className="w-full h-screen md:max-w-md md:h-screen border-2 border-black mx-auto"
      style={{
        backgroundImage: `url(${background_pirate_home})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
};

export default HomeLayout;
