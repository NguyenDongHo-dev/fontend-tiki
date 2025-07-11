import React from "react";

const LikeButtonComponent = (props) => {
  const { href } = props;
  return (
    <div
      className="fb-like"
      data-href={href}
      data-width=""
      data-layout="standard"
      data-action=""
      data-size=""
      data-share="true"
      data-colorscheme="dark"
    ></div>
  );
};

export default LikeButtonComponent;
