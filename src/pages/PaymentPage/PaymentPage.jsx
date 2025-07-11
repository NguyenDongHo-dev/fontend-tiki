import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillInfoCircle, AiOutlineCreditCard } from "react-icons/ai";
import { useMutationHook } from "../../hooks/UserMutationHook";
import { createOrder } from "../../services/OrderService";
import { useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import { useDispatch } from "react-redux";
import { removeAllOrder } from "../../redux/slides/oderSlice";
import PayPal from "../../components/PayPal/PayPal";
import notCard from "../../ass/image/notCard.png";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
// import {
//   PayPalButtons,
//   PayPalHostedField,
//   PayPalHostedFieldsProvider,
//   PayPalScriptProvider,
//   SubmitPayment,
// } from "@paypal/react-paypal-js";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);

  const [payment, setPayment] = useState("later_money");

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return Math.ceil(total +  cur.price/(1-cur.discount/100) * cur.amount);
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;

      return Math.round(total +   (cur.price  / ( 1 - totalDiscount / 100)  * cur.amount ) - (cur.price * cur.amount));
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  //total price
  const totalPriceMemo = useMemo(() => {
    return Math.round(Number(priceMemo) - Number(priceDiscountMemo));
  }, [priceMemo, priceDiscountMemo]);
  
  const mutationAddOrder = useMutationHook((data) => {
    const { access_token, ...rests } = data;
    const res = createOrder(access_token, rests);
    return res;
  });

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSlected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        access_token: user?.access_token,
        orderItems: order?.orderItemsSlected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        itemsPrice: priceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email,
        paymentMethod: "later_money",
      });
    }
  };

  const { isSuccess, isError, status, data: dataAdd } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrder = [];
      order?.orderItemsSlected?.forEach((element) => {
        arrayOrder.push(element.product);
      });
      dispatch(removeAllOrder({ listChecked: arrayOrder }));
      alert("Đặt hàng thành công");
      navigate("/ordersuccess", {
        state: {
          totalPriceMemo: totalPriceMemo,
          order: order?.orderItemsSlected,
          methon: "Thanh toán khi nhận hàng",
        },
      });
    } else if (isError) {
      alert("Đặt hành thất bại");
    }
  }, [isSuccess, isError]);

  // const handlePayment = (e) => {
  //   setPayment(e.target.value);
  // };

  return (
    <>
      {order?.orderItems?.length === 0 ? (
        <div className="dark:bg-[#18191a] bg-[#efefef] p-6 min-h-screen flex justify-center ">
          <div>
            <img src={notCard} />
            <p className=" text-center font-semibold text-xl">
              Không có hóa đơn thanh toán
            </p>
          </div>
        </div>
      ) : (
        <div className=" p-6 bg-[#efefef] dark:bg-[#18191a] min-h-screen ">
          <p className=" mb-[20px] text-xl font-medium text-black leading-7 dark:text-[#e4e6eb] ">
            Thanh Toán
          </p>
          <div className="flex gap-[20px] items-start flex-wrap xl:flex-nowrap">
            <div className="xl:flex-1 w-full">
              <div
                className=" bg-white p-4 rounded dark:bg-[#242526]
 "
              >
                <p>Chọn phương thức thanh toán</p>
                <div className="  mt-3 rounded-xl w-1/2 p-3 dark:bg-[#18191a] bg-[rgb(240,248,255)] border-[1px] border-[rgb(194,225,255)]">
                  <div className="flex items-center gap-2 ">
                    <input
                    
                      onChange={(e) => setPayment(e.target.value)}
                      type="radio"
                      id="later_money"
                      name="methon"
                      value="later_money"
                      defaultChecked
                    />
                    <label
                      htmlFor="later_money"
                      className="dark:text-[#e4e6eb]"
                    >
                      Thanh toán tiền mặt khi nhận hàng
                    </label>
                  </div>
                </div>
                <div className=" mt-3 rounded-xl w-1/2 p-3 dark:bg-[#18191a] bg-[rgb(240,248,255)] border-[1px] border-[rgb(194,225,255)]">
                  <div className="flex items-center gap-2">
                    <input
                      onChange={(e) => setPayment(e.target.value)}
                      type="radio"
                      id="paypal"
                      name="methon"
                      value="paypal"
                    />
                    <label htmlFor="paypal">Paypal</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:w-[320px] w-full">
              <div className=" flex flex-col gap-4">
                <div
                  className="p-4 bg-white dark:bg-[#242526] rounded
"
                >
                  <div className="flex justify-between items-center mb-8 ">
                    <p>Tiki Khuyến Mãi</p>
                    <div className="flex gap-2 items-center text-[rgb(120,120,120)]">
                      <p className="">Có thể chọn 2</p>
                      <AiFillInfoCircle />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center text-[rgb(11,116,229)]">
                    <AiOutlineCreditCard />
                    <p>Chọn hoặc nhập Khuyến mãi khác</p>
                  </div>
                </div>

                <div
                  className="bg-white dark:bg-[#242526]
"
                >
                  <div className=" ">
                    <div>
                      <div className=" border-b-[1px] py-[17px] px-5 dark:border-[#e4e6eb]">
                        <div className="text-[rgb(51,51,51)] dark:text-[#e4e6eb] font-light flex items-center justify-between">
                          <p>Đơn giá</p>
                          <p>{convertPrice(priceMemo)}</p>
                        </div>
                        <div className="text-[rgb(51,51,51)] dark:text-[#e4e6eb] font-light flex items-center justify-between">
                          <p>Giảm giá</p>
                          <p>-{convertPrice(priceDiscountMemo)}</p>
                        </div>
                      </div>
                      <div className="py-[17px] px-5">
                        <div className="flex justify-between items-start">
                          <p className="text-[rgb(51,51,51)] font-light dark:text-[#e4e6eb]">
                            Tổng tiền
                          </p>

                          <div>
                            <p className="text-[rgb(254,56,52)] text-right font-normal text-[15px]">
                              {convertPrice(totalPriceMemo)}
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
                {payment === "paypal" ? (
                  <PayPal
                    priceMemo={priceMemo}
                    totalPriceMemo={totalPriceMemo}
                  />
                ) : status === "pending" ? (
                  <LoadingComponent />
                ) : (
                  <button
                    disabled={status === "pending"}
                    onClick={() => handleAddOrder()}
                    className="bg-[rgb(255,66,78)] disabled:cursor-default disabled:opacity-50  text-white cursor-pointer py-[13px] px-[10px] w-full rounded border-none "
                  >
                    "Đặt hàng"
                    <span>
                      {convertPrice(totalPriceMemo)}
                      <sup>đ</sup>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentPage;
