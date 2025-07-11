import React from "react";
import Slider from "react-slick";
import slider1 from "../../ass/image/hinh1.jpg";
import slider2 from "../../ass/image/hinh2.jpg";
import slider3 from "../../ass/image/hinh3.jpg";
import slider4 from "../../ass/image/hinh4.jpg";
import slider5 from "../../ass/image/hinh5.jpg";
import slider6 from "../../ass/image/hinh6.jpg";
import slider7 from "../../ass/image/hinh7.jpg";

const SliderComponent = () => {
  const arrImages = [
    slider1,
    slider2,
    slider3,
    slider4,
    slider5,
    slider6,
    slider7,
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    autoplay: true,
    className: "hero",
  };
  return (
    <div className="bg-[#f5f5fa] mb-8 dark:bg-[#18191a] ">
      <div className="mt-3 px-[50px] ">
        <Slider {...settings}>
          {arrImages &&
            arrImages.map &&
            arrImages.map((image, index) => {
              return <img key={index} className=" w-full" src={image} />;
            })}
        </Slider>
      </div>
    </div>
  );
};

export default SliderComponent;
