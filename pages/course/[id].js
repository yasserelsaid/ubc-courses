import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import CourseTop from '../../pages-sections/course/courseTop';
import Reviews from '../../pages-sections/course/reviews';
import LeaveAReview from '../../pages-sections/course/leaveAReview';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import axios from 'axios';

export default function course() {
  const router = useRouter();
  const [courseIdName, setCourseIdName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const id = router.query.id;

  async function getCourseInfo() {
    setLoading(true);
    if (!id) return;
    try {
      const url = '/api/courses';
      const payload = {
        params: { id },
      };
      const { data } = await axios.get(url, payload);
      setCourseIdName(data.course.idName);
      setCourseName(data.course.name);
      setReviews(data.course.reviews);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCourseInfo();
  }, [id]);

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
          {loading ? (
            <h1>LOADING...</h1>
          ) : courseIdName ? (
            <>
              <CourseTop courseIdName={courseIdName} courseName={courseName} />
              <Reviews reviews={reviews} />
              <LeaveAReview
                reviewedBy={course.reviewedBy}
                setReviews={setReviews}
                noReviews={reviews.length === 0}
              />
            </>
          ) : (
            <Typography variant='h4' component='h1' gutterBottom align='center'>
              Course {id} is not available, you can add it{' '}
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

// export const getStaticPaths = async () => {
//   connectDb();

//   const courses = await Course.find().sort({ numberOfReviews: -1 }).limit(10);
//   const paths = courses.map(course => ({
//     params: { id: course.id },
//   }));

//   return {
//     paths,
//     fallback: true,
//   };
// };

// export const getStaticProps = async ctx => {
//   try {
//     connectDb();
//     const { params } = ctx;
//     const { id } = params;
//     let course = await Course.findOne({ id });

//     course &&
//       course.reviews.sort((a, b) =>
//         a.upVotedBy.length - a.downVotedBy.length >
//         b.upVotedBy.length - b.downVotedBy.length
//           ? -1
//           : b.upVotedBy.length - b.downVotedBy.length >
//             a.upVotedBy.length - a.downVotedBy.length
//           ? 1
//           : 0
//       );

//     return {
//       props: {
//         course: JSON.parse(JSON.stringify(course)),
//       },
//       revalidate: 2,
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       props: {
//         course: {},
//       },
//       revalidate: 60,
//     };
//   }
// };
