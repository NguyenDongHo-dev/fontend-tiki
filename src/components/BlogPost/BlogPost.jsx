import React, { useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";
import { AiOutlineStar } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { getBlogs } from "../../services/Blog";
import Slider from "react-slick";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplaySpeed: 10000,
  autoplay: true,
  className: "blog",
};
const BlogPost = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const fetchBlogs = async (limit) => {
    const res = await getBlogs(limit);
    if (res?.status === "OK") {
      setData(res.data);
    }
  };

  useEffect(() => {
    fetchBlogs(10);
  }, []);
  return (
    <div className="max-w-[1440px] mx-auto dark:bg-[#242526] bg-white my-10 pb-7 px-2 rounded">
      <h2 className=" font-semibold text-xl  py-4 border-b-[3px] border-[#0a68ff] mb-4">
        Tin tức
      </h2>
      <div className=" -mx-3">
        <Slider {...settings}>
          {data.length > 0 &&
            data?.map((blog) => {
              return (
                
                <div
                key={blog._id}
                  className="w-full px-3"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  <div className="h-[256px] w-full">
                    <img
                      className="w-full h-full object-contain  hover:scale-[0.95] duration-300"
                      src={blog.image}
                    />
                  </div>

                  <div className="mt-5 px-4 ">
                    <div className="flex flex-col gap-4 text-center">
                      <h2 className=" text-lg font-semibold  line-clamp-1">
                        {blog?.title}
                      </h2>
                      <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-1">
                          <AiOutlineStar className="inline-block" />
                          <div>{blog.category}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <IoEye className="inline-block" />
                          <div>{blog.numberViews}</div>
                        </div>
                      </div>
                      <div
                        className=" line-clamp-1"
                        dangerouslySetInnerHTML={{
                          __html: blog?.description,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </Slider>
      </div>

      <div className="flex items-center justify-center mt-5">
        <Link
          className="py-2 px-2 border-[1px] rounded hover:text-white hover:bg-black duration-75"
          to={"/blogs"}
        >
          Xem tất cả
        </Link>
      </div>
    </div>
  );
};

export default BlogPost;
