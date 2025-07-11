import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { getBlogs, getDetailsBlog } from "../../services/Blog";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const navigate = useNavigate();
  const [dataBlogs, setDataBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await getBlogs();
      if (res.status === "OK") {
        setDataBlogs(res.data);
      }
    };
    fetchBlogs();
  }, []);
 

  return (
    <div>
      <div className=" py-4 bg-[#f7f7f7] dark:bg-[#18191a]">
        <div className="max-w-[1440px] px-5 mx-auto  flex gap-2">
          <Link className=" hover:underline" to={"/"}>
            Trang chủ
          </Link>
          <samp className=" cursor-default">/</samp>
          <div className=" cursor-default">Tin tức</div>
        </div>
      </div>
      <div className=" max-w-[1440px] px-5 mx-auto bg-white dark:bg-[#242526] py-2 min-h-screen">
        {/* row */}
        <div className="pt-4">
          <div className="flex flex-col md:flex-row gap-5">
            <div className=" md:w-3/4 w-full flex flex-col gap-14">
              {dataBlogs?.map((blog) => {
                return (
                  <div
                    key={blog._id}
                    onClick={() => navigate(`/blog/${blog._id}`)}
                  >
                    <div className="flex gap-5  ">
                      <div className=" cursor-pointer  ">
                        <img src={blog.image} className=" min-w-[465px] " />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col gap-4 items-start ">
                          <h2 className=" cursor-pointer text-lg font-semibold line-clamp-2">
                            {blog?.title}
                          </h2>
                          <div className="flex gap-6 text-[#999] ">
                            <samp className=" cursor-pointer">
                              {blog?.category}
                            </samp>
                            <div className="flex items-center gap-1">
                              <div>{blog?.numberViews}</div>
                              <IoEye className="inline-block" />
                            </div>
                          </div>
                          <div
                            className=" line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: blog?.description,
                            }}
                          ></div>
                          <button className=" cursor-pointer inline text-[#ee3131]">
                            Đọc thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="md:w-1/4 w-full ">
              <div className="w-full text-white p-[14px] bg-[#0a68ff] font-semibold text-xl uppercase ">
                Tin tức
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
