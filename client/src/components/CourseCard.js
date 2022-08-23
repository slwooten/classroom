import React from 'react'
import { Link } from 'react-router-dom';
import { Card, Typography, Button, Container } from '@mui/material';

const CourseCard = ({ info: { _id, courseName, description, endDate, startDate } }) => {
  return (
    <Card variant='outlined' sx={{
      p: 2,
      m: 1,
      height: 300,
      width: 300,
      maxHeight: 300,
      maxWidth: 300,
    }}>
      <Container sx={{ p: 2 }}>
        <Typography variant='h6' align='center'>{courseName}</Typography>
      </Container>
      <Container sx={{ p: 2 }}>
        <Typography variant='subtitle1' align='center'>Start date: {startDate}</Typography>
      </Container>
      <Container sx={{ p: 2 }}>
        <Typography variant='subtitle1' align='center'>End date: {endDate}</Typography>
      </Container>
      <Container sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Link to={`/course/${_id}`} style={{ textDecoration: 'none' }}>
          <Button variant='contained'>View Course</Button>
        </Link>
      </Container>
    </Card>
  )
};

export default CourseCard;
