import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Card } from '@mui/material';

import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { ADD_COURSE } from '../utils/mutations';

import Auth from '../utils/auth';

import CourseCard from '../components/CourseCard';

const Dashboard = () => {

  let { userId } = useParams();

  /// GRABS CURRENT USER TO USE IN QUERY ///
  // const { data: userData } = Auth.getUser();

  /// FORM STATE ///
  const [formState, setFormState] = useState({ courseName: '', startDate: '', endDate: '', description: '' });

  /// QUERYS USER USING USERID FROM PARAMS ///
  const { loading, data } = useQuery(QUERY_USER, {
    variables: { userId: userId }
  })

  const courseInfo = data?.user?.courses;
  const courseLength = data?.user?.courses?.length;

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
    <main>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        p: 2,
      }}>
        <Container sx={{ flex: '2 1 400px', maxWidth: 700, display: 'flex', flexDirection: 'column', }}>
          <Typography variant='h4' sx={{ p: 3, mt: 3 }}>Welcome back, {data.user.username}!</Typography>
          {courseLength !== 0 ? (
            <>
              <Typography variant='h5' sx={{ p: 3 }}>Here are your courses:</Typography>
              <Container sx={{
                display: 'flex',
                flexWrap: 'wrap',
              }}>
                {courseInfo.map((course) => (
                  <CourseCard info={course} key={course._id} />
                ))}
              </Container>
            </>
          ) : (
            <div>
              <h2>You currently have no courses, add a new one below.</h2>
            </div>
          )}
        </Container>
        <Container sx={{
          display: 'flex',
          flex: '1 1 400px',
          minWidth: '250px',
          alignItems: 'flex-start',
          justifyContent: 'center',
          mt: 8,
        }}>
          <Card variant='outlined' sx={{
            maxWidth: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            flex: 'auto'
          }}>
            <Typography variant='h4' align='center'>Add a New Course:</Typography>
            <form onSubmit={handleFormSubmit}>
              <Container sx={{ p: 2 }}>
                <TextField
                  label='Course name'
                  variant='outlined'
                  type='text'
                  name='courseName'
                  value={formState.courseName}
                  onChange={handleChange}
                />
              </Container>
              <Container sx={{ p: 2 }}>
                <TextField
                  label='Course Start Date'
                  variant='outlined'
                  type='text'
                  name='startDate'
                  value={formState.startDate}
                  onChange={handleChange}
                />
              </Container>
              <Container sx={{ p: 2 }}>
                <TextField
                  label='Course End Date'
                  variant='outlined'
                  type='text'
                  name='endDate'
                  value={formState.endDate}
                  onChange={handleChange}
                />
              </Container>
              <Container sx={{ p: 2 }}>
                <TextField
                  id="outlined-multiline-flexible"
                  label='Course Description'
                  variant='outlined'
                  multiline
                  rows={4}
                  type='text'
                  name='description'
                  value={formState.description}
                  onChange={handleChange}
                />
              </Container>
              <Container sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Button variant='contained' type='submit'>Add Class</Button>
              </Container>
            </form>
          </Card>
        </Container>

        {error && (
          <div>
            {error.message}
          </div>
        )}
      </Box>
    </main>
  );
};

export default Dashboard;
