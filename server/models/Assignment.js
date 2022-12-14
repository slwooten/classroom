const { Schema, model } = require('mongoose');

const assignmentSchema = new Schema(
  {
    assignmentName: {
      type: String,
      require: true,
    },
    grade: {
      type: Number,
    },
  },
);

const Assignment = model('Assignment', assignmentSchema);

module.exports = Assignment;
