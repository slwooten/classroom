import { gql } from "@apollo/client";

export const QUERY_USER = gql`
 query user {
  user {
    _id
    username
    email
    courseCount
    courses {
      _id
      courseName
      startDate
      endDate
      description
      instructor
    }
  }
}
`;

export const QUERY_COURSE = gql`
  query course($courseId: ID!) {
  course(courseId: $courseId) {
    _id
    courseName
    startDate
    endDate
    description
    instructor
    students {
      _id
      firstName
      lastName
    }
    studentCount
  }
}
`;
