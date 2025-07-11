import React, { useEffect } from "react";
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import imageRegister from "../../ass/image/register.png";
import "./register.css";
import { getDetailsUser, loginUser } from "../../services/UserService";
import { useMutationHook } from "../../hooks/UserMutationHook";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUserRD } from "../../redux/slides/userSlice";
import ConfirmPassword from "../../components/ConfirmPassword/ConfirmPassword";

const SignIn = () => {
  const locasion = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModalConfirmPassword, setShowModalConfirmPassword] =
    useState(false);
  const mutation = useMutationHook((data) => loginUser(data));

  const { data, status } = mutation;

  const [fromData, setFromData] = useState({});

  const handleOnChange = (e) => {
    setFromData({
      ...fromData,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    if (data?.status === "ERR") {
      <error />;
    } else if (data?.status === "OK") {
      if (locasion?.state) {
        navigate(locasion?.state);
      } else {
        navigate("/");
      }
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      localStorage.setItem(
        "refresh_token",
        JSON.stringify(data?.refresh_token)
      );

      if (data?.access_token) {
        const decode = jwtDecode(data?.access_token);
        if (decode?.id) {
          handleGetDetailsUsers(decode?.id, data?.access_token);
        }
      }
      <success />;
    }
  }, [data]);

  
  

  const handleGetDetailsUsers = async (id, token) => {
    const strorage = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(strorage);
    const res = await getDetailsUser(id, token);
    dispatch(updateUserRD({ ...res?.data, access_token: token, refreshToken }));
  };

  const { email, password } = fromData;

  const handleFrom = (e) => {
    e.preventDefault();
  };
  const handleSigIn = () => {
    mutation.mutate({
      email,
      password,
    });
  };

  const handleClose = () => {
    setShowModalConfirmPassword(false);
  };

  return (
    <>
      {showModalConfirmPassword ? (
        <ConfirmPassword open={showModalConfirmPassword} close={handleClose} />
      ) : null}
      <div className=" bg-[rgba(0,0,0,0.53)] register justify-center items-center flex ">
        <div className="p-4 max-w-3xl mx-auto ">
          <div className="flex w-[800px]">
            <div className="z-10 w-3/5 px-[45px] pt-[40px] py-[24px] pb-5 bg-white rounded-l-lg dark:bg-[#242526]">
              <h1 className=" text-3xl ">Xin chào</h1>
              <p className="my-[10px]">Đăng nhập</p>

              <form onSubmit={handleFrom} className="flex flex-col gap-4">
                <input
                  className="p-3 focus:outline-none text-base border rounded-xl dark:text-black"
                  type="email"
                  id="email"
                  placeholder="Nhập email của bạn"
                  onChange={handleOnChange}
                />
                <input
                  className="p-3 focus:outline-none text-base border rounded-xl dark:text-black"
                  type="password"
                  id="password"
                  placeholder="Mật khẩu"
                  onChange={handleOnChange}
                />
                {data?.status === "ERR" && (
                  <span className=" text-red-600">{data?.message}!</span>
                )}
                {status === "pending" ? (
                  <LoadingComponent />
                ) : (
                  <button
                    onClick={handleSigIn}
                    className="bg-[rgb(255,66,78)] p-2 rounded-xl hover:opacity-70 transition-all cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                )}
              </form>
              <div className="flex mt-4 items-center justify-between">
                <div className="flex gap-1">
                  <p className="opacity-50">Bạn chưa có tài khoản?</p>
                  <Link to={"/register"}>
                    <samp className=" text-blue-700">Đăng kí</samp>
                  </Link>
                </div>
                <div
                  onClick={() => {
                    setShowModalConfirmPassword(true);
                  }}
                  className=" cursor-pointer"
                >
                  Quên mật khẩu
                </div>
              </div>
            </div>

            <div className=" bg-[#e7f4ff] flex justify-center items-center w-2/5 py-7 rounded-r-lg">
              <div>
                <img
                  className="w-[203px] my-auto mt-3"
                  src={imageRegister}
                  alt=""
                />
                <p className="text-[#0b74e5] text-center text-[17px] font-medium mt-4">
                  Mua sắm tại Tiki
                </p>
                <p className="text-[#0b74e5] text-center">
                  Siêu ưu đãi mỗi ngày
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
