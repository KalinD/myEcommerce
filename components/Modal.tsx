import React, { MouseEvent, ReactElement } from "react";

type ModalProps = {
  onClose: () => void;
  children: ReactElement;
};

const Modal = ({ onClose, children, ...props }: ModalProps) => {
  const handleCloseClick = (e: MouseEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div>
      <div
        onClick={(e) => handleCloseClick(e)}
        className="fixed inset-0 bg-black bg-opacity-70 z-10"
      ></div>
      <div className="fixed w-fit h-fit left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
        {React.isValidElement(children) && React.cloneElement(children, props)}
      </div>
    </div>
  );
};

export default Modal;
