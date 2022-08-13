import React from 'react'

const ClassCard = ({ className, description, endDate, startDate }) => {
  return (
    <div>
      <p>{className}</p>
      <p>{description}</p>
      <p>{endDate}</p>
      <p>{startDate}</p>
    </div>
  )
};

export default ClassCard;
