const { AuthenticationError } = require('apollo-server-express');
const { User, Course, Student, Assignment } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    /// GETS ONE USER ///
    user: async (parent, args, context) => {
      if (context.user) {
        const userData = await (await User.findOne({ _id: context.user._id }).select('-__v -password')).populate('courses');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    /// GETS ONE COURSE ///
    course: async (parent, { courseId } ) => {
      const courseData = await (await Course.findOne({ _id: courseId })).populate({ path: 'students', populate: { path: 'grades' }});

      return courseData;
    },
  },

  Mutation: {
    /// ADD USER ///
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    /// LOGIN ///
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect Credentials');
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError('Incorrect Credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    /// ADD CLASS ///
    addCourse: async (parent, { courseName, startDate, endDate, description }, context) => {
        if (context.user) {
          const course = await Course.create({
            courseName,
            startDate,
            endDate,
            description,
            instructor: context.user.username,
          });

          await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { courses: course._id }}
          );

          return course;
        }
        throw new AuthenticationError('You need to be logged in to add a class!');
      },
      /// ADD STUDENT ///
      addStudent: async (parent, { firstName, lastName, course }, context) => {
        if (context.user) {
          const student = await Student.create({
            firstName,
            lastName,
            course
          });
  
          await Course.findOneAndUpdate(
            { _id: course },
            { $addToSet: { students: student._id }}
          );

          return student;
        }
        throw new AuthenticationError('You need to be logged in to add a Student!');
      },
      /// ADD ASSIGNMENT ///
      addAssignment: async (parent, { assignmentName, grade, studentId }, context) => {
        if (context.user) {
          const assignment = await Assignment.create({
            assignmentName,
            grade,
          });
  
          await Student.findOneAndUpdate(
            { _id: studentId },
            { $addToSet: { grades: assignment._id }}
          );
  
          return assignment;
        }
        throw new AuthenticationError('You need to be logged in to add an Assignment!');
      },
      /// UPDATE AN ASSIGNMENT ///
      updateAssignment: async(parent, { assignmentId, newGrade }, context) => {
        if (context.user) {
          const updatedAssignment = await Assignment.findOneAndUpdate(
            { _id: assignmentId },
            { grade: newGrade },
            { new: true },
          );
  
          return updatedAssignment;
        }
        throw new AuthenticationError('You need to be logged in to change a Grade!');
      },
      /// DELETE ASSIGNMENT ///
      deleteAssignment: async (parent, { assignmentId, studentId }, context) => {
        // if (context.user) {
          await Assignment.findOneAndDelete(
            { _id: assignmentId },
          );
          
          const updatedStudent = await Student.findOneAndUpdate(
            { _id: studentId },
            { $pull: { grades: { assignmentId } } },
            { new: true },
          );

          return updatedStudent;
        // }
        // throw new AuthenticationError('You need to be logged in to delete an Assignment!');
      }
  }
};

module.exports = resolvers;
