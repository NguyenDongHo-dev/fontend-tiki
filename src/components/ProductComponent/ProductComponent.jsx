import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaCheckCircle, FaStar, FaTruck } from "react-icons/fa";
import { AiOutlineRight } from "react-icons/ai";
import iphone from "../../ass/image/iphone.webp";
import { getDetailsProduct } from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  addOrder,
  decreaseAmount,
  increaseAmount,
  resetOrder,
} from "../../redux/slides/oderSlice";
import { convertPrice, initFacebookSDK } from "../../utils";
import LikeButtonComponent from "../LikeButtonComponent/LikeButtonComponent";
import CommentsComponent from "../CommentsComponent/CommentsComponent";
import ModalComponent from "../ModalComponent/ModalComponent";

const ProductComponent = ({ idProduct }) => {
  const [more, setMore] = useState(true);
  const dispatch = useDispatch();

  const refFocus = useRef();

  const Navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
 const [showModalNullUser, setShowModalNullUser] = useState(false);

  const [number, setNumber] = useState(1);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const fetchGetDetailsPorduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    const res = await getDetailsProduct(id);
    return res.data;
  };

  const queryProduct = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsPorduct,
    enabled: !!idProduct,
  });
  const { data, status } = queryProduct;

  const handleOnChangeNumber = (e) => {
    let value = e.target.value;

    if (value === "") {
      setNumber("");
      return;
    }

    value = Number(value);

    if (isNaN(value)) return;

    if (value <= 0) {
      setNumber(1);
      return;
    }

    if (value > data?.countInStrock) {
      setNumber(data?.countInStrock);
      return;
    }

    setNumber(value);
  };

  const handleBlurNumber = () => {
    if (number < 0 || number === "") {
      setNumber(1)
    }else if(number>data?.countInStrock){
      setNumber(data?.countInStrock)
    }

  }

  const handleSetNumber = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumber((prev) => prev + 1);
      }
    } else {
      if (!limited) {
        setNumber((prev) => prev - 1);
      }
    }
  };

  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item.product === data?._id
    );
    if (
      orderRedux?.amount + number <= orderRedux?.countInStrock ||
      (!orderRedux && data?.countInStrock > 0)
    ) {
      setErrorLimitOrder(false);
    } else if (data?.countInStrock === 0) {
      setErrorLimitOrder(true);
    }
  }, [number]);

  const handleCloseModalNotUser = (showModal)=>{
   setShowModalNullUser(false)
  } 

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      setShowModalNullUser(true)
        
      // Navigate("/login", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === data?._id
      );

      const numberReduc = orderRedux?.amount + number;
      if (
        numberReduc <= orderRedux?.countInStrock ||
        (!orderRedux && data?.countInStrock > 0)
      ) {
        dispatch(
          addOrder({
            orderItem: {
              name: data?.name,
              amount: number,
              image: data?.image,
              price: data?.price,
              product: data._id,
              discount: data?.discount,
              countInStrock: data?.countInStrock,
            },
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetOrder);
    };
  }, [order?.isSuccessOrder]);

  //fb
  useEffect(() => {
    initFacebookSDK();
  }, []);

  const handleNavigatetype = (type) => {
    if (typeof type === "string") {
      Navigate(
        `/${type
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          ?.replace(/ /g, "_")}`,
        { state: type }
      );
    }
  };

  return (
    <>
        <ModalComponent
            title={"Đăng nhập"}
            open={showModalNullUser }
            close={handleCloseModalNotUser}
            onClick={() => Navigate("/login")}
          >
            Bạn cần phải đăng nhập mới thực hiện được
          </ModalComponent>

      <div className="flex items-center gap-2 text-[rgb(128,128,137)] dark:text-[#e4e6eb]">
        <Link to={"/"}>
          <h5 className="cursor-pointer hover:underline ">Trang Chủ</h5>
        </Link>
        <AiOutlineRight />
        <div
          className=" cursor-pointer hover:underline dark:text-[#e4e6eb]"
          onClick={() => handleNavigatetype(data?.type)}
        >
          <p>{data?.type}</p>
        </div>
        <AiOutlineRight />
        <p className="text-[rgb(56,56,61)] cursor-default dark:text-white">
          {data?.name}
        </p>
      </div>
      {status === "pending" ? (
        <LoadingComponent />
      ) : (
        <div className=" grid grid-cols-3 gap-4 mt-4 items-start ">
          <div className=" rounded-xl bg-white p-4 flex items-center justify-center dark:bg-[#242526] ">
            <img
              className=" w-full object-contain rounded-xl border-[1px]"
              src={data?.image}
              alt=""
            />
          </div>
          <div className="flex flex-col gap-4 h-screen overflow-y-auto sticky">
            <div className=" rounded-xl flex flex-col gap-3 p-4 bg-white dark:bg-[#242526]">
              <div className="flex gap-1 items-center text-[#0a68ff]">
                <div className=" text-base">
                  <FaCheckCircle />
                </div>
                <p className=" text-xs font-medium leading-[150%]">
                  CHÍCH HÃNG
                </p>
              </div>
              <p className=" text-xl font-medium text-black dark:text-[#e4e6eb] ">
                {data?.name}
              </p>
              <div className="flex gap-2  text-xs">
                <div className="flex gap-1 border-r-[1px] pr-1 items-center text-[16px] text-[#ffc400]">
                  {data?.rating}
                  <FaStar className="text-[#ffc400]" />
                </div>
                <div className=" text-[16px] text-[rgb(128,128,137)] ">
                  {data?.selled && `Đã bán ${data?.selled}+`}
                </div>
              </div>

              <div className="flex gap-11 items-center">
                <h1 className=" text-[#0a68ff] text-2xl font-semibold ">
                  {convertPrice((data?.price).toLocaleString())}
                  <sup className=" underline">đ</sup>
                </h1>

                {data?.discount !== 0 && (
                  <>
                    <span>{`-${data.discount}%`}</span>
                    <span className="line-through">
                      {convertPrice(
                        Math.ceil(
                          data.price / (1 - data.discount / 100)
                        ).toLocaleString()
                      )}
                      ₫
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className=" bg-white rounded-xl p-4 dark:bg-[#242526] dark:text-[#e4e6eb]">
              <div className="border-b-[1px] pb-2 ">
                <h3 className=" font-semibold text-base ">
                  Thông tin vận chuyển
                </h3>
                <p>Giao đến Q. Ninh Kiều, P. An Khánh, Cần Thơ</p>
              </div>
              <div className="">
                <div className="">
                  <div className="text-[rgb(39,39,42)] dark:text-[#e4e6eb] text-sm flex items-center gap-2 mt-2  ">
                    <FaTruck className="" />
                    <p className="">Giao Thứ Bảy</p>
                  </div>
                  <p className="dark:text-[#e4e6eb] text-[rgb(39,39,42)]  text-sm ">
                    Trước 19h, 09/12: 42.000₫
                  </p>
                </div>
              </div>
            </div>
            <div className=" bg-white rounded-xl p-4 dark:bg-[#242526] relative">
              <div
                className={`${
                  more &&
                  " dark:from-[rgba(0,0,0,0)] dark:to-[rgb(0,0,0)]   absolute bottom-0 left-0 w-full z-10 h-[200px] bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgb(255,255,255)]"
                }`}
              ></div>
              <p className="dark:text-[#e4e6eb] text-base font-semibold text-[rgb(39,39,42)]">
                Mô tả sản phẩm:
              </p>
              <div
                className={`post-content overflow-hidden ${
                  more && "max-h-[200px] "
                }`}
                dangerouslySetInnerHTML={{ __html: data?.description }}
              ></div>

              <div
                onClick={() => setMore(!more)}
                className={`flex items-center justify-center text-[rgb(24,158,255)] cursor-pointer mt-2 relative z-20`}
              >
                {more ? "Xem thêm" : "Thu gọn"}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 bg-white rounded-xl p-4 dark:bg-[#242526]">
            <p className=" text-sm font-semibold">Số Lượng</p>
            <div className="flex gap-1">
              <button
                onClick={() => handleSetNumber("minus", number === 1)}
                className=" border-[1px] rounded p-[6px] w-10"
              >
                -
              </button>

              <input
                type="number"
                value={number}
                onBlur={handleBlurNumber}
                onChange={handleOnChangeNumber}
                className="w-11 cursor-default focus:outline-none dark:text-black flex justify-center items-center text-center "
              />

              <button
                onClick={() =>
                  handleSetNumber("increase", number === data?.countInStrock)
                }
                className=" border-[1px] rounded p-[6px] w-10"
              >
                +
              </button>
            </div>
            <LikeButtonComponent
              href={
                process.env.REACT_APP_IS_LOCAL
                  ? "https://developers.facebook.com/docs/plugins/"
                  : window.location.href
              }
            />
            <div className="flex flex-col gap-5">
              <div>
                <h2 className=" text-base font-semibold ">Tạm tính:</h2>
                <h1 className=" text-2xl font-semibold ">
                  {number > 1 ? convertPrice( data?.price * number) : convertPrice( data?.price) }

                  <sup>đ</sup>
                </h1>
              </div>
              {/* {data?.discount != 0 && (
                <div>
                  <h2 className=" text-base font-semibold">
                    Giá sau khi giảm:
                  </h2>
                  <h1 className=" text-2xl font-semibold">
                    {convertPrice(
                      data?.price * number -
                        (data?.price * number * data?.discount) / 100
                    )}

                    <sup>đ</sup>
                  </h1>
                </div>
              )} */}
            </div>

            <div className="flex flex-col gap-2">
              {errorLimitOrder && (
                <span className=" text-red-500 font-semibold">
                  Sản phẩm đã hết hàng
                </span>
              )}
              <button
                disabled={errorLimitOrder}
                onClick={handleAddOrderProduct}
                className=" disabled:opacity-50 disabled:cursor-not-allowed font-light bg-[rgb(255,66,78)] text-white cursor-pointer font-light text-base h-10 rounded p-2"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <CommentsComponent
        href={
          process.env.REACT_APP_IS_LOCAL
            ? "https://developers.facebook.com/docs/plugins/comments#configurator"
            : window.location.href
        }
        width={1264}
      /> */}
    </>
  );
};

export default ProductComponent;
