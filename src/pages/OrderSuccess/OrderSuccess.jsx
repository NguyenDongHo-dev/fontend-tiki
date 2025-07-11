import React, { useMemo } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { convertPrice } from "../../utils";

const OrderSuccess = () => {
  const order = useSelector((state) => state.order);
  const location = useLocation();
  
  return (
    <div className=" bg-[#efefef] py-4 dark:bg-[#18191a] min-h-screen">
      <div className=" max-w-[1440px] px-5 mx-auto">
        <p className=" text-xl font-medium text-black dark:text-[#e4e6eb]">
          Đặt hàng thành công
        </p>
        <div className=" bg-white mt-4 rounded p-4 dark:bg-[#242526]">
          <div className=" flex flex-col gap-4 dark:text-[#e4e6eb]">
            <div className=" border-b-[1px] py-2 ">
              <p>Phương thức giao hàng</p>
              <p className=" dark:bg-[#18191a] p-3 bg-[rgb(240,248,255)] border-[rgb(194,225,255)] border-[1px] rounded-xl inline-block mt-2">
                Giao hàng tiết kiệm
              </p>
            </div>
            <div className=" border-b-[1px] py-2">
              <p>Phương thức thanh toán</p>
              <p className=" dark:bg-[#18191a] p-3 bg-[rgb(240,248,255)] border-[rgb(194,225,255)] border-[1px] rounded-xl inline-block mt-2">
                {location?.state?.methon}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[auto,180px,120px,120px,20px] items-center gap-6 py-2 border-b-[1px] font-semibold">
            <div className="flex gap-2 items-center ">
              <label htmlFor="checkAll">
                Tất cả ({location?.state?.order?.length})
              </label>
            </div>
            <div className="text-[rgb(120,120,120)] dark:text-[#e4e6eb] text-[14px]   text-center  ">
              Đơn giá
            </div>
          
            <div className="text-[rgb(120,120,120)] dark:text-[#e4e6eb] text-[14px] text-center ">
              Số lượng
            </div>
            <div className="text-[rgb(120,120,120)] dark:text-[#e4e6eb] text-[14px]   text-center ">
              Thành tiền
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {location?.state?.order?.map((item) => {
              return (
                <div className=" flex flex-col gap-[32px]">
                  <div className=" grid grid-cols-[auto,180px,120px,120px,20px] items-center gap-6">
                    <div className=" grid gap-3 grid-cols-[120px,1fr] items-center">
                      <img
                        className=" object-contain aspect-[80/80] h-[120px] w-[120px]"
                        src={item?.image}
                      />

                      <p className="dark:text-[#e4e6eb] overflow-hidden text-sm font-normal text-[rgb(39,39,42)] w-[225px] leading-[150%] line-clamp-2">
                        {item?.name}
                      </p>
                    </div>
                    <div className=" dark:text-[#e4e6eb] text-sm leading-[21px] font-semibold text-[rgb(39,39,42)] text-center">
                      {convertPrice(item?.price)}
                      <sup>đ</sup>
                    </div>
                
                    <div>
                      <div className="dark:text-[#e4e6eb]  gap-1 text-center ">
                        <div>{item?.amount}</div>
                      </div>
                    </div>
                    <div className=" text-sm leading-[21px]  font-semibold text-[rgb(255,66,78)] text-center">
                      {convertPrice(
                       Math.ceil(item?.price*item?.amount)
                      )}
                      <sup>đ</sup>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className=" font-semibold text-xl mt-3 text-red-600">
          Tổng tiền {convertPrice(location?.state?.totalPriceMemo)}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
