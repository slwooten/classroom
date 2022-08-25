import React, { useState } from 'react';
import { Box, Container, Typography, Card, Button } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { ADD_STUDENT } from '../utils/mutations';
import { QUERY_COURSE } from '../utils/queries';

import StudentModal from '../components/StudentModal';

const CoursePage = () => {

  let { courseId } = useParams();

  /// STUDENT FORM STATE for STUDENT FORM ///
  const [formState, setFormState] = useState({ firstName: '', lastName: '' });

  /// QUERY COURSE ///
  const { loading, data } = useQuery(QUERY_COURSE, {
    variables: { courseId: courseId }
  });
  const courseInfo = data?.course;

  /// ADD STUDENT MUTATION ///
  const [addStudent, { error, studentData }] = useMutation(ADD_STUDENT);

  /// HANDLE STUDENT FORM CHANGE ///
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  /// HANDLE STUDENT FORM SUBMIT ///
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await addStudent({
        variables: {
          ...formState,
          course: courseId,
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
    <main>
      <Box>
        <Container>
          <Typography variant='h4' align='center' sx={{ mt: 8, mb: 4 }}>{courseInfo?.courseName}</Typography>
          <Typography variant='h6' align='center' sx={{ m: 2 }}>Number of Students: {courseInfo?.studentCount}</Typography>
          <Typography variant='h6' align='center'>Start/End Dates:</Typography>
          <Typography variant='subtitle2' align='center'>{courseInfo?.startDate} - {courseInfo?.endDate}</Typography>
        </Container>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Card variant='outlined' sx={{
            p: 2,
            m: 3,
          }}>
            <Typography variant='h6'>Description:</Typography>
            <Typography variant='subtitle1'>{courseInfo?.description}</Typography>
          </Card>
          <Card variant='outlined' sx={{
            p: 2,
            m: 3,
          }}>
            <Typography variant='h6'>Students:</Typography>
            {courseInfo?.students.map((student) => (
              <StudentModal key={student._id} student={student} />
            ))}
          </Card>
          <Card variant='outlined' sx={{
            maxWidth: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            flex: 'auto'
          }}>
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
          </Card>
        </Container>
        {error && (
          <div>
            {error.message}
          </div>
        )}
      </Box>
    </main>
  )
}

export default CoursePage;
