import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";

import { Link, useLocation } from "react-router-dom";
import { getProductType } from "../../services/ProductService";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { AiOutlineRight } from "react-icons/ai";

const TypeProductPage = () => {
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchProductType = async (type) => {
    setLoading(true);
    const res = await getProductType(type);
    
    if (res?.status === "OK") {
      setLoading(false);
      setProducts(res?.data);
    } else {
      setLoading(false);
    }
  };

  function removeVietnameseTones(str) {
    return str
     .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

  useEffect(() => {
    if (state) {
      const removeVN = removeVietnameseTones(state)
      
      
      fetchProductType(removeVN);
    }
  }, [state]);
  
  
  return (
    <div>
      <div className="bg-[#f5f5fa] pt-[10px] pb-[40px] dark:bg-[#18191a]">
        <div className="max-w-[1440px] mx-auto px-2 mb-3 flex items-center gap-2 text-[rgb(128,128,137)] dark:text-[#e4e6eb]">
          <Link to={"/"}>
            <h5 className="cursor-pointer hover:underline ">Trang Chủ</h5>
          </Link>
          <AiOutlineRight />
          <div className=" cursor-default  dark:text-[#e4e6eb]">
            <p>{state}</p>
          </div>
        </div>
        <div className="flex md:gap-5 gap-1 max-w-[1440px] mx-auto px-2 items-start ">
          <NavbarComponent />
          <div className=" w-[85%] flex flex-col justify-center ">
            {loading ? (
              <LoadingComponent />
            ) : (
              <>
               <div className=" grid sm:grid-cols- 4 gap-4 flex-1 xl:grid-cols-6 grid-cols-6 lg:grid-cols-5 grid-cols-2">
                {products?.map((product) => {
                  return (
                    <CardComponent
                      key={product._id}
                      name={product.name}
                      image={product.image}
                      price={product.price}
                      rating={product.rating}
                      discount={product.discount}
                      selled={product.selled}
                      idProduct={product._id}
                      countInStrock={product.countInStrock}
                    />
                  );
                })}
              </div>
                  <button className="text-[#0a68ff] disabled:cursor-not-allowed disabled:bg-slate-400 hover:bg-[rgba(0,96,255,0.12)] transition-all border-[#0a68ff] border-[1px] rounded-md py-2 px-3 text-base cursor-pointer mt-3 mx-auto w-60">
                  Xem Thêm
                  </button>
              </>
             
              
            )}

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeProductPage;
