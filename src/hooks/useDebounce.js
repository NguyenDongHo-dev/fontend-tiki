import { useEffect, useState } from "react";

export const useDebounce = (value = undefined , delay) => {
  const [valueDebounce, setValueDebounce] = useState("");
  useEffect(() => {
    const handle = setTimeout(() => {
      setValueDebounce(value);
    }, [delay]);
    return () => {
      clearTimeout(handle);
    };
  }, [value]);
  return valueDebounce;
};
