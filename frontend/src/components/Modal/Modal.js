import React from 'react';
import ReactDOM from 'react-dom';

import './Modal.scss';

const modalRoot = document.querySelector('#modal-root');

function Modal({
  dismissOnClickOutside, className, children, onDismiss,
}) {
  function handleModalBackground(event) {
    if (dismissOnClickOutside && event.target.parentElement === modalRoot) {
      onDismiss();
    }
  }

  return ReactDOM.createPortal(
    <div
      className="modal-background"
      onClick={(event) => handleModalBackground(event)}
    >
      <div className={`modal ${className}`}>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}

export default Modal;
