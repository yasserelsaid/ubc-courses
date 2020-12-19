import Course from '../../models/Course';
import connectDb from '../../utils/connectDb';

connectDb();

export default async (req, res) => {
  switch (req.method) {
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
async function handlePostRequests(req, res) {
  try {
    const { idName, name, creditHours } = req.body;
    const deptCode = idName.split(' ')[0];
    const id = idName.replace(/\s/g, '');

    const course = await new Course({
      id,
      idName,
      name,
      creditHours,
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

    console.log(overallRating, numberOfReviews, review.fullRating);

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
