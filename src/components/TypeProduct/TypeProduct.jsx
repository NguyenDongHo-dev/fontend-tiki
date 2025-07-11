import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();

  const handleNavigatetype = (type) => {
    navigate(
      `/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: type }
    );
  };
  return (
    <div>
      <li
        onClick={() => handleNavigatetype(name)}
        className=" text-sm font-normal cursor-pointer text-[#808089] dark:text-[#e4e6eb]"
      >
        {name}
      </li>
    </div>
  );
};

export default TypeProduct;
