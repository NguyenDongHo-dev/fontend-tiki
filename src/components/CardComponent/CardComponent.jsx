import { FaCheckCircle, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";

const CardComponent = (product) => {
  const navigate = useNavigate();
  const {
    name,
    image,
    price,
    rating,
    selled,
    discount,
    idProduct,
    countInStrock,
  } = product;

  const handleId = (id) => {
    navigate(`/products/${id}`);
  };
  return (
    <div
      onClick={() => countInStrock !== 0 && handleId(idProduct)}
      className={` ${
        countInStrock === 0 ? "cursor-default" : "cursor-pointer"
      }  rounded-xl border-[1px]  transition-all border-[#ebebf0] bg-white  dark:border-none dark:hover:shadow-slate-900  hover:shadow-[20px_20px_20px_rgba(0,0,0,0.1)]`}
    >
      <div className=" w-40 h-40 mx-auto p-2 relative ">
        {countInStrock === 0 && (
          <div className=" absolute bg-[#0a68ff] text-white  font-bold text-xs top-1 left-0 p-1 rounded-lg">
            Đã hết hàng
          </div>
        )}

        <img className=" w-full h-full object-contain" src={image} />
      </div>
      <div className=" dark:bg-[#242526] py-2 ">
        <div className="p-2 flex flex-col gap-2 min-h-[170px]">
          <div className="flex items-center gap-1 text-[#0a68ff]">
            <FaCheckCircle />
            <p className=" text-[10px]">CHÍCH HÃNG</p>
          </div>

          <div>
            <h3 className=" min-h-[40px] text-base font-normal leading-[150%] dark:text-[#e4e6eb] line-clamp-2">
              {name}
            </h3>
          </div>
          <div className="min-w-[60px] rounded-xl text-[10px] font-semibold dark:text-[#e4e6eb] ">
            Còn {countInStrock}
          </div>
          <div className="flex gap-2  text-xs">
            <div className="flex gap-1 border-r-[1px] pr-1 items-center text-xs text-[#ffc400]">
              {rating}
              <FaStar className="text-[#ffc400]" />
            </div>
            <div className=" text-[10px] text-[rgb(128,128,137)] font-normal dark:text-white">
              {selled ? `Đã bán ${selled}+` : ""}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-[#0a68ff] text-base font-medium ">
              {convertPrice(price?.toLocaleString())}
              <sup className=" underline">đ</sup>
            </h1>
            <p className="text-[rgb(39,39,42)] font-medium inline-block text-xs rounded-full bg-[rgb(245,245,250)] dark:bg-[#18191a] px-2 dark:text-[#e4e6eb]">
              {discount != 0 && discount + "%"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
