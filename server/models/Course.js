const { Schema, model } = require('mongoose');

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      }
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

courseSchema.virtual('studentCount').get(function () {
  return this.students.length;
});

const Course = model('Course', courseSchema);

module.exports = Course;
