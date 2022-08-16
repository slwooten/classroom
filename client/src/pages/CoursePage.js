import { useQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { ADD_STUDENT } from '../utils/mutations';
import { QUERY_COURSE } from '../utils/queries';

const CoursePage = () => {

  let { courseId } = useParams();
  console.log(courseId);
  console.log(typeof courseId);

  /// FORM STATE ///
  const [formState, setFormState] = useState({ firstName: '', lastName: '' });

  /// QUERY COURSE ///
  const { loading, data } = useQuery(QUERY_COURSE, {
    variables: { courseId: courseId }
  });
  const courseInfo = data?.course;
  console.log(courseInfo);

  /// ADD STUDENT MUTATION ///
  const [addStudent, { error, studentData }] = useMutation(ADD_STUDENT);

  /// HANDLE CHANGE ///
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  /// HANDLE FORM SUBMIT ///
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formState);

    try {
      const { data } = await addStudent({
        variables: {
          ...formState,
          course: courseId,
        },
        refetchQueries: [
          { query: QUERY_COURSE,
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
      firstName: '',
      lastName: '',
    });
  };

  if (loading) {
    return (
      <div>Loading course, please wait...</div>
    )
  };

  return (
    <>
      <div>
        Hey
        <h1>{courseInfo?.courseName}</h1>
        <h2>Start Date: {courseInfo?.startDate}</h2>
        <h2>End Date: {courseInfo?.endDate}</h2>
        <h2>Number of Students: {courseInfo?.studentCount}</h2>
        <h2>Description:</h2>
        <p>{courseInfo?.description}</p>
      </div>
      <div>
        {courseInfo?.students.map((student) => (
          <p key={student._id}>{student.firstName}{' '}{student.lastName}</p>
        ))}
      </div>
      <div>
        <form onSubmit={handleFormSubmit}>
          <input
            type='text'
            placeholder='Student first name'
            name='firstName'
            value={formState.firstName}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='Student last name'
            name='lastName'
            value={formState.lastName}
            onChange={handleChange}
          />
          <button type='submit'>Add Student</button>
        </form>
      </div>
      {error && (
        <div>
          {error.message}
        </div>
      )}
    </>
  )
}

export default CoursePage;
