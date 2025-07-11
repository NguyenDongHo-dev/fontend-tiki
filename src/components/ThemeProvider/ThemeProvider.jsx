import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveTheme } from "../../redux/slides/themeSlice";

const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();

  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const resust = storageTheme();

    dispatch(saveTheme(resust));
  }, [theme]);

  const storageTheme = () => {
    let storageData = localStorage.getItem("theme");
    return storageData;
  };

  return (
    <div className={theme}>
      <div className=" bg-white text-black dark:text-[#e4e6eb] dark:bg-[#242526]">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
