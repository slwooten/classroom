import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { QUERY_USER } from '../utils/queries';
import { ADD_CLASS } from '../utils/mutations';

import Auth from '../utils/auth';


const Dashboard = () => {

  /// GRABS CURRENT USER TO USE IN QUERY ///
  const { data: userData } = Auth.getUser();
  // console.log(userData);

  /// FORM STATE ///
  const [formState, setFormState] = useState({ className: '', startDate: '', endDate: '', description: '' });

  /// QUERYS USER ///
  const { loading, data } = useQuery(QUERY_USER, {
    variables: { _id: userData._id }
  })

  // const classInfo = data.user.classes;
  

  console.log('refreshed data', data);
  // console.log('classInfo', classInfo);

  const [addClass, { error, classData }] = useMutation(ADD_CLASS);

  // console.log('class data', classData);

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
      const { moreData } = await addClass({
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
      className: '',
      startDate: '',
      endDate: '',
      description: '',
    });

    console.log('updated user data', data);
  };

  if (loading) {
    return (
      <div>Loading, one moment please.</div>
    )
  };

  if (data) {
  } return (
    <>
      <div>
        <h1>Dashboard</h1>
        <h2>Welcome back, {data.user.username}</h2>
      </div>
      {classData ? (
        <p>Course successfully added!</p>
      ) : (
        <>
          <div>
          <h2>Here are your classes:</h2>
          {/* {classInfo.map((course) => (
            <p>{course.className}</p>
          ))} */}
          </div>
          <div>
            <form onSubmit={handleFormSubmit}>
              <input
                placeholder='Course name'
                type='text'
                name='className'
                value={formState.className}
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
      )}

      {error && (
        <div>
          {error.message}
        </div>
      )}
    </>
  );
};

export default Dashboard;
