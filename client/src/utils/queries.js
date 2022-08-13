import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user {
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
`;
