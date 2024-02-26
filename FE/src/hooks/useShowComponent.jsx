import { useState } from "react";

const useShowComponent = () => {
  const [value, setValue] = useState(false);

  const showComponent = () => {
    setValue(true);
  };

  const hideComponent = () => {
    setValue(false);
  };

  return {
    value,
    showComponent,
    hideComponent,
  };
};

export default useShowComponent;
