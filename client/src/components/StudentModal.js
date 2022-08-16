import React, { useState } from 'react'
import Modal from 'react-modal';

Modal.setAppElement('#root');

const StudentModal = ({ student }) => {

  /// MODAL STATE ///
  const [modalIsOpen, setIsOpen] = useState(false);

  /// OPEN MODAL ///
  const openModal = () => {
    setIsOpen(true);
  };

  /// CLOSE MODAL ///
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button key={student._id} onClick={openModal}>{student.firstName}{' '}{student.lastName}</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <h2>First name:{' '}{student.firstName}</h2>
        <h2>Last name:{' '}{student.lastName}</h2>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  )
};

export default StudentModal;
