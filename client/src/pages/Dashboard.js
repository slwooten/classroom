import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { QUERY_USER } from '../utils/queries';
import { ADD_COURSE } from '../utils/mutations';

import Auth from '../utils/auth';

import ClassCard from '../components/ClassCard';

const Dashboard = () => {

  let { userId } = useParams();

  /// GRABS CURRENT USER TO USE IN QUERY ///
  // const { data: userData } = Auth.getUser();

  /// FORM STATE ///
  const [formState, setFormState] = useState({ courseName: '', startDate: '', endDate: '', description: '' });

  /// QUERYS USER USING USERID FROM PARAMS ///
  const { loading, data } = useQuery(QUERY_USER, {
    variables: { _id: userId }
  })

  const courseInfo = data?.user?.courses;

  /// ADD COURSE MUTATION ///
  const [addCourse, { error, courseData }] = useMutation(ADD_COURSE);

  /// HANDLE CHANGE ///
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  /// FORM SUBMISSION ///
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // console.log(formState);

    try {
      const { moreData } = await addCourse({
        variables: {
          ...formState,
          instructor: Auth.getUser().data.username,
        },
        refetchQueries: [
          { query: QUERY_USER }
        ],
      });
    } catch (error) {
      console.log(error);
    };

    setFormState({
      courseName: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  if (loading) {
    return (
      <div>Loading, one moment please.</div>
    )
  };

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <h2>Welcome back, {data.user.username}!</h2>
      </div>
        <>
          {data.user.courses ? (
            <div>
              <h2>Here are your courses:</h2>
              <div>
                {courseInfo.map((course) => (
                  <p key={course._id}>{course.courseName}</p>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2>You currently have no courses, add a new one below.</h2>
            </div>
          )}
          <div>
            <h2>Add a New Course:</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                placeholder='Course name'
                type='text'
                name='courseName'
                value={formState.courseName}
                onChange={handleChange}
              />
              <input
                placeholder='Course Start Date'
                type='text'
                name='startDate'
                value={formState.startDate}
                onChange={handleChange}
              />
              <input
                placeholder='Course End Date'
                type='text'
                name='endDate'
                value={formState.endDate}
                onChange={handleChange}
              />
              <input
                placeholder='Course Description'
                type='text'
                name='description'
                value={formState.description}
                onChange={handleChange}
              />
              <button type='submit'>Add Class</button>
            </form>
          </div>
        </>

      {error && (
        <div>
          {error.message}
        </div>
      )}
    </>
  );
};

export default Dashboard;
