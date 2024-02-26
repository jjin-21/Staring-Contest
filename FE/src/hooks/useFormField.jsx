import { useState } from "react";

const useFormField = (initialValue, validator) => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const onChange = (newValue) => {
    setValue(newValue);
    if (validator) {
      setIsValid(validator(newValue));
    }
    setHasChecked(false);
  };

  const clear = () => {
    setValue("");
    setIsValid(false);
    setHasChecked(false);
  };

  return {
    value,
    isValid,
    hasChecked,
    onChange,
    setValue,
    setIsValid,
    setHasChecked,
    clear,
  };
};

export default useFormField;
