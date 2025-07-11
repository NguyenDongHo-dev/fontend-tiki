import React, { useState } from "react";
import HomeAdmin from "./HomeAdmin";
import PieChartComponent from "./PieChartComponent";
import {
  getAllOrder,
  getDetailsOrder,
  updateOrder,
} from "../../services/OrderService";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { IoIosCloseCircle } from "react-icons/io";
import { convertPrice } from "../../utils";
import { useDebounce } from "../../hooks/useDebounce";

const AdminOrder = () => {
  const user = useSelector((state) => state.user);
  const [showUpdate, setShowUpdate] = useState(false);
  const [dataDetailOrder, setDataDetailOrder] = useState({});
  const [searchName, setSearchName] = useState("");
  const searchDebounce = useDebounce(searchName, 1000);

  const fetchOrderAll = async (context) => {
    const searchValue = context?.queryKey && context?.queryKey[1];
    const res = await getAllOrder(user?.access_token, searchValue);
    return res?.data;
  };

  const queryProducts = useQuery({
    queryKey: ["productsAdmin", searchDebounce],
    queryFn: fetchOrderAll,
    retry: true,
    retryDelay: 1000,
  });
  const { data, status } = queryProducts;

  //dataDetailOrder
  const fetchDetalOrder = async (id) => {
    const res = await getDetailsOrder(id, user?.access_token);
    if (res?.status === "OK") {
      setDataDetailOrder(res.data);
    }
  };

  //updata order

  const handleUpdateOrder = (idOrder) => {
    setShowUpdate(true);
    fetchDetalOrder(idOrder);
  };

  const ModalUpdateOrder = ({ data }) => {
    const [errorUpdate, setErrorUpdate] = useState(null);
    const [dataUpdataOrder, setDataUpdataOrder] = useState({
      trait: data?.trait,
      isPaid: data?.isPaid,
    });

    const handleOnchangeUpdata = (e) => {
      setDataUpdataOrder({
        ...dataUpdataOrder,
        [e.target.id]: e.target.value,
      });
    };

    const fetchUpdataOrder = async (id, data, access_token) => {
      const res = await updateOrder(id, data, access_token);
      if (res?.status === "OK") {
        setShowUpdate(false);
        fetchOrderAll();
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      fetchUpdataOrder(data?._id, dataUpdataOrder, user?.access_token);
    };
    return (
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 w-screen   ">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
            <div className="p-2 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-h-[calc(100vh-40px)] sm:w-full sm:max-w-[800px]">
              <div
                className="p-2"
                onClick={() => {
                  setShowUpdate(false);
                }}
              ></div>

              <div className="p-1">
                <div
                  onClick={() => setShowUpdate(false)}
                  className="flex justify-end -mt-3"
                >
                  <IoIosCloseCircle size={23} />
                </div>
                <div className=" text-center text-base mb-2 font-bold -mt-3">
                  Thông tin đơn hàng
                </div>

                <form onSubmit={handleSubmit}>
                  <div className=" flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center flex-1 gap-10 ">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="max-w-[120px] w-full font-semibold">
                            Tên người nhận:
                          </div>
                          <samp>{data?.shippingAddress?.fullName}</samp>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <div className="font-semibold">Địa chỉ:</div>
                          <samp>{data?.shippingAddress?.address}</samp>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="max-w-[120px] w-full font-semibold">
                          Trang thái:
                        </div>
                        <div
                          className={`${
                            data?.isPaid ? " text-green-500" : " text-red-500"
                          } `}
                        >
                          {data?.isPaid ? "Đã thanh toán" : "chưa thanh toán"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="font-semibold">
                          Hình thức thanh toán
                        </div>
                        <div>
                          {data?.paymentMethod === "later_money"
                            ? "Thanh toán khi nhận hàng"
                            : "Paypal"}
                        </div>
                      </div>
                    </div>

                    <div className=" bg-gray-200 rounded-md p-2 max-h-[300px] overflow-y-auto">
                      <div className="  grid grid-cols-[auto,100px,100px,100px,100px] items-center">
                        <p>Sản phẩm</p>
                        <p>Giá</p>
                        <p>Số lượng</p>
                        <p>Giảm giá</p>

                        <p className=" font-bold">Tổng cộng</p>
                      </div>
                      {data?.orderItems?.map((order) => {
                        return (
                          <div className=" mt-3 grid grid-cols-[auto,100px,100px,100px,100px] items-center">
                            <div className="flex gap-3 items-center">
                              <img
                                src={order.image}
                                className="w-20 h-20"
                                alt=""
                              />
                              <p>{order.name}</p>
                            </div>
                            <p className=" font-semibold">
                              {convertPrice(order.price)}
                              <sup>đ</sup>
                            </p>
                            <p className=" font-semibold">{order.amount}</p>
                            <p className=" font-semibold">{order.discount}%</p>

                            <p className=" text-red-500 font-semibold">
                              {convertPrice(
                                order.price * order.amount -
                                  (order.discount / 100) *
                                    order.price *
                                    order.amount
                              )}
                              <sup>đ</sup>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className=" text-red-500">
                      Tổng: {convertPrice(data?.totalPrice)}
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center flex-1">
                        <div className="max-w-[120px] w-full font-semibold">
                          Tình trạng
                        </div>
                        <div>
                          <select
                            id="trait"
                            onChange={handleOnchangeUpdata}
                            value={dataUpdataOrder?.trait}
                            class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                          >
                            <option value="processing">
                              Đang nhận đơn hàng
                            </option>
                            <option value="delivering">Đang giao hàng</option>
                            <option value="successfully">
                              Giao thành công
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center flex-1">
                        <div className="max-w-[170px] w-full font-semibold">
                          Cập nhật thanh toán
                        </div>
                        <div>
                          <select
                            id="isPaid"
                            onChange={handleOnchangeUpdata}
                            value={dataUpdataOrder?.isPaid}
                            class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                          >
                            <option value={false}>Chưa thanh toán</option>
                            <option value={true}>Đã thanh toán</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="mx-auto">
                      <button className="  w-[200px] cursor-pointer bg-[rgb(11,116,229)] h-[40px] text-white border-none rounded text-sm  ">
                        LUU
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <HomeAdmin>
        <>
          {showUpdate && <ModalUpdateOrder data={dataDetailOrder} />}

          <div className="mb-4 flex justify-between items-start">
            <div>
              <div className=" text-base font-bold">Quản lý đơn hàng</div>
              {data?.length > 0 && (
                <div className="w-[220px] h-[170px] inline-block dark:bg-[#242526] ">
                  <PieChartComponent data={data} />
                </div>
              )}
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <form className="flex items-center mb-3 ">
                <input
                  onChange={(e) => setSearchName(e.target.value)}
                  className=" dark:text-black focus:outline-none p-2 border-[#1c64f2] "
                  type="text"
                  placeholder="Search tên khách hàng"
                />
              </form>
            </div>
          </div>
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 table-auto">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-2 py-1">
                      FullName
                    </th>
                    <th scope="col" className="px-1 py-3">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Địa chỉ
                    </th>
                    <th scope="col" className="px-1 py-3">
                      Trang thái
                    </th>
                    <th scope="col" className="px-1 py-3">
                      Phương thức thanh toán
                    </th>
                    <th scope="col" className="px-1 py-3">
                      Tổng tiền
                    </th>
                    <th scope="col" className="px- py-3"></th>
                  </tr>
                </thead>
                {data && data?.length > 0 ? (
                  <tbody>
                    {data &&
                      data?.map((item) => {
                        return (
                          <tr className="bg-white border-b dark:bg-gray-800  hover:bg-gray-50 ">
                            <th
                              scope="row"
                              className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-[#e4e6eb]"
                            >
                              {item.shippingAddress.fullName}"
                            </th>

                            <td className="flex-1 py-4">
                              {item.shippingAddress.phone}
                            </td>

                            <td className="px-6 py-4">
                              {item.shippingAddress.address}
                            </td>
                            <td
                              className={`px-1 py-4 ${
                                item.isPaid === true
                                  ? " text-green-500 font-medium"
                                  : " text-red-500 font-medium"
                              } `}
                            >
                              {item.isPaid === true
                                ? "Đã thanh toán"
                                : "Chưa thanh toán"}
                            </td>
                            <td className="px-1 py-4">
                              {item.paymentMethod === "later_money"
                                ? "Thanh toán khi nhận hàng"
                                : "Paypal"}
                            </td>
                            <td className="px-1 py-4">
                              {convertPrice(item.totalPrice)}
                            </td>
                            <td className="px-1 py-4 text-right">
                              <button
                                onClick={() => handleUpdateOrder(item._id)}
                              >
                                <div
                                  className="font-medium mx-3 inline-block text-blue-600
                                dark:text-blue-500 hover:underline"
                                >
                                  Tình trạng
                                </div>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                ) : (
                  <th
                    colSpan={12}
                    className="text-center py-3  dark:text-white"
                  >
                    Không có khách hàng
                  </th>
                )}
              </table>
            </div>
          </div>
        </>
      </HomeAdmin>
    </div>
  );
};

export default AdminOrder;
