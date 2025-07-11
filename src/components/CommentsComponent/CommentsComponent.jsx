import React from "react";

const CommentsComponent = (props) => {
  const { href, width } = props;
  return (
    <div className=" mt-4 bg-white py-2 rounded-lg">
      <div
        className="fb-comments"
        data-href={href}
        data-width={width}
        data-numposts="5"
      ></div>
    </div>
  );
};

export default CommentsComponent;
