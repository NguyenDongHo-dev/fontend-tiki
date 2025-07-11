import React, { useEffect, useMemo, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { AiFillInfoCircle, AiOutlineCreditCard } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import card from "../../ass/image/card.png";

import {
  decreaseAmount,
  increaseAmount,
  removeAllOrder,
  removeOrder,
  selectedOrder,
  setAmountItem,
} from "../../redux/slides/oderSlice";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [showModle, setShowModle] = useState(false);
  const [number, setNumber] = useState(1);
  const [listChecked, setListChecked] = useState([]);

  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const handleOnChangeNumber = (e, idProduct) => {
    let value = e.target.value;

    if (value === "") {
      dispatch(setAmountItem({ amount: "", idProduct }));

      return;
    }

    value = Number(value);

    if (isNaN(value)) return;

    if (value <= 0) {
      setNumber(1);
      dispatch(setAmountItem({ amount: 1, idProduct }));
      return;
    }

    setNumber(value);
    dispatch(setAmountItem({ amount: value, idProduct }));
  };

  const handleBlur = (idProduct, countInStrock) => {
    const item = order?.orderItems?.find((item) => item?.product === idProduct);
    let currentAmount = item?.amount;

    if (!currentAmount || currentAmount === "" || isNaN(currentAmount)) {
      currentAmount = 1;
    } else if (currentAmount < 1) {
      currentAmount = 1;
    } else if (currentAmount > countInStrock) {
      currentAmount = countInStrock;
    }

    dispatch(setAmountItem({ amount: currentAmount, idProduct }));
  };

  const handleSetNumber = (type, idProduct, limited) => {
    if (type === "addNumber") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    }
    if (type === "minus") {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrder({ idProduct }));
  };

  const onChage = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.map((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  const handleRemoveAllOrder = () => {
    if (listChecked !== null) {
      dispatch(removeAllOrder({ listChecked }));
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  const linkUpdate = () => {
    navigate("/profile-user");
  };

  const Modal = () => {
    return (
      <ModalComponent
        title="Thông tin tài khoảng còn thiếu cần phải bổ sung"
        open={showModle}
        close={() => setShowModle(false)}
        onClick={linkUpdate}
      >
        Bạn cần phải nhập thêm thông tin (Số điện thoại, địa chỉ, username) để
        tiến thành thanh toán
      </ModalComponent>
    );
  };

  const handleCancleUpdate = () => {};

  const handleAddCard = () => {
    if (!order?.orderItemsSlected?.length) {
      alert("Vui Lòng chọn sản phẩm");
    } else if (!user?.phone || !user?.address || !user?.name) {
      setShowModle(true);
    } else {
      navigate("/payment");
    }
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return Math.ceil(
        total + (cur.price / (1 - cur.discount / 100)) * cur.amount
      );
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      return Math.round(
        total +
          (cur.price / (1 - totalDiscount / 100)) * cur.amount -
          cur.price * cur.amount
      );
    }, 0);

    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  const totalPriceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [priceMemo, priceDiscountMemo]);

  return (
    <>
      <Modal></Modal>

      <div className=" p-6 bg-[#efefef] min-h-screen dark:bg-[#18191a]">
        <p className=" dark:text-white mb-[20px] text-xl font-medium text-black leading-7 ">
          GIỎ HÀNG
        </p>
        {order?.orderItems?.length === 0 ? (
          <div className="bg-white py-4  dark:bg-[#242526]">
            <div className="flex items-center justify-center">
              <div>
                <img className="w-[160px] h-[160px]" src={card} alt="" />
                <div className=" text-center mt-3 font-semibold text-xl text-[rgb(39,39,42)] dark:text-white">
                  Giỏ hàng trống
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-[20px] items-start flex-wrap xl:flex-nowrap">
            <div className="xl:flex-1 w-full">
              <div className=" bg-white py-2 px-4 mb-[10px]  dark:bg-[#242526]">
                <div className="grid grid-cols-[auto,180px,120px,120px,120px,20px] items-center gap-6 dark:text-[#e4e6eb]">
                  <div className="flex gap-2 items-center ">
                    <input
                      id="checkAll"
                      type="checkbox"
                      onChange={handleOnchangeCheckAll}
                      checked={
                        listChecked?.length === order?.orderItems?.length
                      }
                    />
                    <label htmlFor="checkAll">
                      Tất cả ({order?.orderItems?.length})
                    </label>
                  </div>
                  <div className="text-[rgb(120,120,120)] text-[14px] font-normal dark:text-[#e4e6eb]  ">
                    Đơn giá
                  </div>
                  <div className="text-[rgb(120,120,120)] text-[14px] font-normal dark:text-[#e4e6eb]  ">
                    Giảm giá
                  </div>
                  <div className="text-[rgb(120,120,120)] text-[14px] font-normal dark:text-[#e4e6eb]  ">
                    Số lượng
                  </div>
                  <div className="text-[rgb(120,120,120)] text-[14px] font-normal  dark:text-[#e4e6eb]">
                    Thành tiền
                  </div>
                  <FaTrashCan
                    onClick={handleRemoveAllOrder}
                    className=" cursor-pointer text-[rgb(120,120,120)] text-[20px]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {order?.orderItems?.map((item) => {
                  return (
                    <div
                      key={item?.product}
                      className="bg-white py-4 px-4 flex flex-col gap-[32px] dark:bg-[#242526]"
                    >
                      <div className=" grid grid-cols-[auto,180px,120px,120px,120px,20px] items-center gap-6">
                        <div className=" grid gap-1 grid-cols-[18px,80px,1fr] items-center">
                          <input
                            onChange={onChage}
                            type="checkbox"
                            value={item?.product}
                            checked={listChecked?.includes(item?.product)}
                          />
                          <img
                            className=" object-contain aspect-[80/80] h-[80px] w-[80px]"
                            src={item?.image}
                          />

                          <p className=" dark:text-[#e4e6eb] overflow-hidden text-sm font-normal text-[rgb(39,39,42)] w-[225px] leading-[150%] line-clamp-2">
                            {item?.name}
                          </p>
                        </div>
                        <div className=" text-sm leading-[21px] font-semibold text-[rgb(39,39,42)] dark:text-[#e4e6eb]">
                          {convertPrice(
                            Math.ceil(
                              item.price / (1 - item.discount / 100)
                            ).toLocaleString()
                          )}
                          <sup>đ</sup>
                        </div>
                        <div className=" text-sm leading-[21px] font-semibold text-[rgb(39,39,42)] dark:text-[#e4e6eb]">
                          {item?.discount + "%"}
                        </div>
                        <div>
                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                handleSetNumber(
                                  "minus",
                                  item?.product,
                                  item?.amount === 1
                                )
                              }
                              className=" border-[1px] rounded p-[6px] w-10"
                            >
                              -
                            </button>

                            <input
                              onChange={(e) =>
                                handleOnChangeNumber(e, item?.product)
                              }
                              onBlur={() =>
                                handleBlur(item?.product, item?.countInStrock)
                              }
                              defaultValue="1"
                              className="w-11 dark:text-black cursor-default focus:outline-none text-center "
                              type="number"
                              value={item?.amount}
                            />

                            <button
                              onClick={() =>
                                handleSetNumber(
                                  "addNumber",
                                  item?.product,
                                  item?.countInStrock === item?.amount
                                )
                              }
                              className=" border-[1px] rounded p-[6px] w-10"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className=" text-sm leading-[21px]  font-semibold text-[rgb(255,66,78)]">
                          {convertPrice(item.amount ? item.price * item.amount : item.price)}
                          <sup>đ</sup>
                        </div>
                        <FaTrashCan
                          onClick={() => {
                            handleDeleteOrder(item?.product);
                          }}
                          className="text-[rgb(120,120,120)] text-[20px] cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="xl:w-[320px] w-full">
              <div className=" flex flex-col gap-4">
                <div className="p-4 bg-white dark:bg-[#242526]">
                  <div className="flex justify-between items-center mb-8 ">
                    <p className="dark:text-[#e4e6eb]">Tiki Khuyến Mãi</p>
                    <div className="flex gap-2 items-center text-[rgb(120,120,120)]">
                      <p className="dark:text-[#e4e6eb]">Có thể chọn 2</p>
                      <AiFillInfoCircle />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center text-[rgb(11,116,229)]">
                    <AiOutlineCreditCard />
                    <p>Chọn hoặc nhập Khuyến mãi khác</p>
                  </div>
                </div>
                {user ? (
                  <div className=" bg-white p-4 dark:bg-[#242526] ">
                    <div className="flex justify-between mb-3">
                      <div className="text-[rgb(128,128,137)] font-normal dark:text-[#e4e6eb]">
                        Giao tới
                      </div>
                      <Link
                        to={"/profile-user"}
                        className="text-[rgb(11,116,229)]"
                      >
                        Thay đổi
                      </Link>
                    </div>
                    <div>
                      <div className="flex items-center w-full text-[rgb(56,56,61)] font-semibold dark:text-[#e4e6eb]">
                        <div className=" flex-1  ">{user?.name}</div>
                        <div className="flex-1 ">{user?.phone}</div>
                      </div>
                      <p>{user?.address}</p>
                    </div>
                  </div>
                ) : null}

                <div className="bg-white dark:bg-[#242526]">
                  <div className=" ">
                    <div>
                      <div className="text-[rgb(51,51,51)] dark:text-[#e4e6eb] border-b-[1px] py-[17px] px-5">
                        <div className="font-light flex items-center justify-between">
                          <p>Đơn giá</p>
                          <p>{convertPrice(priceMemo)}</p>
                        </div>
                        <div className="font-light flex items-center justify-between">
                          <p>Giảm giá</p>
                          <p>{convertPrice(priceDiscountMemo)}</p>
                        </div>
                      </div>
                      <div className="py-[17px] px-5">
                        <div className="flex justify-between items-start">
                          <p className="text-[rgb(51,51,51)] font-light dark:text-[#e4e6eb]">
                            Tổng tiền
                          </p>

                          <div>
                            <p className="text-[rgb(254,56,52)] text-right font-normal text-[15px]">
                              {totalPriceMemo
                                ? convertPrice(totalPriceMemo)
                                : "Vui lòng chọn sản phẩm"}
                            </p>
                            <p className="text-[rgb(51,51,51)] text-right font-light dark:text-[#e4e6eb]">
                              (Đã bao gồm VAT nếu có)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleAddCard}
                  className="bg-[rgb(255,66,78)] text-white cursor-pointer py-[13px] px-[10px] w-full rounded border-none "
                >
                  Mua hàng{" "}
                  <span>
                    ({totalPriceMemo ? convertPrice(totalPriceMemo) : 0}
                    <sup>đ</sup>)
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderPage;
