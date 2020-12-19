import Course from '../../models/Course';
import connectDb from '../../utils/connectDb';

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case 'PUT':
      await handlePutRequests(req, res);
      break;

    default:
      res.status(405).send(`Method ${req.method} not allowed`);
  }
};

async function handlePutRequests(req, res) {
  try {
    const { whatToChange, courseId, reviewId, deviceId } = req.body;
    console.log(deviceId);
    if (whatToChange === 'upVote') {
      console.log(1);
      await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $addToSet: {
            'reviews.$.upVotedBy': deviceId,
          },
        }
      );
    } else if (whatToChange === 'downVote') {
      console.log(2);

      await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $addToSet: {
            'reviews.$.downVotedBy': deviceId,
          },
        }
      );
    } else if (whatToChange === 'remove upVote and downVote') {
      console.log(3);

      await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $pull: {
            'reviews.$.upVotedBy': deviceId,
          },
          $addToSet: {
            'reviews.$.downVotedBy': deviceId,
          },
        }
      );
    } else if (whatToChange === 'remove downVote and upVote') {
      console.log(4);

      await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $pull: {
            'reviews.$.downVotedBy': deviceId,
          },
          $addToSet: {
            'reviews.$.upVotedBy': deviceId,
          },
        }
      );
    } else if (whatToChange === 'remove upVote') {
      console.log(5);

      await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $pull: {
            'reviews.$.upVotedBy': deviceId,
          },
        }
      );
    } else if (whatToChange === 'remove downVote') {
      console.log(6);

      await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $pull: {
            'reviews.$.downVotedBy': deviceId,
          },
        }
      );
    }

    res.status(200).send('votes updated successfully');
  } catch (err) {
    console.log(err);
    res.status(403).send(err.message);
  }
}
