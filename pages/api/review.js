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
    if (whatToChange === 'report') {
      const course = await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $addToSet: {
            'reviews.$.reportedBy': deviceId,
          },
        },
        { new: true }
      );
      const review = course.reviews.filter(rev => rev.id === reviewId);
      console.log(review);
      if (review[0].reportedBy.length > 3) {
        await Course.findOneAndUpdate(
          { id: courseId, 'reviews.id': reviewId },
          {
            $pull: {
              reviews: { id: reviewId },
            },
          }
        );
      }
    } else if (whatToChange === 'upVote') {
      await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $addToSet: {
            'reviews.$.upVotedBy': deviceId,
          },
        }
      );
    } else if (whatToChange === 'downVote') {
      await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $addToSet: {
            'reviews.$.downVotedBy': deviceId,
          },
        }
      );
    } else if (whatToChange === 'remove upVote and downVote') {
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
      await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $pull: {
            'reviews.$.upVotedBy': deviceId,
          },
        }
      );
    } else if (whatToChange === 'remove downVote') {
      await Course.findOneAndUpdate(
        { id: courseId, 'reviews.id': reviewId },
        {
          $pull: {
            'reviews.$.downVotedBy': deviceId,
          },
        }
      );
    }

    res.status(200).send('review updated successfully');
  } catch (err) {
    console.log(err);
    res.status(403).send(err.message);
  }
}
