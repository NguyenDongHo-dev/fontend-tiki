import React, { useEffect, useState } from "react";
import { getAllProductSort } from "../../services/ProductService.js";
import Slider from "react-slick";
import CardComponent from "../CardComponent/CardComponent.jsx";

const taps = [
  { id: 1, name: "Bán nhiều nhất" },
  { id: 2, name: "Mới nhất" },
  { id: 3, name: "Top sale" },
];

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplaySpeed: 5000,
  autoplay: true,
  className: "hero",
};
const BestSeller = () => {
  const [dataProduct, setDataProduct] = useState({});
  const [dataBestSeller, setDataBestSeller] = useState({});
  const [dataAtCreate, setDataAtCreate] = useState({});
  const [dataDiscount, setDataDiscount] = useState({});

  const [idAcctive, setIdAcctive] = useState(1);

  const fetctProduct = async () => {
    const res = await Promise.all([
      getAllProductSort("selled", -1, 10),
      getAllProductSort("createdAt", -1, 10),
      getAllProductSort("discount", -1, 10),
    ]);

    if (res[0]?.status === "OK") {
      setDataBestSeller(res[0]?.data);
      setDataProduct(res[0]?.data);
    }
    if (res[1]?.status === "OK") setDataAtCreate(res[1]?.data);
    if (res[2]?.status === "OK") setDataDiscount(res[2]?.data);
  };

  useEffect(() => {
    fetctProduct();
  }, []);

  useEffect(() => {
    if (idAcctive === 1) setDataProduct(dataBestSeller);
    if (idAcctive === 2) setDataProduct(dataAtCreate);
    if (idAcctive === 3) setDataProduct(dataDiscount);
  }, [idAcctive]);

  return (
    <div>
      <div className=" border-b-2 pb-[15px] border-[#0a68ff] mb-5">
        <div className=" text-[18px]  text-gray-500 font-semibold flex items-center dark:text-[#868686] ">
          {taps.map((el) => {
            return (
              <div
                key={el.id}
                className={`mr-[20px]
                pr-[20px]  ${taps.length != el.id ? " border-r-2 " : ""}`}
              >
                <samp
                  onClick={() => setIdAcctive(el.id)}
                  className={`cursor-pointer ${
                    idAcctive === el.id ? " text-black dark:text-white " : ""
                  } 
             
                `}
                  key={el.id}
                >
                  {el.name}
                </samp>
              </div>
            );
          })}
        </div>
      </div>
      <div className=" -mx-3">
        <Slider {...settings}>
          {dataProduct.length > 0 &&
            dataProduct?.map((product) => {
              return (
                <div key={product._id} className=" px-3">
                  <CardComponent
                    key={product._id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    rating={product.rating}
                    discount={product.discount}
                    selled={product.selled}
                    countInStrock={product.countInStrock}
                    idProduct={product._id}
                  />
                </div>
              );
            })}
        </Slider>
      </div>
    </div>
  );
};

export default BestSeller;
