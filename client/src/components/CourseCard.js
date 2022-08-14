import React from 'react'

const CourseCard = ({ info: { courseName, description, endDate, startDate} }) => {
  return (
    <div>
      <h3>{courseName}</h3>
      <p>{description}</p>
      <p>{endDate}</p>
      <p>{startDate}</p>
    </div>
  )
};

export default CourseCard;
