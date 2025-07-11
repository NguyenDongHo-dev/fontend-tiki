import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  deleteDetailsOrder,
  getOrderUserId,
} from "../../services/OrderService";
import { useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import { useNavigate } from "react-router-dom";
import { useMutationHook } from "../../hooks/UserMutationHook";
import notCard from "../../ass/image/notCard.png";

const MyOrder = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const fetchMyOrder = async () => {
    const res = await getOrderUserId(user?.id, user?.access_token);
    return res.data;
  };

  const queryUserOrder = useQuery({
    queryKey: ["orderUser"],
    queryFn: fetchMyOrder,
    enabled: Boolean(user?.id && user?.access_token),
  });

  const { data } = queryUserOrder;

  const renderProduct = (order) => {
    return order?.map((item) => {
      return (
        <div className=" grid  grid-cols-[auto,150px,150px,150px] items-center mb-3">
          <div className="flex items-center gap-3">
            <img className="w-[80px] h-[80px]" src={item.image}  />
            <p>{item.name}</p>
          </div>
          <div className="text-center">{convertPrice(item.price)}đ</div>
          <div className="text-center   ">
            {item?.amount}
          </div>
          <div className="text-[#0a68ff] text-center">
            {convertPrice(
              item?.price * item?.amount 
            
            )}
            <sup>đ</sup>
          </div>
        </div>
      );
    });
  };

  const handlDetailsOrder = (id) => {
    navigate(`/details-order/${id}`);
  };

  const mutateDelete = useMutationHook((data) => {
    const { id, token, orderItems } = data;
    const res = deleteDetailsOrder(id, token, orderItems);
    return res;
  });

  const handlDeleteOrderDetails = (order) => {
    mutateDelete.mutate(
      {
        id: order._id,
        token: user?.access_token,
        orderItems: order?.orderItems,
      },
      {
        onSettled: () => {
          queryUserOrder.refetch();
        },
      }
    );
  };

  return (
    <div>
      <div className=" bg-[#efefef] py-4 min-h-screen dark:bg-[#18191a]">
        <div className=" max-w-[1440px] px-5 mx-auto ">
          <p className=" text-xl font-medium text-black dark:text-[#e4e6eb]">
            Đơn hàng của tôi
          </p>
          {data?.length === 0 ? (
            <div className=" bg-white mt-2 items-center flex justify-center">
              <div className="py-4">
                <img src={notCard} />
                <p className=" text-center font-semibold text-xl">
                  Chưa có đơn hàng
                </p>
              </div>
            </div>
          ) : (
            <div className="">
              <div className=" ">
                {data?.map((order) => {
                  return (
                    <div className=" my-4 rounded-lg bg-white  shadow-xl dark:bg-[#242526]">
                      <div className=" p-4 bg-white  border-b-[1px] dark:bg-[#242526] dark:text-[#e4e6eb]">
                        <p className=" text-base">Trang Thái</p>
                        <div className="flex gap-1 text-sm">
                          <p className=" text-red-500">Giao hàng</p>
                          <p>
                            {order?.trait === "successfully" &&
                              "Giao hàng thành công"}
                            {order?.trait === "delivering" && "Đang giao hàng"}
                            {order?.trait !== "successfully" &&
                              order?.trait !== "delivering" &&
                              "Đang xử lý"}
                          </p>
                        </div>
                        <div className="flex gap-1 text-sm">
                          <p className=" text-red-500">Thanh toán</p>
                          <p>
                            {order?.paymentMethod == "paypal"
                              ? "Paypal"
                              : "Thanh toán khi nhận hàng"}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className=" grid grid-cols-[auto,150px,150px,150px] mb-2">
                          <p>Sản phẩm</p>
                          <p className="text-center">Giá</p>

                          <p className="text-center">Số lượng</p>
                          <p className="text-center">Tổng</p>
                        </div>
                        {renderProduct(order?.orderItems)}
                        <div className="flex justify-end border-t-[1px] pt-3">
                          <div className=" w-60">
                            <p>
                              <samp className=" text-red-500">Tổng tiền:</samp>
                              {convertPrice(order?.totalPrice)}
                              <sup>đ</sup>
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-3">
                          <div className=" w-auto flex gap-2">
                            <button
                              onClick={() => handlDeleteOrderDetails(order)}
                              className="px-4 py-2 rounded-md text-[#0a68ff] border-[#0a68ff] border-[1px] "
                            >
                              Hủy đơn hàng
                            </button>
                            <button
                              onClick={() => handlDetailsOrder(order?._id)}
                              className="px-4 py-2 rounded-md text-[#0a68ff] border-[#0a68ff] border-[1px] "
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
