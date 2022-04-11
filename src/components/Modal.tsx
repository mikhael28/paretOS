import React, { useState, useEffect, ReactElement } from "react";

/**
 * @component Modal
 * @desc A Modal/Popup component.
 * @param {Prop} children-an array of objects with name and score properties
 * @param {Prop} childProps-integer to determine how many users to display on each page
 * @param {Prop} open-currently logged in user
 * @param {Prop} onClose-array of recent pages/views visited
 */

 export interface ModalProps {
  children: ReactElement,
  childProps: object,
  open: boolean,
  onClose: () => void,
};

function Modal({ children, childProps, open, onClose } : ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const backgroundRef = React.createRef<HTMLDivElement>();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // close if clicking outside
    if (backgroundRef.current === e.target) {
      handleClose();
    }
  };

  const handleKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key || e.keyCode;

    if (["Escape", "Esc", 27].includes(key)) {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (open !== isOpen) {
      setIsOpen(open);
    }
  }, [open]);

  useEffect(() => {
    if (backgroundRef?.current)
    {
      backgroundRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      className="fresh-modal"
      style={{ display: isOpen ? "block" : "none" }}
      onClick={handleClick}
      onKeyUp={handleKeyup}
      ref={backgroundRef}
      tabIndex={0}
    >
      {/* Modal content */}
      <div className="fresh-modal-content">
        {children && React.cloneElement(children, childProps)}
      </div>
    </div>
  );
}

export default Modal;
