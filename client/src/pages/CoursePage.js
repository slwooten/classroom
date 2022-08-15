import { useQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { ADD_STUDENT } from '../utils/mutations';
import { QUERY_COURSE } from '../utils/queries';

const CoursePage = () => {

  let { courseId } = useParams();
  let courseIdInt = parseInt(courseId);

  const [formState, setFormState] = useState({ firstName: '', lastName: '' });

  const { loading, data } = useQuery(QUERY_COURSE, {
    variables: { courseId: courseId }
  });

  const courseInfo = data?.course;

  const [addStudent, { error, studentData }] = useMutation(ADD_STUDENT);

  /// HANDLE CHANGE ///
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formState);

    try {
      const { data } = await addStudent({
        variables: {
          ...formState,
          course: courseIdInt,
        },
        refetchQueries: [
          { query: QUERY_COURSE }
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
        <h1>{courseInfo.courseName}</h1>
        <h2>Start Date: {courseInfo.startDate}</h2>
        <h2>End Date: {courseInfo.endDate}</h2>
        <h2>Number of Students: {courseInfo.studentCount}</h2>
        <h2>Description:</h2>
        <p>{courseInfo.description}</p>
      </div>
    </>
  )
}

export default CoursePage;
