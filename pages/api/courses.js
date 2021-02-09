import Course from '../../models/Course';
import connectDb from '../../utils/connectDb';

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      await handleGetRequests(req, res);
      break;
    case 'POST':
      await handlePostRequests(req, res);
      break;
    case 'PUT':
      await handlePutRequests(req, res);
      break;

    default:
      res.status(405).send(`Method ${req.method} not allowed`);
  }
};

async function handleGetRequests(req, res) {
  try {
    connectDb();
    const { id } = req.query;

    const course = await Course.findOne({ id });

    course &&
      course.reviews.sort((a, b) =>
        a.upVotedBy.length - a.downVotedBy.length >
        b.upVotedBy.length - b.downVotedBy.length
          ? -1
          : b.upVotedBy.length - b.downVotedBy.length >
            a.upVotedBy.length - a.downVotedBy.length
          ? 1
          : 0
      );

    res.status(200).json({ course });
  } catch (err) {
    console.log(err);
    res.status(403).send(err.message);
  }
}

async function handlePostRequests(req, res) {
  try {
    const { idName, name } = req.body;
    const deptCode = idName.split(' ')[0];
    const id = idName.replace(/\s/g, '');

    const course = await new Course({
      id,
      idName,
      name,
      deptCode,
    }).save();

    res.status(200).send('huh');
  } catch (err) {
    console.log(err);
    res.status(403).send(err.message);
  }
}

async function handlePutRequests(req, res) {
  try {
    const { review, id, deviceId } = req.body;

    const { overallRating, numberOfReviews } = await Course.findOne({
      id,
    });

    const newOverallRating = (
      (overallRating * numberOfReviews + review.fullRating) /
      (numberOfReviews + 1)
    ).toFixed(1);

    const updatedCourse = await Course.findOneAndUpdate(
      { id },
      {
        $push: {
          reviews: {
            $each: [{ ...review, date: new Date() }],
            $sort: { date: -1 },
          },
        },
        $addToSet: { reviewedBy: deviceId },
        $inc: { numberOfReviews: 1 },
        $set: { overallRating: newOverallRating },
      },
      { new: true }
    );

    res.status(200).json({ newReviews: updatedCourse.reviews });
  } catch (err) {
    console.log(err);
    res.status(403).send(err.message);
  }
}
