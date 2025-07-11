import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { dataSelect } from "../../data";

const NavbarComponen = () => {
  const navigate = useNavigate();
  const url = useLocation().state;

  const NavItem = ({ name }) => {
    const handleNavigatetype = (type) => {
      navigate(
        `/${type
          .normalize("NFD")
          .replace(/[\u0300-\u036f-]/g, "")
          ?.replace(/ /g, "_")}`,
        { state: type }
      );
    };

    return (
      <div
        onClick={() => handleNavigatetype(name)}
        className={`${
          url === name && "bg-[rgba(39,39,42,0.12)]"
        }  transition-all px-4 py-[7px] rounded-xl hover:bg-[rgba(39,39,42,0.12)] cursor-pointer text-sm text-black dark:text-[#e4e6eb] font-normal `}
      >
        {name}
      </div>
    );
  };

  return (
    <div className=" w-[230px] bg-white px-2 py-3 rounded-xl dark:bg-[#242526] hidden lg:block h-screen overflow-y-auto ">
      <p className=" font-bold text-sm text-black pl-4 dark:text-white">
        Danh mục
      </p>
      <div className="flex flex-col gap-1 mt-3 ">
        {dataSelect.map((name) => {
          return <NavItem key={name?.item} name={name?.item} />;
        })}
      </div>
    </div>
  );
};

export default NavbarComponen;
