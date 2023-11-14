import React, { useState } from "react";

const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => {
  const classStirng = "w-6 h-1 background-primary-color rounded-full duration-200";
  return (
    <div className="fit-content p-3">
      <div className={`${classStirng} transition-transform ${isOpen ? "rotate-45": "rotate-0"}`}></div>
      <div className={`${classStirng} transition-opacity`}></div>
      <div className={`${classStirng} transition-transform ${isOpen ? "-rotate-45": "rotate-0"}`}></div>
    </div>
  );
};

export default HamburgerIcon;
