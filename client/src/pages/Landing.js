import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
  <div>
    <button><Link to='/signup'>Sign Up</Link></button>
    <button><Link to='/login'>Login</Link></button>
  </div>
  )
};

export default Landing;
