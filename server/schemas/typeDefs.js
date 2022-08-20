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
    students: [Student]
    studentCount: Int
  }

  type Student {
    _id: ID
    firstName: String
    lastName: String
    course: String
    grades: [Assignment]
  }

  type Assignment {
    _id: ID
    assignmentName: String
    grade: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user: User
    course(courseId: ID!): Course
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addCourse(courseName: String!, startDate: String!, endDate: String!, description: String!): Course
    addStudent(firstName: String!, lastName: String!, course: String!): Student
    addAssignment(assignmentName: String!, grade: Int, studentId: String): Assignment
    updateAssignment(assignmentId: String!, newGrade: Int): Assignment
  }
`;

module.exports = typeDefs;
