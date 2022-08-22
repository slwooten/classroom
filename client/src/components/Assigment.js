import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';

import { UPDATE_ASSIGNMENT, DELETE_ASSIGNMENT } from '../utils/mutations';
import { QUERY_COURSE } from '../utils/queries';

const Assigment = ({ gradeInfo: { _id, assignmentName, grade }, courseId, studentId }) => {

  const assignmentId = _id;

  /// UPDATE and DELETE ASSIGNMENT MUTATION ///
  const [updateAssignment, { error, data }] = useMutation(UPDATE_ASSIGNMENT);
  const [deleteAssignment, { deleteErr, deleteData }] = useMutation(DELETE_ASSIGNMENT);

  /// QUERY COURSE ///
  const { loading, courseData } = useQuery(QUERY_COURSE, {
    variables: { courseId: courseId }
  });

  /// FORM STATE ///
  const [formState, setFormState] = useState({ newGradeString: '' });

  /// HANDLE ASSIGNMENT FORM CHANGE ///
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({
      [name]: value,
    });
  };

  /// HANDLE ASSIGNMENT UPDATE FORM SUBMISSION ///
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newGrade = parseInt(formState.newGradeString);

    try {
      const { data } = await updateAssignment({
        variables: {
          assignmentId,
          newGrade,
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
      newGradeString: '',
    });
  };

  /// HANDLE DELETE ASSIGNMENT CLICK ///
  const handleDelete = async () => {

    try {
      const { data } = await deleteAssignment({
        variables: {
          assignmentId,
          studentId,
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
  };

  return (
    <>
      <p>Assignment: {assignmentName}</p>
      <p>Grade {grade}</p>
      <div>
        <form onSubmit={handleFormSubmit}>
          <input
            type='number'
            placeholder='Change Grade'
            name='newGradeString'
            value={formState.newGradeString}
            onChange={handleChange}
          />
          <button type='submit'>Update Grade</button>
        </form>
      </div>
      <button onClick={handleDelete}>Delete Assignment/Grade</button>
    </>
  )
}

export default Assigment;
