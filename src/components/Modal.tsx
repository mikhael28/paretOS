import React, { useState, useEffect, ReactElement } from "react";

/**
 * @component Modal
 * @desc A Modal/Popup component.
 * @param {Prop} children-A React component
 * @param {Prop} childProps-Props of children
 * @param {Prop} open-Modal visibility property
 * @param {Prop} onClose-onclose callback
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
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
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
