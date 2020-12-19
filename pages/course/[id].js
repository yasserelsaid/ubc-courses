import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import CourseTop from '../../pages-sections/course/courseTop';
import Reviews from '../../pages-sections/course/reviews';
import LeaveAReview from '../../pages-sections/course/leaveAReview';
import connectDb from '../../utils/connectDb';
import Course from '../../models/Course';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

export default function course({ course }) {
  const router = useRouter();
  const reviewsInitialState = course && course.reviews;
  const courseIdName = course && course.idName;
  const courseName = course && course.name;
  const [reviews, setReviews] = useState(reviewsInitialState);

  const seoDescription = `Reviews of course ${courseIdName} ( ${courseName} ) at UBC `;

  return (
    <>
      <NextSeo
        title={courseIdName}
        description={seoDescription}
        openGraph={{
          type: 'website',
          url: 'https://UBCcourses.com/',
          title: courseIdName,
          description: seoDescription,
          site_name: 'UBC Course Reviews',
        }}
      />
      <Container maxWidth='md'>
        <Box my={4} alignItems='center'>
          {course ? (
            <>
              <CourseTop course={course} />
              <Reviews reviews={reviews} />
              <LeaveAReview
                reviewedBy={course.reviewedBy}
                setReviews={setReviews}
                noReviews={reviews.length === 0}
              />
            </>
          ) : (
            <Typography variant='h4' component='h1' gutterBottom align='center'>
              Course {router.query.id} is not available, you can add it{' '}
              <Link href='/add-course'>
                <a>here</a>
              </Link>
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}

export const getStaticPaths = async () => {
  connectDb();

  const courses = await Course.find().sort({ numberOfReviews: -1 }).limit(10);
  const paths = courses.map(course => ({
    params: { id: course.id },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ctx => {
  try {
    connectDb();
    const { params } = ctx;
    const { id } = params;
    let course = await Course.findOne({ id });

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

    return {
      props: {
        course: JSON.parse(JSON.stringify(course)),
      },
      revalidate: 5,
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        course: {},
      },
      revalidate: 60,
    };
  }
};
