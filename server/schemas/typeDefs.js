const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    courseCount: Int
    courses: [Course]
  }

  type Course {
    _id: ID!
    courseName: String!
    startDate: String!
    endDate: String!
    description: String!
    instructor: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addCourse(courseName: String!, startDate: String!, endDate: String!, description: String!): Course
  }
`;

module.exports = typeDefs;
