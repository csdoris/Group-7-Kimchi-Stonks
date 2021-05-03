import React from 'react';

import Modal from '../../Modal/Modal';
import Button from '../../Button/Button';

import './TextDialog.scss';

function TextDialog({ title, text, onDismiss }) {
  return (
    <Modal dismissOnClickOutside onDismiss={onDismiss}>
      <div className="modal-content text-dialog">
        <p className="info-title text-dialog">{title}</p>
        <p className="info-text text-dialog">{text}</p>
        <Button
          className="ok"
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
