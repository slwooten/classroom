const { Schema, model } = require('mongoose');

const classSchema = new Schema(
  {
    className: {
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
);

const Class = model('Class', classSchema);

module.exports = Class;
