import React, { useEffect, useState } from "react";
import HomeAdmin from "./HomeAdmin";
import { convertToBase64 } from "../../utils";
import {
  // createProduct,
  deleteUser,
  getAllUser,
  getDetailsUser,
  updateUser,
} from "../../services/UserService";
import { useMutationHook } from "../../hooks/UserMutationHook";
import { useQuery } from "@tanstack/react-query";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const AdminProduct = () => {
  const user = useSelector((state) => state.user);

  const [show, setShow] = useState(false);
  const [idUser, setIdUser] = useState();
  const [showUpdated, setShopwUpdated] = useState(false);
  const [isModalOpenDetele, SetIsModalOpenDetele] = useState(false);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    _id: "",
    address: "",
  });

  const getAllUsers = async () => {
    const res = await getAllUser(user?.access_token);
    return res.data;
  };

  const fetchGetDetailsUser = async (id, token) => {
    const res = await getDetailsUser(id, token);
    if (res?.data) {
      setDataUser({
        name: res?.data.name,
        email: res?.data.email,
        phone: res?.data.phone,
        image: res?.data.image,
        address: res?.data.address,
        _id: res?.data._id,
      });
    }
  };

  const queryUsers = useQuery({
    queryKey: ["usersAdmin"],
    queryFn: getAllUsers,
    retry: true,
    retryDelay: 1000,
  });
  const { data, status } = queryUsers;

  const handleUpdata = (e) => {
    setIdUser(e.target.id);
    setShopwUpdated(!showUpdated);
  };

  const handleDelete = (e) => {
    setIdUser(e.target.id);
    SetIsModalOpenDetele(true);
  };

  useEffect(() => {
    if (idUser) {
      fetchGetDetailsUser(idUser, user?.access_token);
    }
  }, [idUser]);

  const handleCloseDelete = () => {
    SetIsModalOpenDetele(false);
  };

  const mutateDelete = useMutationHook((data) => {
    const { id, token } = data;
    const res = deleteUser(id, token);
    return res;
  });

  const handleDeleteUser = () => {
    mutateDelete.mutate(
      { id: idUser, token: user?.access_token },
      {
        onSettled: () => {
          queryUsers.refetch();
        },
      }
    );
  };

  const { isSuccess: isSuccessDelete } = mutateDelete;

  useEffect(() => {
    SetIsModalOpenDetele(false);
  }, [isSuccessDelete]);

  const ModalUpdateUser = ({ data }) => {
    const [dataUpdataUser, setDataUpdataUser] = useState({
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      image: data?.image,
      address: data?.address,
      _id: data?._id,
      access_token: user?.access_token,
    });
    const handleOnchangeUpdata = (e) => {
      setDataUpdataUser({
        ...dataUpdataUser,
        [e.target.id]: e.target.value,
      });
    };

    const handleOnChangeAvatar = async (e) => {
      const file = e.target.files[0];
      if (!file.url && !file.preview) {
        file.preview = await convertToBase64(file);
      }
      setDataUpdataUser({
        ...dataUpdataUser,
        image: file.preview,
      });
    };

    const mutation = useMutationHook((data) => {
      const { _id, access_token, ...rests } = data;
      const res = updateUser(_id, rests, access_token);
      return res;
    });

    const { isSuccess: isSuccessUpdate } = mutation;

    useEffect(() => {
      if (isSuccessUpdate) {
        setShopwUpdated(false);
      }
    }, [isSuccessUpdate]);

    const handleSubmit = (e) => {
      e.preventDefault();
      mutation.mutate(dataUpdataUser, {
        onSettled: () => {
          queryUsers.refetch();
        },
      });
    };
    return (
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="p-2 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div
                className="p-2"
                onClick={() => {
                  setShopwUpdated(false);
                }}
              >
                <IoMdCloseCircleOutline className="ml-auto text-[25px] opacity-50 hover:opacity-100 transition-all duration-200" />
              </div>
              <div className="p-1">
                <div className=" text-center text-base mb-2 font-bold -mt-3">
                  Thông tin người dùng
                </div>
                <form onSubmit={handleSubmit}>
                  <div className=" flex flex-col gap-3">
                    <div className="flex items-center">
                      <label className="w-full max-w-[110px] inline-block text-sm text-[rgb(51, 51, 51)] ">
                        Tên người dùng
                      </label>
                      <input
                        className="rounded py-[10px] focus:outline-none px-3 w-full"
                        type="text"
                        id="name"
                        onChange={handleOnchangeUpdata}
                        value={dataUpdataUser.name}
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-full max-w-[110px] inline-block text-sm text-[rgb(51, 51, 51)]">
                        email
                      </label>
                      <input
                        className="rounded py-[10px] focus:outline-none px-3 w-full"
                        type="email"
                        id="email"
                        onChange={handleOnchangeUpdata}
                        value={dataUpdataUser.email}
                      />
                    </div>
                    <div className="flex items-center gap-7 ">
                      <div className="flex items-center">
                        <label className="w-full max-w-[110px] inline-block text-sm text-[rgb(51, 51, 51)]">
                          phone
                        </label>
                        <input
                          className="rounded py-[10px] focus:outline-none px-3 w-[100px]"
                          type="text"
                          id="phone"
                          onChange={handleOnchangeUpdata}
                          value={dataUpdataUser.phone}
                        />
                      </div>
                      <div className="flex items-center">
                        <label className=" inline-block text-sm text-[rgb(51, 51, 51)] mr-4">
                          address
                        </label>
                        <input
                          className="rounded py-[10px] focus:outline-none px-3 w-[70px]"
                          type="text"
                          id="address"
                          onChange={handleOnchangeUpdata}
                          value={dataUpdataUser.address}
                        />
                      </div>
                    </div>

                    <div className="flex items-center ">
                      <label className=" max-w-[120px] w-full">Hình ảnh</label>
                      <label
                        htmlFor="image"
                        className="py-1 px-2 bg-blue-500 rounded hover:bg-blue-700 transition-all duration-200"
                      >
                        Hình
                      </label>

                      <input
                        id="image"
                        onChange={handleOnChangeAvatar}
                        type="file"
                        placeholder="Giá sản phẩm"
                        className="w-full px-3 py-2 node  hidden border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        accept=".png,.jpg,.jpeg"
                      />
                      {dataUpdataUser.image ? (
                        <img
                          src={dataUpdataUser.image}
                          className=" ml-10 w-16 h-16 object-contain"
                        />
                      ) : null}
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
    <HomeAdmin>
      <ModalComponent
        title="Xóa người dùng"
        open={isModalOpenDetele}
        close={handleCloseDelete}
        onClick={handleDeleteUser}
      >
        Bạn có chắc muốn xóa người dùng này,
      </ModalComponent>
      {showUpdated ? <ModalUpdateUser data={dataUser} /> : <></>}
      {status === "pending" ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <div className=" text-base font-bold">Quản lý người dùng</div>
          </div>
          <div>
            <form className="flex items-center mb-3 ">
              <input
                className=" focus:outline-none p-2 border-[#1c64f2] "
                type="text"
                placeholder="Search name"
              />
              <button className="bg-[#1c64f2] po px-3 py-2">Search</button>
            </form>
          </div>
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-10 py-3">
                      Tên người dùng
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-1 py-3">
                      SĐT
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Địa chỉ
                    </th>
                    <th scope="col" className="px- py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item) => {
                    return (
                      <tr className="bg-white border-b dark:bg-gray-800  hover:bg-gray-50 ">
                        <th
                          scope="row"
                          className="px-10 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-[#e4e6eb]"
                        >
                          {item.name}"
                        </th>
                        <td className="px-1 py-4">{item.email}</td>

                        <td className="px-1 py-4">{item.phone}</td>

                        <td className="px-6 py-4">{item.address}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={handleUpdata}>
                            <div
                              id={item._id}
                              className="font-medium mx-3 inline-block text-blue-600
                          dark:text-blue-500 hover:underline"
                            >
                              Edit
                            </div>
                          </button>
                          <button>
                            <div
                              onClick={handleDelete}
                              id={item._id}
                              className="font-medium mx-3 inline-block text-blue-600
                          dark:text-blue-500 hover:underline"
                            >
                              Xoá
                            </div>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </HomeAdmin>
  );
};

export default AdminProduct;
