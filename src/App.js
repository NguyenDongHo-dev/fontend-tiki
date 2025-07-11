import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import { axiosJwt, getDetailsUser, refreshToken } from "./services/UserService";
import { resetUser, updateUserRD } from "./redux/slides/userSlice";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
  }, []);

  const handleDecoded = () => {
    let storageData =
      user?.access_token || localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  axiosJwt.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      let storageRefreshToken = localStorage.getItem("refresh_token");
      const refresh_Token = JSON.parse(storageRefreshToken);
      const decodeRefreshToken = jwtDecode(refresh_Token);
      
      
      if (decoded?.exp < currentTime.getTime() / 1000) {
        if (decodeRefreshToken?.exp > currentTime.getTime() / 1000) {
          const data = await refreshToken(refresh_Token);
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } else {
          dispatch(resetUser());
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  
  

  const handleGetDetailsUser = async (id, token) => {
    let storeRefreshToken = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storeRefreshToken);
    const res = await getDetailsUser(id, token);
    dispatch(updateUserRD({ ...res?.data, access_token: token, refreshToken }));
  };

  return (
    <Router>
      <Routes>
        {routes.map((page) => {
          const Page = page.page;
          const checkAuth = !page.isPrivate || user.isAdmin;
          const Layout = page.isShowHeader ? DefaultComponent : Fragment;

          return (
            <Route
              key={page.path}
              path={checkAuth ? page.path : undefined}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
