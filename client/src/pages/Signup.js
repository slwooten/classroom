import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Signup = () => {

  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  /// UPDATES STATE BASED ON INPUT ///
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

/// HANDLE SUBMISSION OF FORM ///
const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token, data.addUser.user._id);
    } catch (error) {
      console.log(error);
    };
};

  return (
    <main>
      <h2>Sign Up</h2>
      {data ? (
        <p>Successfully created an account. You may now head{' '}<Link to='/'>back to the hompage.</Link></p>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            placeholder='Username'
            name='username'
            type='text'
            value={formState.username}
            onChange={handleChange}
          />
          <input
            placeholder='Email'
            name='email'
            type='text'
            value={formState.email}
            onChange={handleChange}
          />
          <input
            placeholder='Password'
            name='password'
            type='password'
            value={formState.password}
            onChange={handleChange}
          />
          <button type='submit'>Submit</button>
        </form>
      )}

      {error && (
        <div>
          {error.message}
        </div>
      )} 
    </main>
  );
};

export default Signup;
