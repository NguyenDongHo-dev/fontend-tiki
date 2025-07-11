import React, { useRef, useState } from "react";
import {
  ConfirmPasswordUser,
  newPassword,
  senOTP,
  verifyOtp,
} from "../../services/UserService";
import logo from "../../ass/image/logo.png";
import { useEffect } from "react";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { data } from "autoprefixer";
import { useNavigate } from "react-router";

let current = 0;
const ConfirmPassword = ({ open = false, close }) => {
  const [email, setEmail] = useState({});
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [dataConfirmPassword, setDataConfirmPassword] = useState({});
  const [err, setErr] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [idUser, setIdUser] = useState();
  const [loading, setLoading] = useState(false);

  let ref = useRef();
  const fetchSenOtp = async (email) => {
    setLoading(true);
    const res = await senOTP(email);
    if (res?.status === "ERR") {
      setErr(res?.message);
      setLoading(false);
    } else {
      setLoading(false);

      setShowOtp(true);
      setErr(null);
      ref.current = res.data.userId;
    }
  };

  const fetchVerifyOtp = async (otp) => {
    const res = await verifyOtp(otp);
    if (res?.status === "ERR") {
      setErr(res?.message);
    } else {
      setIdUser(res.data);
      setErr(null);
    }
  };

  const fetchNewPassWord = async (data) => {
    const res = await newPassword(data);
    if (res?.status === "ERR") {
      setErr(res?.message);
    } else {
      alert("Thay đổi mật khẩu thành công");
      close();
    }
  };

  let inputRef = useRef();

  const handleOnChange = (e) => {
    const { value } = e.target;
    let newOtp = [...otp];
    newOtp[current] = value.substring(value.length - 1);
    if (!value) {
      setActiveOtpIndex(current - 1);
    } else {
      setActiveOtpIndex(current + 1);
    }
    setOtp(newOtp);
  };

  const handleChangeNewPassword = (e) => {
    setDataConfirmPassword({
      ...dataConfirmPassword,
      [e.target.id]: e.target.value,
    });
  };

  const handleOnKeyDown = ({ key }, index) => {
    current = index;
    if (key === "Backspace") setActiveOtpIndex(current - 1);
  };
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  const handleConfirmPassword = (e) => {
    e.preventDefault();
    fetchSenOtp({
      email,
    });
  };

  const handleVerifyOtp = () => {
    const stringOtp = otp.join("");
    fetchVerifyOtp({ otp: stringOtp, id: ref.current });
  };

  const handleNewPassWord = () => {
    fetchNewPassWord({
      confirmPassword: dataConfirmPassword.ConfirmPassword,
      password: dataConfirmPassword.password,
      id: idUser,
    });
  };
  return open ? (
    <div>
      <div
        className="relative z-50"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg dark:bg-[#242526] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[500px]">
              <div className="bg-white dark:bg-[#242526] ">
                <h1 className=" text-center font-semibold text-lg mt-5">
                  Khôi phục mật khẩu
                </h1>
                <div className="mt-3 ">
                  {showOtp ? (
                    <>
                      <div
                        onClick={() => {
                          setShowOtp(false);
                          setErr(null);
                        }}
                        className=" cursor-pointer -mt-[60px] p-1 ml-2 "
                      >
                        <IoChevronBackCircleOutline size={30} color="back" />
                      </div>
                      <div className="flex items-center justify-center">
                        <img
                          className="w-[80px] object-contain "
                          src={logo}
                          alt=""
                        />
                      </div>
                      {idUser ? (
                        <div className="pt-1  pb-4 px-4 flex flex-col gap-5">
                          <div className="flex flex-col gap-2">
                            <label htmlFor="password" className=" font-medium">
                              Nhập mật khẩu mới:
                            </label>
                            <input
                              id="password"
                              className="w-full rounded dark:text-black"
                              type="text"
                              placeholder="Mật khẩu mới"
                              onChange={handleChangeNewPassword}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="ConfirmPassword"
                              className=" font-medium"
                            >
                              Xác nhận mật khẩu mới:
                            </label>
                            <input
                              type="text"
                              id="ConfirmPassword"
                              className="w-full rounded dark:text-black"
                              placeholder="Xác nhận mật khẩu mới"
                              onChange={handleChangeNewPassword}
                            />
                          </div>
                          <button
                            onClick={handleNewPassWord}
                            className=" px-4  mx-auto bg-[rgb(11,116,229)] rounded py-1"
                          >
                            Xác nhận
                          </button>
                        </div>
                      ) : (
                        <div className="py-3 px-4 flex flex-col gap-4">
                          <div className="text-center font-semibold">
                            Xác nhận mã OTP
                          </div>
                          <div>
                            Mã đã được gửi vào email. Vui lòng vào Email để lấy
                            mã OTP
                          </div>
                          <div className="flex items-center gap-3 mx-auto">
                            {otp.map((_, index) => {
                              return (
                                <input
                                  ref={
                                    index === activeOtpIndex ? inputRef : null
                                  }
                                  key={index}
                                  onChange={handleOnChange}
                                  type="number"
                                  value={otp[index]}
                                  onKeyDown={(e) => handleOnKeyDown(e, index)}
                                  className=" w-[40px] dark:text-black h-[40px] focus:outline-none rounded text-center"
                                />
                              );
                            })}
                          </div>
                          {err && (
                            <samp className=" p-2 text-red-500 text-base">
                              {err}
                            </samp>
                          )}
                          <button
                            onClick={handleVerifyOtp}
                            className=" px-4   mx-auto bg-[rgb(11,116,229)] rounded py-1"
                          >
                            Xác nhận
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <form onSubmit={handleConfirmPassword}>
                      <div className="p-4 flex flex-col gap-4">
                        <div className="flex gap-4 items-center">
                          <label className=" ">Email:</label>
                          <input
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            className=" focus:outline-none dark:text-black border-[1px] p-2 rounded-md w-full"
                            type="email"
                            placeholder="Nhập email cần khôi phục"
                          />
                        </div>
                      </div>
                      {err && (
                        <samp className=" p-4 text-red-500 text-base">
                          {err}
                        </samp>
                      )}

                      <div className="flex justify-end mt-7 dark:bg-[#18191a] bg-gray-50 p-4 ">
                        <button
                          onClick={close}
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                          Hủy
                        </button>
                        <div className="flex items-center">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                          >
                            {loading ? "Loading..." : "Tiếp tục"}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ConfirmPassword;
