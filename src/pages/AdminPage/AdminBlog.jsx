import React, { useEffect, useRef, useState } from "react";
import HomeAdmin from "./HomeAdmin";
import { useSelector } from "react-redux";
import { IoIosCloseCircle } from "react-icons/io";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

import LoadingComponent from "../../components/LoadingComponent/LoadingComponent.js";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getDetailsBlog,
  updataBlog,
} from "../../services/Blog";
import { dataSelect } from "../../data.js";
import { convertToBase64 } from "../../utils.js";
import ModalComponent from "../../components/ModalComponent/ModalComponent.jsx";
import { useDebounce } from "../../hooks/useDebounce.js";

const AdminBlog = () => {
  const user = useSelector((state) => state.user);

  const [dataBlogs, setDataBlogs] = useState([]);
  const [dataDetailBlog, setDataDetailBlog] = useState({});
  const [searchBlog, setSearchBlog] = useState("");
  const searchDebounce = useDebounce(searchBlog, 1000);

  const [loading, setLoading] = useState(false);

  const [showModalNewBlog, setShowModalNewBlog] = useState(false);
  const [showUpdated, setShopwUpdated] = useState(false);
  const [showDetele, setShowDetele] = useState(false);

  const [idBlog, setIdBlog] = useState();

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await getBlogs(searchDebounce, 100);
    if (res?.status === "OK") {
      setDataBlogs(res.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, [searchDebounce]);

  // create blog
  const Modals = () => {
    const [blog, setBlog] = useState({
      title: "",
      description: "",
      category: "Đồ Chơi & Mẹ và bé",
      image: "",
    });
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [error, setError] = useState(false);

    const handleOnChange = async (e) => {
      setBlog({
        ...blog,
        [e.target.id]: e.target.value,
      });
    };

    const handleOnChangeAvatar = async (e) => {
      const file = e.target.files[0];
      if (!file.url && !file.preview) {
        file.preview = await convertToBase64(file);
      }
      setBlog({
        ...blog,
        image: file.preview,
      });
    };

    const fetchCreate = async (data) => {
      setLoadingCreate(true);
      const res = await createBlog(data);
      if (res?.status === "OK") {
        setLoadingCreate(false);
        setShowModalNewBlog(false);
        fetchBlogs();
      } else {
        setError(res?.message);
      }
    };

    const handleFrom = (e) => {
      e.preventDefault();
      fetchCreate(blog);
    };

    return (
      <div
        class="relative z-10  "
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity "></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[800px]">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-[#242526] ">
                <div class="flex flex-col ">
                  <h3 className=" text-base font-semibold mb-3 inline">
                    Tạo mới blog
                  </h3>
                  <form onSubmit={handleFrom} className=" flex flex-col gap-3 ">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center flex-1 ">
                        <label className=" max-w-[100px] w-full">Title</label>
                        <input
                          id="title"
                          type="text"
                          value={blog.title}
                          placeholder="Tên blog"
                          className="w-full dark:text-black px-3 py-2 border flex-1 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleOnChange}
                        />
                      </div>
                      <div className="flex items-center">
                        <label className=" max-w-[50px] w-full">type</label>
                        <select
                          id="category"
                          onChange={handleOnChange}
                          value={blog.category}
                          className="rounded dark:text-black py-[10px] focus:outline-none px-3 w-full "
                        >
                          {dataSelect.map((name) => {
                            return (
                              <option value={name.item}>{name.item}</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className=" max-w-[100px] w-full">
                        Description
                      </label>
                      <ReactQuill
                        value={blog.description}
                        theme="snow"
                        className=" h-72 w-full dark:text-black"
                        placeholder="Mô tả blog"
                        onChange={(value) => {
                          setBlog({
                            ...blog,
                            description: value,
                          });
                        }}
                      />
                    </div>

                    <div className="flex items-center mt-10 ">
                      <label className=" max-w-[100px] w-full">
                        Hình ảnh blog
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
                      {blog?.image ? (
                        <img
                          src={blog?.image}
                          className=" ml-10 w-16 h-16 object-contain"
                        />
                      ) : null}
                    </div>

                    <button
                      disabled={loadingCreate}
                      class="inline-flex w-full disabled:cursor-default disabled:opacity-70 justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-70 sm:ml-3 sm:w-auto"
                    >
                      {loadingCreate ? "Loading..." : "Tạo"}
                    </button>
                    {error.length > 0 && (
                      <samp className=" text-red-500 font-medium">{error}</samp>
                    )}
                  </form>
                </div>
              </div>
              <div class=" dark:bg-[#18191a] bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={() => {
                    setShowModalNewBlog(!showModalNewBlog);
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

  ///update blog

  const fetchGetDetailBlog = async (id) => {
    const res = await getDetailsBlog(id);
    if (res?.status === "OK") {
      setDataDetailBlog(res.data);
    }
  };

  const handleUpdata = (e) => {
    setIdBlog(e.target.id);
    setShopwUpdated(!showUpdated);
    fetchGetDetailBlog(e.target.id);
  };

  const ModalUpdateBlog = ({ data }) => {
    const [errorUpdate, setErrorUpdate] = useState(null);
    const [dataUpdataBlog, setDataUpdataBlog] = useState({
      title: data?.title,
      category: data?.category,
      image: data?.image,
      _id: data?._id,
      description: data?.description,
    });

    const handleOnchangeUpdata = (e) => {
      setDataUpdataBlog({
        ...dataUpdataBlog,
        [e.target.id]: e.target.value,
      });
    };

    const handleOnChangeAvatar = async (e) => {
      const file = e.target.files[0];
      if (!file.url && !file.preview) {
        file.preview = await convertToBase64(file);
      }
      setDataUpdataBlog({
        ...dataUpdataBlog,
        image: file.preview,
      });
    };

    const fetchUpdataBlog = async (id, data, access_token) => {
      const res = await updataBlog(id, data, access_token);
      if (res?.status === "OK") {
        setShopwUpdated(false);
        fetchBlogs();
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      fetchUpdataBlog(data?._id, dataUpdataBlog, user?.access_token);
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
            <div className="p-2 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[800px]">
              <div
                className="p-2"
                onClick={() => {
                  setShopwUpdated(false);
                }}
              ></div>

              <div className="p-1">
                <div
                  onClick={() => setShopwUpdated(false)}
                  className="flex justify-end -mt-3"
                >
                  <IoIosCloseCircle size={23} />
                </div>
                <div className=" text-center text-base mb-2 font-bold -mt-3">
                  Thông tin blog
                </div>

                <form onSubmit={handleSubmit}>
                  <div className=" flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center flex-1">
                        <label className="w-full max-w-[100px] text-sm text-[rgb(51, 51, 51)] ">
                          Title
                        </label>
                        <input
                          className="rounded  px-3 py-2 focus:outline-none  w-full"
                          type="text"
                          id="title"
                          onChange={handleOnchangeUpdata}
                          value={dataUpdataBlog.title}
                        />
                      </div>
                      <div className="flex items-center">
                        <label className=" max-w-[50px] w-full text-sm text-[rgb(51, 51, 51)]">
                          type
                        </label>
                        <select
                          id="category"
                          onChange={handleOnchangeUpdata}
                          className="w-full"
                          value={dataUpdataBlog?.category}
                        >
                          {dataSelect.map((name) => {
                            return (
                              <option value={name.item}>{name.item}</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className=" max-w-[100px] w-full">
                        Description
                      </label>
                      <ReactQuill
                        theme="snow"
                        className=" h-72 w-full"
                        placeholder="Mô tả"
                        value={dataUpdataBlog.description}
                        onChange={(value) => {
                          setDataUpdataBlog({
                            ...dataUpdataBlog,
                            description: value,
                          });
                        }}
                      />
                    </div>

                    <div className="flex items-center mt-10">
                      <label className=" max-w-[100px] w-full">Hình ảnh</label>
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
                      {dataUpdataBlog.image ? (
                        <img
                          src={dataUpdataBlog.image}
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

  //detele blog

  const handleDelete = (e) => {
    setIdBlog(e.target.id);
    setShowDetele(true);
  };

  const handleCloseDelete = () => {
    setShowDetele(false);
  };

  const handleDeleteBlog = async () => {
    const res = await deleteBlog(idBlog, user?.access_token);
    if (res?.status === "OK") {
      const newDataDetele = dataBlogs.filter((el) => el._id !== idBlog);
      setDataBlogs(newDataDetele);
      setShowDetele(false);
    }
  };

  return (
    <HomeAdmin>
      <>
        <ModalComponent
          title="Xóa blog"
          open={showDetele}
          close={handleCloseDelete}
          onClick={handleDeleteBlog}
        >
          Bạn có chắc muốn xóa blog này,
        </ModalComponent>
        {showModalNewBlog ? <Modals /> : <></>}
        {showUpdated ? <ModalUpdateBlog data={dataDetailBlog} /> : <></>}

        <div className="flex justify-between items-center mb-5 ">
          <div className=" text-base font-bold">Quản lý tin túc</div>
          <button
            onClick={() => setShowModalNewBlog(!showModalNewBlog)}
            className="bg-[#1c64f2] px-3 py-2 text-white rounded-md"
          >
            Thêm blog
          </button>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <form className="flex items-center mb-3 ">
              <input
                onChange={(e) => setSearchBlog(e.target.value)}
                className=" dark:text-black focus:outline-none p-2 border-[#1c64f2] "
                type="text"
                placeholder="Search blog"
              />
            </form>
          </div>
        </div>
        {loading ? (
          <LoadingComponent />
        ) : (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-10 py-3">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Hình
                    </th>
                    <th scope="col" className="px-1 py-3">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      views
                    </th>
                    <th scope="col" className="px-1 py-3">
                      likes
                    </th>
                    <th scope="col" className="px-1 py-3">
                      dislikes
                    </th>
                    <th scope="col" className="px- py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {dataBlogs && dataBlogs?.length > 0 ? (
                    dataBlogs?.map((blog) => {
                      return (
                        <tr className="bg-white border-b dark:bg-gray-800  hover:bg-gray-50 ">
                          <th
                            scope="row"
                            className="px-10 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-[#e4e6eb]"
                          >
                            {blog?.title.length > 40
                              ? blog?.title.slice(0, 40) + "..."
                              : blog?.title}
                          </th>
                          <td className="px-6 py-1">
                            <img
                              className=" w-14 h-14 obj access_tokenect-contain"
                              src={blog.image}
                            />
                          </td>
                          <td className="px-1 py-4">{blog.category}</td>

                          <td className="px-6 py-4">{blog.numberViews}</td>
                          <td className="px-1 py-4">{blog.likes.length}</td>
                          <td className="px-1 py-4">{blog.dislikes.length}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={handleUpdata}>
                              <div
                                id={blog._id}
                                className="font-medium mx-3 inline-block text-blue-600
                      dark:text-blue-500 hover:underline"
                              >
                                Edit
                              </div>
                            </button>
                            <button onClick={handleDelete}>
                              <div
                                id={blog._id}
                                className="font-medium mx-3 inline-block text-blue-600
                      dark:text-blue-500 hover:underline"
                              >
                                Xoá
                              </div>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <th
                      colSpan={12}
                      className="text-center py-3 dark:text-white"
                    >
                      Không có blog
                    </th>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    </HomeAdmin>
  );
};

export default AdminBlog;
