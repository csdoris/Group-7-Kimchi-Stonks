import React from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom';

import './Modal.scss';

const modalRoot = document.querySelector('#modal-root');

function Modal({
  dismissOnClickOutside, className, children,
}) {
  const history = useHistory();

  function handleModalBackground(event) {
    if (dismissOnClickOutside && event.target.parentElement === modalRoot) {
      history.goBack();
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
