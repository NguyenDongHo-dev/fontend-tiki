import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { MdRemoveRedEye } from "react-icons/md";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { dislikeBlog, getDetailsBlog, likeBlog } from "../../services/Blog";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModalComponent";

const DetailBlog = () => {
  const navigate = useNavigate();

  const [dataBlog, setDataBlos] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.user);

  const { id } = useParams();
  useEffect(() => {
    const fetchDetailBlog = async (id) => {
      setLoading(true);
      const res = await getDetailsBlog(id);
      if (res.status === "OK") {
        setDataBlos(res.data);
        setLoading(false);
      } else {
        return <div>Not Detail</div>;
      }
    };
    fetchDetailBlog(id);
  }, [id]);

  const handleLike = async (id) => {
    if (user?.access_token.length > 0) {
      const res = await likeBlog(id, user.access_token);
      setDataBlos(res.data);
    } else {
      setShowModal(true);
    }
  };

  const handleDislike = async (id) => {
    if (user?.access_token.length > 0) {
      const res = await dislikeBlog(id, user.access_token);
      setDataBlos(res.data);
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <ModalComponent
            title={"Đăng nhập"}
            open={showModal}
            close={handleCloseModal}
            onClick={() => navigate("/login")}
          >
            Bạn cần phải đăng nhập mới thực hiện được
          </ModalComponent>
          <div className=" py-4 bg-[#f7f7f7] dark:bg-[#18191a]">
            <div className="max-w-[1440px] px-5 mx-auto flex gap-2 items-center">
              <Link className="hover:text-[#0a68ff]" to={"/"}>
                Trang chủ
              </Link>
              /
              <Link className="hover:text-[#0a68ff]" to={"/blogs"}>
                Tin tức
              </Link>
              /
              <h2 className="font-semibold text-xl cursor-default">
                {dataBlog?.title}
              </h2>
            </div>
          </div>
          <div className=" max-w-[1440px] px-5 mx-auto bg-white dark:bg-[#242526] py-2">
            <div className="flex gap-4 items-center py-5">
              <div className="flex items-center gap-1">
                {dataBlog?.likes?.length}
                <AiFillLike onClick={() => handleLike(dataBlog?._id)} className={`inline-block ${
                    dataBlog?.likes?.find((el) => el === user?.id) && " text-[#0a68ff]"} cursor-pointer`} />
              </div>
              <div className="flex items-center gap-1">
                {dataBlog?.dislikes?.length}
                <AiFillDislike onClick={() => handleDislike(dataBlog?._id)} className={`inline-block ${
                    dataBlog?.dislikes?.find((el) => el === user?.id) && " text-[#0a68ff]"} cursor-pointer`} />
              </div>
              <div className="flex items-center gap-1">
                {dataBlog?.numberViews}{" "}
                <MdRemoveRedEye className={"inline-block"} />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="w-full h-[700px] flex items-center justify-center ">
                <img
                  className="w-full h-full object-contain"
                  src={dataBlog?.image}
                />
              </div>
              <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: dataBlog?.description }}
              ></div>
              <div className="flex justify-end">
                <div className="flex gap-2 items-center cursor-pointer text-[#0a68ff] font-normal text-lg">
                  <FaLongArrowAltLeft className=" inline-block" />
                  <Link to="/blogs">Quay về</Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailBlog;
