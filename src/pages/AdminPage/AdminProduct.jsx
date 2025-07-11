import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import HomeAdmin from "./HomeAdmin";
import { convertPrice, convertToBase64 } from "../../utils";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getDetailsProduct,
  updataProduct,
  SortSearchFilerProduct,
} from "../../services/ProductService";
import { useMutationHook } from "../../hooks/UserMutationHook";
import { useQuery } from "@tanstack/react-query";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { dataSelect } from "../../data";
import { useDebounce } from "../../hooks/useDebounce";
import Paginate from "../../components/Paginate/Paginate";

const AdminProduct = () => {
  const limit = 20;
  const [page, setPage] = useState(1);
  const [allProduct, setAllProduct] = useState([]);
  const tableRef = useRef(null);
  const user = useSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const searchDebounce = useDebounce(searchValue, 1000);

  const [show, setShow] = useState(false);
  const [idProduct, setIdproduct] = useState();
  const [showUpdated, setShopwUpdated] = useState(false);
  const [isModalOpenDetele, SetIsModalOpenDetele] = useState(false);
  const [dataPorduct, setDataProduct] = useState({
    name: "",
    description: "",
    price: 0,
    type: "",
    countInStrock: "",
    rating: "",
    image: "",
    _id: "",
  });

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const searchValue = context?.queryKey && context?.queryKey[2];
    const pageTaget = context?.queryKey && context?.queryKey[3];

    const res = await getAllProduct(
      searchValue,
      "name_normalized",
      limit,
      pageTaget
    );
    return res;
  };

  const fetchGetDetailsPorduct = async (id) => {
    const res = await getDetailsProduct(id);
    if (res?.data) {
      setDataProduct({
        name: res?.data.name,
        description: res?.data.description,
        price: res?.data.price,
        type: res?.data.type,
        countInStrock: res?.data.countInStrock,
        rating: res?.data.rating,
        image: res?.data.image,
        discount: res?.data.discount,
        _id: res?.data._id,
      });
    }
  };

  const queryProducts = useQuery({
    queryKey: ["productsAdmin", limit, searchDebounce, page],
    queryFn: fetchProductAll,
    retry: true,
    retryDelay: 1000,
  });
  const { data, status } = queryProducts;

  useEffect(() =>{
    if (searchDebounce?.length > 0) {
      setPage(1)
    }
      setAllProduct(data?.data)
  }
   , [data, page,status]);

  

  const handleUpdata = (e) => {
    setIdproduct(e.target.id);
    setShopwUpdated(!showUpdated);
  };

  const handleDelete = (e) => {
    setIdproduct(e.target.id);
    SetIsModalOpenDetele(true);
  };

  useEffect(() => {
    if (idProduct) {
      fetchGetDetailsPorduct(idProduct);
    }
  }, [idProduct]);

  const handleCloseDelete = () => {
    SetIsModalOpenDetele(false);
  };

  const mutateDelete = useMutationHook((data) => {
    const { id, token } = data;
    const res = deleteProduct(id, token);
    return res;
  });

  const handleDeleteProduct = () => {
    mutateDelete.mutate(
      { id: idProduct, token: user?.access_token },
      {
        onSettled: () => {
          queryProducts.refetch();
        },
      }
    );
  };

  const { isSuccess: isSuccessDelete } = mutateDelete;

  useEffect(() => {
    SetIsModalOpenDetele(false);
  }, [isSuccessDelete]);

  const ModalUpdateProduct = ({ data }) => {
    const [dataUpdataProduct, setDataUpdataProduct] = useState({
      name: data?.name,
      description: data?.description,
      price: data?.price,
      type: data?.type,
      countInStrock: data?.countInStrock,
      rating: data?.rating,
      image: data?.image,
      _id: data?._id,
      discount: data?.discount,
      access_token: user?.access_token,
    });
    const handleOnchangeUpdata = (e) => {
      setDataUpdataProduct({
        ...dataUpdataProduct,
        [e.target.id]: e.target.value,
      });
    };

    const handleOnChangeAvatar = async (e) => {
      const file = e.target.files[0];
      if (!file.url && !file.preview) {
        file.preview = await convertToBase64(file);
      }
      setDataUpdataProduct({
        ...dataUpdataProduct,
        image: file.preview,
      });
    };

    const mutation = useMutationHook((data) => {
      const { _id, access_token, ...rests } = data;
      const res = updataProduct(_id, rests, access_token);
      return res;
    });

    const { isSuccess: isSuccessUpdate, status: statusUpdata } = mutation;

    useEffect(() => {
      if (isSuccessUpdate) {
        getAllProduct();
        setShopwUpdated(false);
      }
    }, [isSuccessUpdate]);

    const handleSubmit = (e) => {
      e.preventDefault();
      mutation.mutate(dataUpdataProduct, {
        onSettled: () => {
          queryProducts.refetch();
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
            <div className="p-2 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[1000px]">
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
                  Thông tin sản phẩm
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center flex-1 ">
                        <label className=" max-w-[120px] w-full">
                          Tên sản phẩm
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Tên sản phẩm"
                          className="w-full px-3 py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleOnchangeUpdata}
                          value={dataUpdataProduct.name}
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <label className=" max-w-[120px] w-full">
                            Loại sản phẩm
                          </label>

                          <select
                            id="type"
                            onChange={handleOnchangeUpdata}
                            value={dataUpdataProduct.type}
                            className="rounded py-[10px] focus:outline-none px-3 w-full "
                            autofocus
                          >
                            {dataSelect.map((name, index) => {
                              return (
                                <option value={name.item}>{name.item}</option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center ">
                        <label className=" max-w-[120px] w-full">Rating</label>
                        <input
                          id="rating"
                          type="text"
                          placeholder="Số sao"
                          className="w-[80px] px-3 py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleOnchangeUpdata}
                          value={dataUpdataProduct.rating}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center ">
                        <label className=" max-w-[120px] w-full">
                          Số lượng trong kho
                        </label>
                        <input
                          onChange={handleOnchangeUpdata}
                          value={dataUpdataProduct.countInStrock}
                          id="countInStrock"
                          type="text"
                          placeholder="Số lượng trong kho"
                          className="w-full px-3 py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center flex-1 ">
                        <label className=" max-w-[80px] w-full">Giảm giá</label>
                        <input
                          id="discount"
                          type="text"
                          placeholder="Giảm giá"
                          className="w-full px-3 py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleOnchangeUpdata}
                          value={dataUpdataProduct.discount}
                        />
                      </div>
                      <div className="flex items-center flex-1 ">
                        <label className=" max-w-[80px] w-full">Giá</label>
                        <input
                          onChange={handleOnchangeUpdata}
                          value={dataUpdataProduct.price}
                          id="price"
                          type="text"
                          placeholder="Giá sản phẩm"
                          className="w-full px-3 py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className=" max-w-[120px] w-full">
                        Description
                      </label>
                      <ReactQuill
                        theme="snow"
                        className=" h-72 w-full"
                        placeholder="Mô tả"
                        value={dataUpdataProduct.description}
                        onChange={(value) => {
                          setDataUpdataProduct({
                            ...dataUpdataProduct,
                            description: value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-center mt-10 ">
                      <label className=" max-w-[120px] w-full">Hình ảnh</label>
                      <label
                        htmlFor="image"
                        className="py-1 px-2 bg-blue-500 rounded hover:bg-blue-700 transition-all duration-200"
                      >
                        Chọn file
                      </label>

                      <input
                        id="image"
                        type="file"
                        placeholder="Giá sản phẩm"
                        className="w-full px-3 py-2 node  hidden border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleOnChangeAvatar}
                        accept=".png,.jpg,.jpeg"
                      />
                      {dataUpdataProduct?.image ? (
                        <img
                          src={dataUpdataProduct?.image}
                          className=" ml-10 w-16 h-16 object-contain"
                        />
                      ) : null}
                    </div>
                    {data?.status === "ERR" && (
                      <span className=" text-red-600">{data?.message}!</span>
                    )}
                    {data?.status === "OK" && (
                      <span className=" text-green-600">{data?.message}!</span>
                    )}
                    <button
                      disabled={status === "pending"}
                      class="inline-flex w-full disabled:cursor-default disabled:opacity-70 justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-70 sm:ml-3 sm:w-auto"
                    >
                      {status === "pending"
                        ? "Loading..."
                        : "Cập nhật sản phẩm"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Modals = () => {
    const [product, setProduct] = useState({
      name: "",
      description: "",
      price: 0,
      type: "Đồ Chơi & Mẹ và bé",
      countInStrock: "",
      rating: "",
      discount: "",
    });
    const handleOnChange = async (e) => {
      setProduct({
        ...product,
        [e.target.id]: e.target.value,
      });
    };

    const handleOnChangeAvatar = async (e) => {
      const file = e.target.files[0];
      if (!file.url && !file.preview) {
        file.preview = await convertToBase64(file);
      }
      setProduct({
        ...product,
        image: file.preview,
      });
    };

    const mutation = useMutationHook((data) => {
      const {
        image,
        name,
        type,
        price,
        countInStrock,
        rating,
        description,
        discount,
      } = data;
      const res = createProduct(
        {
          image,
          name,
          type,
          price,
          countInStrock,
          rating,
          description,
          discount,
        },
        user?.access_token
      );

      return res;
    });

    const handleFrom = (e) => {
      e.preventDefault();

      mutation.mutate(product, {
        onSettled: () => {
          queryProducts.refetch();
        },
      });
    };

    const { data, status, isSuccess, isError } = mutation;

    useEffect(() => {
      if (isSuccess && data?.status === "OK") {
        setShow(false);
      }
    }, [isSuccess, isError]);
    return (
      <div
        class="relative z-10  "
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto  ">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[1000px]">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-[#242526] ">
                <div class="flex flex-col ">
                  <h3 className=" text-base font-semibold mb-3 inline">
                    Tạo mới sản phẩm
                  </h3>
                  <form onSubmit={handleFrom}>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center flex-1 ">
                          <label className=" max-w-[120px] w-full">
                            Tên sản phẩm
                          </label>
                          <input
                            id="name"
                            type="text"
                            placeholder="Tên sản phẩm"
                            className=" dark:text-black w-full px-3 py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleOnChange}
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <label className=" max-w-[120px] w-full">
                              Loại sản phẩm
                            </label>
                            <select
                              id="type"
                              onChange={handleOnChange}
                              className="rounded dark:text-black py-[10px] focus:outline-none px-3 w-full "
                            >
                              {dataSelect.map((name, index) => {
                                return (
                                  <option value={name.item}>{name.item}</option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center ">
                          <label className=" max-w-[120px] w-full">
                            Rating
                          </label>
                          <input
                            id="rating"
                            type="text"
                            placeholder="Số sao"
                            className="w-[80px] dark:text-black px-3 py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleOnChange}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center ">
                          <label className=" max-w-[120px] w-full">
                            Số lượng trong kho
                          </label>
                          <input
                            id="countInStrock"
                            type="text"
                            placeholder="Số lượng trong kho"
                            className="w-full dark:text-black px-3 py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleOnChange}
                          />
                        </div>

                        <div className="flex items-center flex-1 ">
                          <label className=" max-w-[80px] w-full">
                            Giảm giá
                          </label>
                          <input
                            id="discount"
                            type="text"
                            placeholder="Giảm giá"
                            className="w-full px-3 dark:text-black py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleOnChange}
                          />
                        </div>
                        <div className="flex items-center flex-1 ">
                          <label className=" max-w-[80px] w-full">Giá</label>
                          <input
                            id="price"
                            type="text"
                            placeholder="Giá sản phẩm"
                            className="w-full px-3 dark:text-black py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleOnChange}
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label className=" max-w-[120px] w-full">
                          Description
                        </label>

                        <ReactQuill
                          theme="snow"
                          className=" h-72 w-full dark:text-white placeholder:text-white"
                          placeholder="Mô tả"
                          value={product.description}
                          onChange={(value) => {
                            setProduct({ ...product, description: value });
                          }}
                        />
                      </div>
                      <div className="flex items-center mt-10 ">
                        <label className=" max-w-[120px] w-full">
                          Hình ảnh
                        </label>
                        <label
                          htmlFor="image"
                          className="py-1 px-2 bg-blue-500 rounded hover:bg-blue-700 transition-all duration-200"
                        >
                          Chọn file
                        </label>

                        <input
                          id="image"
                          type="file"
                          placeholder="Giá sản phẩm"
                          className="w-full px-3 py-2 node  hidden border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleOnChangeAvatar}
                          accept=".png,.jpg,.jpeg"
                        />
                        {product?.image ? (
                          <img
                            src={product?.image}
                            className=" ml-10 w-16 h-16 object-contain"
                          />
                        ) : null}
                      </div>
                      {data?.status === "ERR" && (
                        <span className=" text-red-600">{data?.message}!</span>
                      )}
                      {data?.status === "OK" && (
                        <span className=" text-green-600">
                          {data?.message}!
                        </span>
                      )}
                      <button
                        disabled={status === "pending"}
                        class="inline-flex w-full disabled:cursor-default disabled:opacity-70 justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-70 sm:ml-3 sm:w-auto"
                      >
                        {status === "pending" ? "Loading..." : "Tạo"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-[#18191a] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={() => {
                    setShow(!show);
                  }}
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
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
        title="Xóa sản phẩm"
        open={isModalOpenDetele}
        close={handleCloseDelete}
        onClick={handleDeleteProduct}
      >
        Bạn có chắc muốn xóa sản phẩm này,
      </ModalComponent>
      {showUpdated ? <ModalUpdateProduct data={dataPorduct} /> : <></>}
      {show ? <Modals /> : <></>}

      <>
        <div className="flex justify-between items-center mb-5 ">
          <div className=" text-base font-bold">Quản lý sản phẩm</div>
          <button
            className="bg-[#1c64f2] px-3 py-2 text-white rounded-md"
            onClick={() => {
              setShow(!show);
            }}
          >
            Thêm sản phẩm
          </button>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <form className="flex mb-3 items-center gap-3 ">
              <input
                onChange={(e) => setSearchValue(e.target.value)}
                className=" dark:text-black focus:outline-none p-2 border-[#1c64f2] "
                type="text"
                placeholder="Search name"
              />
            </form>
          </div>
        </div>
        {status === "pending" ? (
          <LoadingComponent />
        ) : (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table
                ref={tableRef}
                className="w-full text-sm text-left rtl:text-right text-gray-500 "
              >
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-10 py-3">
                      Tên sản phẩm
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Hình
                    </th>
                    <th scope="col" className="px-1 py-3">
                      Giá sản phẩm
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Loại sản phẩm
                    </th>
                    <th scope="col" className="px-1 py-3">
                      Số lượng trong kho
                    </th>
                    <th scope="col" className="px- py-3"></th>
                  </tr>
                </thead>
                {data?.total > 0 ? (
                  <tbody>
                    {allProduct?.map((item) => {
                      return (
                        <tr className="bg-white border-b dark:bg-gray-800  hover:bg-gray-50 ">
                          <th
                            scope="row"
                            className="px-10 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-[#e4e6eb]"
                          >
                            {item?.name.length > 40
                              ? item?.name.slice(0, 40) + "..."
                              : item?.name}
                            "
                          </th>
                          <td className="px-6 py-1">
                            <img
                              className=" w-14 h-14 obj access_tokenect-contain"
                              src={item.image}
                            />
                          </td>
                          <td className="px-1 py-4">
                            {convertPrice(item.price)}
                          </td>

                          <td className="px-6 py-4 ">
                            {" "}
                            {item?.type.length > 20
                              ? item?.type.slice(0, 20) + "..."
                              : item?.type}
                          </td>
                          <td className="px-1 py-4">{item.countInStrock}</td>
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
                ) : (
                  <th colSpan={12} className="text-center py-3 dark:text-white">
                    không có sản phẩm
                  </th>
                )}
              </table>
              <Paginate 
               currentPage={page}   
                totalPages={data.totalPages}
                onPageChange={(pew) => setPage(pew)} 

                />
            </div>
          </div>
        )}
      </>
    </HomeAdmin>
  );
};

export default AdminProduct;
