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
