import React from 'react';

import Modal from '../../Modal/Modal';
import Button from '../../Button/Button';

import './TextDialog.scss';

function TextDialog({ title, text, onDismiss }) {
  return (
    <Modal dismissOnClickOutside>
      <div className="modal-content">
        <p className="info-title">{title}</p>
        <p className="info-text">{text}</p>
        <Button
          className="sell-stocks"
          type="button"
          value="OK"
          text="OK"
          variant="contained"
          onClick={onDismiss}
        />
      </div>
    </Modal>
  );
}

export default TextDialog;
