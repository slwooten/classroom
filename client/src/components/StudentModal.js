import React, { useState } from 'react'
import Modal from 'react-modal';

Modal.setAppElement('#root');

const StudentModal = ({ student }) => {

  
  let gradesArr = [];

    student.grades.map((grade) => {
    return gradesArr.push(grade.grade);
  });

  // const average = gradesArr.reduce((a, b) => a + b / gradesArr.length);

  // console.log(average);
  console.log('Array of student grades/assignments:', gradesArr);

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
        <div>
          <h3>Assignments:</h3>
          {student.grades.map((grade) => {
            return <p key={grade.assignmentName}>{grade.assignmentName}</p>
          })}
        </div>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  )
};

export default StudentModal;
