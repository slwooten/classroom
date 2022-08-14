const { Schema, model } = require('mongoose');

const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
  },
);

const Student = model('Student', studentSchema);

module.exports = Student;
