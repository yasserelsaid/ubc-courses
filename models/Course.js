import mongoose from 'mongoose';
import shortid from 'shortid';

const { String, Number, Date } = mongoose.Schema.Types;

const CourseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    idName: {
      type: String,
      required: true,
      unique: true,
    },
    deptCode: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    overallRating: {
      type: Number,
      default: 0,
    },
    creditHours: {
      type: String,
    },

    numberOfReviews: {
      type: Number,
      default: 0,
    },
    reviewedBy: [
      {
        type: String,
      },
    ],
    reviews: [
      {
        id: {
          type: String,
          default: shortid.generate,
        },
        easyRating: {
          type: Number,
          required: true,
        },
        interestingRating: {
          type: Number,
          required: true,
        },
        usefulRating: {
          type: Number,
          required: true,
        },
        fullRating: {
          type: Number,
        },
        professorName: {
          type: String,
        },
        term: {
          type: String,
        },
        year: {
          type: String,
        },
        grade: {
          type: String,
        },
        textbookUse: {
          type: String,
        },
        takeThisClassAgain: {
          type: String,
        },
        takeWithThisProfAgain: {
          type: String,
        },
        attendance: {
          type: String,
        },
        comment: {
          type: String,
        },
        advice: {
          type: String,
        },
        date: {
          type: Date,
        },
        upVotedBy: [
          {
            type: String,
          },
        ],
        downVotedBy: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
