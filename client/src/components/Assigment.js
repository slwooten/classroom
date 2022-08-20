import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';

import { UPDATE_ASSIGNMENT } from '../utils/mutations';
import { QUERY_COURSE, QUERY_USER } from '../utils/queries';

const Assigment = ({ gradeInfo: { _id, assignmentName, grade }, courseId }) => {

  const assignmentId = _id;

  /// UPDATE ASSIGNMENT MUTATION ///
  const [updateAssignment, { error, data }] = useMutation(UPDATE_ASSIGNMENT);

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
  }

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
    </>
  )
}

export default Assigment;
