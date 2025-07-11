import React from "react";

const Welfare = () => {
  return (
    <div className="max-w-[1440px] mx-auto border-t-[4px] dark:bg-[#242526] bg-white  px-2 border-[#0a68ff]">
      <div className=" grid grid-cols-3 h-[120px]">
        <div className="flex items-center justify-start gap-3 w-full ">
          <img
            className="w-[3.125rem]"
            src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/6c502a2641457578b0d5f5153b53dd5d.png"
          />
          <div>
            <p>7 ngày miễn phí trả hàng</p>
            <p>Trả hàng miễn phí trong 7 ngày</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 w-full ">
          <img
            className="w-[3.125rem]"
            src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/511aca04cc3ba9234ab0e4fcf20768a2.png"
          />
          <div>
            <p>Hàng chính hãng 100%</p>
            <p>Đảm bảo hàng chính hãng hoặc hoàn tiền gấp đôi</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 w-full ">
          <img
            className="w-[3.125rem]"
            src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/16ead7e0a68c3cff9f32910e4be08122.png"
          />
          <div>
            <p>Miễn phí vận chuyển</p>
            <p>Giao hàng miễn phí toàn quốc</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welfare;
