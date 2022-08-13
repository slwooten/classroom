import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import { QUERY_USER } from '../utils/queries';

import Auth from '../utils/auth';

const Dashboard = () => {
  /// GRABS CURRENT USER TO USE IN QUERY ///
  const { data: userData } = Auth.getUser();
  console.log(userData);

  /// QUERYS USER ///
  const { loading, data } = useQuery(QUERY_USER, {
    variables: { _id: userData._id }
  })

  if (loading) {
    return (
      <div>Loading, one moment please.</div>
    )
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome back, {data.user.username}</h2>
    </div>
  );
};

export default Dashboard;
