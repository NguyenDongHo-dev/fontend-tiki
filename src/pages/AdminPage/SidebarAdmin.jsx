import React, { useState } from "react";
import { FaUser, FaProductHunt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BsCartCheckFill } from "react-icons/bs";
import { logoutUser } from "../../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../../redux/slides/userSlice.js";
import { resetOrder } from "../../redux/slides/oderSlice";
import { FaHackerNews } from "react-icons/fa";

const SidebarAdmin = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutUser(user?.id, user?.access_token);
    navigate("/");
    dispatch(resetUser());
    dispatch(resetOrder());
  };
  return (
    <div className="">
      <span className="absolute text-white text-4xl  cursor-pointer">
        <i className="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
      </span>
      <div className="sidebar min-h-screen h-full lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900">
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <i className="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600"></i>
            <Link to="/">
              <h1 className="font-bold text-gray-200 text-[15px] ml-3">Tiki</h1>
            </Link>
            <i className="bi bi-x cursor-pointer ml-28 lg:hidden"></i>
          </div>
          <div className="my-2 bg-gray-600 h-[1px]"></div>
        </div>
        <div className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white">
          <i className="bi bi-search text-sm"></i>
          <input
            type="text"
            placeholder="Search"
            className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
          />
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <i className="bi bi-house-door-fill"></i>
          <span className="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <i className="bi bi-bookmark-fill"></i>
          <span className="text-[15px] ml-4 text-gray-200 font-bold">
            Bookmark
          </span>
        </div>
        <div className="my-4 bg-gray-600 h-[1px]"></div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <i className="bi bi-chat-left-text-fill"></i>
          <div className="flex justify-between w-full items-center">
            <Link
              to={"/system/admin/users"}
              className="text-[15px] ml-4 text-gray-200 font-bold flex items-center gap-2 "
            >
              <FaUser />
              Người dùng
            </Link>
            <span className="text-sm rotate-180" id="arrow">
              <i className="bi bi-chevron-down"></i>
            </span>
          </div>
        </div>

        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <i className="bi bi-chat-left-text-fill"></i>
          <div className="flex justify-between w-full items-center">
            <Link
              to={"/system/admin/products"}
              className="text-[15px] ml-4 text-gray-200 font-bold flex gap-2 items-center"
            >
              <FaProductHunt />
              Sản phẩm
            </Link>
            <span className="text-sm rotate-180" id="arrow">
              <i className="bi bi-chevron-down"></i>
            </span>
          </div>
        </div>

        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <i className="bi bi-chat-left-text-fill"></i>
          <div className="flex justify-between w-full items-center">
            <Link
              to={"/system/admin/order"}
              className="text-[15px] ml-4 text-gray-200 font-bold flex gap-2 items-center"
            >
              <BsCartCheckFill />
              Đơn hàng
            </Link>
            <span className="text-sm rotate-180" id="arrow">
              <i className="bi bi-chevron-down"></i>
            </span>
          </div>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <i className="bi bi-chat-left-text-fill"></i>
          <div className="flex justify-between w-full items-center">
            <Link
              to={"/system/admin/blog"}
              className="text-[15px] ml-4 text-gray-200 font-bold flex gap-2 items-center"
            >
              <FaHackerNews />
              Blog
            </Link>
            <span className="text-sm rotate-180" id="arrow">
              <i className="bi bi-chevron-down"></i>
            </span>
          </div>
        </div>

        <div
          onClick={handleLogout}
          className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
        >
          <i className="bi bi-box-arrow-in-right"></i>
          <span className="text-[15px] ml-4 text-gray-200 font-bold">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
