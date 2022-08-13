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

export const ADD_CLASS = gql`
  mutation addClass($className: String!, $startDate: String!, $endDate: String!, $description: String!) {
  addClass(className: $className, startDate: $startDate, endDate: $endDate, description: $description) {
    _id
    className
    startDate
    endDate
    description
    instructor
  }
}
`

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
      email
      classCount
      classes {
        _id
        className
        startDate
        endDate
        description
      }
    }
  }
}
`;
