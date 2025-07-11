import React from "react";
import SidebarAdmin from "./SidebarAdmin";

const HomeAdmin = ({ children }) => {
  return (
    <div className="flex flex-row justify-start ">
      <SidebarAdmin />
      <div className="flex-1 min-h-screen overflow-y-auto h-screen p-4">
        {children}
      </div>
    </div>
  );
};

export default HomeAdmin;
