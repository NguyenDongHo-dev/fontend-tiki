import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imageRegister from "../../ass/image/register.png";
import "./register.css";
import { useMutationHook } from "../../hooks/UserMutationHook";
import { sigupUser } from "../../services/UserService";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { success, error } from "../../components/Message/Message";

const Register = () => {
  const navigate = useNavigate();

  const mutation = useMutationHook((data) => sigupUser(data));

  const { data, status } = mutation;

  useEffect(() => {
    if (data?.status === "ERR") {
      error();
    } else if (data?.status === "OK") {
      success();
      navigate("/login");
    }
  }, [data]);

  const [fromData, setFromData] = useState({});

  const handleOnChange = (e) => {
    setFromData({
      ...fromData,
      [e.target.id]: e.target.value,
    });
  };

  const { email, password, confirmPassword } = fromData;

  const handleFrom = (e) => {
    e.preventDefault();
    mutation.mutate({
      email,
      password,
      confirmPassword,
    });
  };

  

  return (
    <div className=" bg-[rgba(0,0,0,0.53)] register justify-center items-center flex">
      <div className="p-4 max-w-3xl mx-auto ">
        <div className="flex w-[800px]">
          <div className="z-10 w-3/5 px-[45px] pt-[40px] py-[24px] pb-5 bg-white rounded-l-lg dark:bg-[#242526]">
            <h1 className=" text-3xl ">Xin chào</h1>
            <p className="my-[10px]">Tạo tài khoản</p>

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
              <input
                className="p-3 focus:outline-none text-base border rounded-xl dark:text-black"
                type="password"
                id="confirmPassword"
                placeholder="Xác nhận lại mật khẩu"
                onChange={handleOnChange}
              />
              {data?.status === "ERR" && (
                <span className=" text-red-500">{data?.message}</span>
              )}
              {status === "pending" ? (
                <LoadingComponent />
              ) : (
                <button className="bg-[rgb(255,66,78)] p-2 rounded-xl hover:opacity-70 transition-all cursor-pointer">
                  Đăng Kí
                </button>
              )}
            </form>
            <div className="flex gap-1 mt-4 ">
              <p className="opacity-50">Bạn đã có tài khoản?</p>
              <Link to={"/login"}>
                <samp className=" text-blue-700">Đăng nhập</samp>
              </Link>
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
              <p className="text-[#0b74e5] text-center">Siêu ưu đãi mỗi ngày</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
