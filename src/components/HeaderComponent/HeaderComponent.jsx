import React, { useEffect, useRef, useState } from "react";
import logo from "../../ass/image/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logoutUser } from "../../services/UserService";
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slides/userSlice.js";
import TypeProduct from "../TypeProduct/TypeProduct.jsx";
import { BsCart } from "react-icons/bs";
import { resetOrder } from "../../redux/slides/oderSlice.js";
import { IoMoonOutline } from "react-icons/io5";
import { thame } from "../../redux/slides/themeSlice.js";
import { IoSunnyOutline } from "react-icons/io5";
import { useDebounce } from "../../hooks/useDebounce.js";
import { getAllProduct } from "../../services/ProductService.js";
import Search from "../Search/Search.jsx";
import { getRandomType } from "../../utils.js";
import { dataSelect, help } from "../../data.js";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    typeSearch: "name_normalized",
    search: "",
  });
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const { theme } = useSelector((state) => state.theme);

  const [numberCard, setNumberCard] = useState(0);
  const [name, setname] = useState("");

  const [ramdomType, setRamDuomTpe] = useState(getRandomType(dataSelect, 5));

  const [limit, setLimit] = useState(6);
  const [dataSearch, setDataSearch] = useState([]);
  const searchDebounce = useDebounce(search?.search, 1000);
  const [disabled, setDisabled] = useState();
  const [showSearch, setShowSearch] = useState(true);

  const handleLogOut = async () => {
    await logoutUser();
    setShow(false);
    dispatch(resetUser());
    dispatch(resetOrder());
    window.localStorage.removeItem("access_token");
  };

  const normalizeText = (str) => {
    return str
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  };

  useEffect(() => {
    setname(user?.name);
  }, [user?.name]);

  useEffect(() => {
    setNumberCard(order?.orderItems?.length);
  }, [order]);

  const handleOchangeSearch = (e) => {
    setSearch({
      typeSearch: "name_normalized",
      search: e.target.value,
    });
  };

  useEffect(() => {
    const time = setTimeout(() => {
      setShow(false);
    }, 3000);
    return () => clearTimeout(time);
  }, [show]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchSearchProduct = async (search, type, limit) => {
    const normalizeTextSearch = normalizeText(search);

    const res = await getAllProduct(normalizeTextSearch, type, limit);
    if (res?.status === "OK") {
      setDataSearch(res.data);
      setDisabled(res?.total === res?.data?.length || res?.totalPages === 1);
    }

    if (res?.status === "ERROR") {
      setDataSearch(null);
    }
  };

  useEffect(() => {
    if (searchDebounce) {
      fetchSearchProduct(searchDebounce, search.typeSearch, limit);
    }
  }, [searchDebounce, limit]);

  useEffect(() => {
    if (searchDebounce) {
      setLimit(6);
    }

    setShowSearch(true);
  }, [searchDebounce]);

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 6);
  };

  const searchRef = useRef(null);
  const handleClickOutsideSearch = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearch(false);
      setSearch({
        search: "",
      });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("click", handleClickOutsideSearch);
    };
  }, []);

  const handleFocut = () => {
    if (searchDebounce) {
      fetchSearchProduct(searchDebounce, limit);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-5 py-2  bg-white dark:bg-[#242526]  ">
      <div className="flex gap-[46px] items-center">
        <Link to="/">
          <div>
            <img className=" w-[96px]" src={logo} alt="logo" />
          </div>
        </Link>
        <div className="w-full flex-1 flex flex-col gap-[8px] h-[72px] ">
          <div className="flex items-center flex-1">
            <div className=" relative  border-[1px] border-color:rgb(221, 221, 227) rounded-lg flex items-center w-full  ">
              <input
                onClick={handleFocut}
                value={search?.search}
                onChange={handleOchangeSearch}
                className=" px-2 border-0 focus:outline-none dark:bg-[#242526] dark:text-[#e4e6eb] w-full  "
                placeholder="100% Hàng tuyển chọn"
              />
              <button className="w-[92px] cursor-pointer h-[38px] p-1 rounded-r-[8px] text-[#0a68ff] dark:text-[] border-l-[1px]">
                Tìm kiếm
              </button>
              {searchDebounce && showSearch && (
                <div
                  ref={searchRef}
                  className=" z-50 absolute bg-gray-200 dark:text-white  dark:bg-[#18191a] w-full top-[calc(100%-1px)]  rounded-b"
                >
                  <Search
                    dataSearch={dataSearch}
                    setSearch={setSearch}
                    handleLoadMore={handleLoadMore}
                    disabled={disabled}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end min-w-[550px] h-[40px] ml-5">
              <div className="inline-block">
                <Link className=" " to="/">
                  <button className="text-[#0a68ff] text-sm font-medium px-4">
                    Trang Chủ
                  </button>
                </Link>
              </div>
              <div className="inline-block">
                <Link to="/blogs">
                <div className="px-4">
                  <button className="text-[#0a68ff] text-sm font-medium">
                    Tin tức
                  </button>
                </div>
                </Link>
              </div>
           
              <div>
                {user?.name || user?.email ? (
                  <>
                    <div className=" relative">
                      <button
                        onClick={() => {
                          setShow(!show);
                        }}
                        className="px-4 cursor-pointer"
                      >
                        {name || user?.email}
                      </button>
                      {show && (
                        <div className=" absolute text-base rounded-lg w-[200px]  text-white z-50 bg-[#0a68ff]  p-1 transition-all ">
                          <div className=" flex gap-1 flex-col">
                            {user?.isAdmin ? (
                              <Link to="/system/admin">
                                <div className=" cursor-pointer rounded-lg  hover:bg-blue-500 transition-all px-3 py-1">
                                  Quản lý hệ thống
                                </div>
                              </Link>
                            ) : (
                              <Link to="/profile-user">
                                <div className=" cursor-pointer rounded-lg hover:bg-blue-500 transition-all px-3 py-1">
                                  thông tin người dùng
                                </div>
                              </Link>
                            )}
                            <Link
                              to={"/my-order"}
                              className=" cursor-pointer rounded-lg hover:bg-blue-500 transition-all px-3 py-1"
                            >
                              Đơn hàng của tôi
                            </Link>
                            <div
                              onClick={handleLogOut}
                              className=" cursor-pointer rounded-lg hover:bg-blue-500 transition-all px-3 py-1"
                            >
                              LogOut
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <button className="hover:text-[#0a68ff] transition-all">
                        Đăng Kí
                      </button>
                    </Link>
                    <p className=" inline-block">/</p>
                    <Link to="/login">
                      <button className="hover:text-[#0a68ff] transition-all">
                        Đăng nhập
                      </button>
                    </Link>
                  </>
                )}
              </div>

              <div className="flex gap-3 px-4  items-center">
                {theme === "light" ? (
                  <IoMoonOutline
                    className=" w-6 h-6 cursor-pointer  "
                    onClick={() => {
                      dispatch(thame());
                    }}
                  />
                ) : (
                  <IoSunnyOutline
                    className=" w-6 h-6 cursor-pointer  "
                    onClick={() => {
                      dispatch(thame());
                    }}
                  />
                )}

                <Link
                  to={"/order"}
                  className="p-2 hover:bg-[rgba(0,96,255,0.12)] rounded-lg transition-colors duration-200 cursor-pointer relative "
                >
                  {numberCard > 0 ? (
                    <div className=" absolute rounded-full bg-[rgb(255,66,79)] right-0 -top-[4px] text-white h-4 w-4 inline-block text-center font-bold text-[10px]">
                      {numberCard}
                    </div>
                  ) : null}

                  <BsCart className=" text-2xl text-[rgb(11,116,229)] " />
                </Link>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <ul className="flex gap-5 items-center">
                {ramdomType.map((item, index) => {
                  return <TypeProduct name={item.item} key={index} />;
                })}
              </ul>
              {user?.address && (
                <div>
                  <div className="flex gap-[4px] items-center">
                    <div className="text-sm font-normal text-[#808089]">
                      Giao đến:{" "}
                    </div>
                    <samp className="underline">{user?.address}</samp>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t ">
        <div className=" flex gap-3 items-center text-sm py-3 ">
          <div className=" font-semibold text-[rgb(0,62,161)]">Cam kết</div>
          <div className="flex gap-3 items-center">
            {help.map((item, index) => (
              <div className="flex gap-3 items-center">
                <div className="flex gap-[4px]">
                  <img className="size-5" src={item.icon} alt={item.item} />
                  <div>{item.item}</div>
                </div>
                {help.length -1 !== index ? (
                  <div className="w-[1px] h-5 bg-[#EBEBF0]"></div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
