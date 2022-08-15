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
      type: Number,
      required: true,
      trim: true,
    },
    grades: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Assignment',
      }
    ],
  },
);

const Student = model('Student', studentSchema);

module.exports = Student;
