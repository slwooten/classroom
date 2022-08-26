import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';
import { Box, Container, Card, Typography, Button, TextField } from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';

import { useMutation, useQuery } from '@apollo/client';
import { ADD_ASSIGNMENT } from '../utils/mutations';
import { QUERY_COURSE } from '../utils/queries';
import Assigment from './Assigment';

Modal.setAppElement('#root');

const StudentModal = ({ student }) => {

  const studentId = student._id;
  const courseId = student?.course;

  /// USE MUTATION FOR ADDING ASSIGNMENT ///
  const [addAssignment, { error, data }] = useMutation(ADD_ASSIGNMENT);

  /// QUERY COURSE ///
  const { loading, courseData } = useQuery(QUERY_COURSE, {
    variables: { courseId: courseId }
  });

  /// ASSIGNMENT FORM STATE ///
  const [formState, setFormState] = useState({ assignmentName: '', grade: '' });

  /// CALCULATING THE STUDENT'S AVERAGE and SET FLAG STATE BASED ON AVERAGE ///
  let gradesArr = [];
  let sum = 0;
  student.grades.map((grade) => {
    return gradesArr.push(grade.grade);
  });
  for (let number of gradesArr) {
    sum += number;
  }
  const longAverage = sum / gradesArr.length;
  const average = Math.trunc(longAverage);

  const [flagState, setFlagState] = useState('');

  const checkAvg = (avg) => {
    if (avg >= 80) {
      setFlagState('success');
    } else if (avg >= 70) {
      setFlagState('warning');
    } else {
      setFlagState('error');
    }
  };

  useEffect(() => {
    checkAvg(average);
  }, [average]);

  /// MODAL STATE ///
  const [modalIsOpen, setIsOpen] = useState(false);

  /// OPEN MODAL ///
  const openModal = () => {
    setIsOpen(true);
  };

  /// CLOSE MODAL ///
  const closeModal = () => {
    setIsOpen(false);
  };

  /// HANDLE ASSIGNMENT FORM CHANGE ///
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  /// HANDLE ASSIGNMENT FORM SUBMIT ///
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const grade = parseInt(formState.grade);
    const assignmentName = formState.assignmentName;

    try {
      const { data } = await addAssignment({
        variables: {
          assignmentName,
          grade,
          studentId: studentId,
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
      assignmentName: '',
      grade: '',
    });
  }

  if (loading) {
    return <p>Loading, one moment please...</p>
  }

  return (
    <Box>
      <Button varaint='text' key={student._id} onClick={openModal}>{student.firstName}{' '}{student.lastName} {'>'}</Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <Button variant='text' sx={{ mt: 1 }} onClick={closeModal}>{'< back'}</Button>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
          <Container sx={{ m: 1, maxWidth: 400, width: 400, flex: '1 1 400px' }}>
            <Typography variant='h5' sx={{ mb: 2, mt: 1 }}>{student.lastName}, {student.firstName}</Typography>
            {isNaN(average) ? (
              <Typography variant='h6'>Add assignments and their grades below to calculate {student.firstName}'s Average</Typography>
            ) : (
              <Typography variant='h6' sx={{ mt: 3 }}>
                <LabelIcon color={flagState} />
                {' '}{' '}{' '}
                Student Average:{' '}{average}%
              </Typography>
            )}
            <Card variant='outlined' sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              mt: 4,
              maxWidth: 250,
              minHeight: 300,
              minWidth: 200,
            }}>
              <Typography variant='h6' gutterBottom>Add Grades:</Typography>
              <form onSubmit={handleFormSubmit}>
                <Container sx={{ p: 2 }}>
                  <TextField
                    type='text'
                    variant='outlined'
                    label='Assignment name'
                    name='assignmentName'
                    value={formState.assignmentName}
                    onChange={handleChange}
                  />
                </Container>
                <Container sx={{ p: 2 }}>
                  <TextField
                    type='number'
                    variant='outlined'
                    label='Grade'
                    name='grade'
                    value={formState.grade}
                    onChange={handleChange}
                  />
                </Container>
                <Container sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Button variant='outlined' color='success' type='submit'>Add Grade</Button>
                </Container>
              </form>
            </Card>
          </Container>
          <Container sx={{ m: 1, width: 700, flex: '2 1 700px' }}>
            {student?.grades.length === 0 ? (
              <p>{student.firstName}{' '} currently has no grades.</p>
            ) : (
              <h3>Current Grades:</h3>
            )}
            <Container sx={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}>
              {student?.grades?.map((grade) => {
                return <Assigment gradeInfo={grade} courseId={courseId} studentId={studentId} key={grade._id} />
              })}
            </Container>
          </Container>
        </Box>
      </Modal>
    </Box>
  )
};

export default StudentModal;
