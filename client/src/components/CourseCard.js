import React from 'react'
import { Link } from 'react-router-dom';

const CourseCard = ({ info: { _id, courseName, description, endDate, startDate} }) => {
  return (
    <div>
      <h3><Link to={`/course/${_id}`}>{courseName}</Link></h3>
      <p>{description}</p>
      <p>{endDate}</p>
      <p>{startDate}</p>
    </div>
  )
};

export default CourseCard;
