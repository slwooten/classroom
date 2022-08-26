import React, { useEffect, useState } from 'react'
import { Container, Card, TextField, Typography, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from '@apollo/client';

import { UPDATE_ASSIGNMENT, DELETE_ASSIGNMENT } from '../utils/mutations';
import { QUERY_COURSE } from '../utils/queries';

const Assigment = ({ gradeInfo: { _id, assignmentName, grade }, courseId, studentId }) => {

  const assignmentId = _id;

  /// UPDATE and DELETE ASSIGNMENT MUTATION ///
  const [updateAssignment, { error, data }] = useMutation(UPDATE_ASSIGNMENT);
  const [deleteAssignment, { deleteErr, deleteData }] = useMutation(DELETE_ASSIGNMENT);

  /// QUERY COURSE ///
  const { loading, courseData } = useQuery(QUERY_COURSE, {
    variables: { courseId: courseId }
  });

  /// FORM STATE ///
  const [formState, setFormState] = useState({ newGradeString: '' });

  const [gradeColor, setGradeColor] = useState('');
  const [gradeBold, setGradeBold] = useState('');

  const checkGrade = (grd) => {
    if (grd >= 80) {
      setGradeColor('blue');
      setGradeBold('normal');
    } else if (grd >= 70) {
      setGradeColor('orange');
      setGradeBold('bold');
    } else {
      setGradeColor('red');
      setGradeBold('bold');
    }
  };

  useEffect(() => {
    checkGrade(grade);
  }, [grade]);

  /// HANDLE ASSIGNMENT FORM CHANGE ///
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({
      [name]: value,
    });
  };

  /// HANDLE ASSIGNMENT UPDATE FORM SUBMISSION ///
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newGrade = parseInt(formState.newGradeString);

    try {
      const { data } = await updateAssignment({
        variables: {
          assignmentId,
          newGrade,
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
      newGradeString: '',
    });
  };

  /// HANDLE DELETE ASSIGNMENT CLICK ///
  const handleDelete = async () => {

    try {
      const { data } = await deleteAssignment({
        variables: {
          assignmentId,
          studentId,
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
  };

  return (
    <Container sx={{
      width: 300,
      height: 275,
      m: 0,
    }}>
      <Card variant='outlined' sx={{
        p: 3,
        maxWidth: 290,
      }}>
        <Typography variant='h6'>{assignmentName}</Typography>
        <Typography variant='subtitle1' sx={{
          mt: 2,
          color: `${gradeColor}`,
          fontWeight: `${gradeBold}`,
        }}>
          Grade: {grade}%
        </Typography>
        <Container sx={{ mt: 2 }}>
          <form onSubmit={handleFormSubmit}>
            <TextField
              type='number'
              label='Change Grade'
              name='newGradeString'
              value={formState.newGradeString}
              onChange={handleChange}
            />
            <Container sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Button variant='outlined' color='success' type='submit' sx={{ mr: 1 }}>Update</Button>
              <IconButton>
                <DeleteIcon color='error' onClick={handleDelete} />
              </IconButton>
            </Container>
          </form>
        </Container>
      </Card>
    </Container>
  )
}

export default Assigment;
