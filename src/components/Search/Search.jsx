import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Search = ({ dataSearch, setSearch, handleLoadMore, disabled }) => {
  const navigate = useNavigate();




  return (
    <>
      {dataSearch?.length > 0 ? (
        <div className=" max-h-[350px] overflow-y-auto">
          <div className="flex flex-col  ">
            {dataSearch.map((data) => {
              return (
                <div
                  onClick={() => {
                    setSearch({
                      search:""
                    });
                    navigate(`/products/${data._id}`);
                  }}
                  key={data._id}
                  className=" cursor-pointer hover:bg-gray-300 p-1 hover:dark:bg-[#242526]"
                >
                  <div className="flex gap-3  items-center pl-[16px]">
                    <img
                      className=" w-10 object-cover"
                      src={data.image}
                      alt="product"
                    />
                    <div className=" font-semibold line-clamp-1">
                      {" "}
                      {data.name}
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              disabled={disabled}
              onClick={handleLoadMore}
              className="text-[#0a68ff] disabled:opacity-20 disabled:hover:text-[#0a68ff] disabled:cursor-default hover:text-blue-400 cursor-pointer mx-auto w-[150px] inline-block  p-2 mt-1 "
            >
              Xem thêm
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2">Không có sản phẩm tìm thấy</div>
      )}
    </>
  );
};

export default Search;
