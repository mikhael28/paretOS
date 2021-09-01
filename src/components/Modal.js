import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Modal.css";

/**
 * A Modal/Popup component.
 */

function Modal({ children, childProps, open, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const backgroundRef = React.createRef();

  const handleClick = (event) => {
    // close if clicking outside
    if (backgroundRef.current === event.target) {
      handleClose();
    }
  };

  const handleKeyup = (event) => {
    const key = event.key || event.keyCode;

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
    backgroundRef.current.focus();
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

Modal.propTypes = {
  children: PropTypes.element,
  childProps: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Modal;
