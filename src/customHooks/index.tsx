import { useEffect, useState } from "react";

export const useDebounce = (value = "", delay = 400) => {
  let [respData, setRespData] = useState("");

  useEffect(() => {
    let timeOutId = setTimeout(() => {
      setRespData(value);
    }, delay);
    return () => clearTimeout(timeOutId);
  }, [value, delay]);
  return respData;
};
