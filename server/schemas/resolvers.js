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
      },
      /// ADD ASSIGNMENT ///
      addAssignment: async (parent, { assignmentName, description, course }, context) => {
        const assignment = await Assignment.create({
          assignmentName,
          description,
        });

        await Student.updateMany(
          { course: course },
          { $addToSet: { grades: assignment._id }}
        );

        return assignment;
      }
  }
};

module.exports = resolvers;
