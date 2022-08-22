import React, { useState } from 'react'
import Modal from 'react-modal';

import { useMutation, useQuery } from '@apollo/client';
import { ADD_ASSIGNMENT } from '../utils/mutations';
import { QUERY_COURSE } from '../utils/queries';
import Assigment from './Assigment';

Modal.setAppElement('#root');

const StudentModal = ({ student }) => {

  const studentId = student._id;
  const courseId = student?.course;

  /// USE MUTATION FOR ADDING ASSIGNMENT ///
  const [addAssignment, { error, data }] = useMutation(ADD_ASSIGNMENT);

  /// QUERY COURSE ///
  const { loading, courseData } = useQuery(QUERY_COURSE, {
    variables: { courseId: courseId }
  });

  /// ASSIGNMENT FORM STATE ///
  const [formState, setFormState] = useState({ assignmentName: '', grade: '' });

  /// CALCULATING THE STUDENT'S AVERAGE ///
  let gradesArr = [];
  let sum = 0;
  student.grades.map((grade) => {
    return gradesArr.push(grade.grade);
  });
  for (let number of gradesArr) {
    sum += number;
  }
  const longAverage = sum / gradesArr.length;
  const average = Math.trunc(longAverage);


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

  /// HANDLE ASSIGNMENT FORM CHANGE ///
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  /// HANDLE ASSIGNMENT FORM SUBMIT ///
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const grade = parseInt(formState.grade);
    const assignmentName = formState.assignmentName;

    try {
      const { data } = await addAssignment({
        variables: {
          assignmentName,
          grade,
          studentId: studentId,
        },
        refetchQueries: [
          {
            query: QUERY_COURSE,
            variables: {
              courseId: courseId,
            }
          },
        ],
      })
    } catch (error) {
      console.log(error);
    }

    setFormState({
      assignmentName: '',
      grade: '',
    });
  }

  if (loading) {
    return <p>Loading, one moment please...</p>
  }

  return (
    <div>
      <button key={student._id} onClick={openModal}>{student.firstName}{' '}{student.lastName}</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <h2>First name:{' '}{student.firstName}</h2>
        <h2>Last name:{' '}{student.lastName}</h2>
        {isNaN(average) ? (
          <p>Add assignments and their grades below to calculate Student's Average</p>
        ) : (
          <h3>Student Average:{' '}{average}</h3>
        )}
        <div>
          <form onSubmit={handleFormSubmit}>
            <input
              type='text'
              placeholder='Assignment name'
              name='assignmentName'
              value={formState.assignmentName}
              onChange={handleChange}
            />
            <input
              type='number'
              placeholder='Grade'
              name='grade'
              value={formState.grade}
              onChange={handleChange}
            />
            <button type='submit'>Add Assignment and Grade</button>
          </form>
        </div>
        <div>
          {student?.grades.length === 0 ? (
            <p>{student.firstName}{' '} currently has no grades.</p>
          ) : (
            <h3>Assignments:</h3>
          )}
          {student?.grades?.map((grade) => {
            return <Assigment gradeInfo={grade} courseId={courseId} studentId={studentId} key={grade._id} />
          })}
        </div>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  )
};

export default StudentModal;
