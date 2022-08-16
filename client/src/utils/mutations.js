import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      username
      email
      _id
    }
  }
}
`;

export const ADD_COURSE = gql`
  mutation addCourse($courseName: String!, $startDate: String!, $endDate: String!, $description: String!) {
  addCourse(courseName: $courseName, startDate: $startDate, endDate: $endDate, description: $description) {
    _id
    courseName
    startDate
    endDate
    description
    instructor
  }
}
`;

export const ADD_STUDENT = gql`
  mutation addStudent($firstName: String!, $lastName: String!, $course: String!) {
  addStudent(firstName: $firstName, lastName: $lastName, course: $course) {
    _id
    firstName
    lastName
    course
  }
}
`;

export const LOGIN_USER = gql`
 mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
      email
    }
  }
}
`;
