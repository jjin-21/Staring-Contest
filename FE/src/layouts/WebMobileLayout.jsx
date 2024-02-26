import background_pirate from "../assets/img/background_pirate.png";

const WebMobileLayout = ({ children }) => {
  return (
    <div className="w-full h-screen md:max-w-md md:h-screen border-1 border-black mx-auto overflow-hidden">
      {children}
    </div>
  );
};

export default WebMobileLayout;
