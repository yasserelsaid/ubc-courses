import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import ProfessorTop from '../../pages-sections/professor/professorTop';
import Reviews from '../../pages-sections/course/reviews';
import connectDb from '../../utils/connectDb';
import Course from '../../models/Course';
import Typography from '@material-ui/core/Typography';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

export default function professor({ reviews }) {
  const router = useRouter();
  const professorName = router.query.id;
  const seoDescription = `Reviews of courses taught by professor ${professorName} at UBC `;
  const seoTitle = `${professorName} Reviews`;
  return (
    <>
      {/* <h1>This page is not yet available</h1> */}
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        openGraph={{
          type: 'website',
          url: 'https://ratemycoursesubc.com/',
          title: seoTitle,
          description: seoDescription,
          site_name: 'UBC Course Reviews',
        }}
      />
      <Container maxWidth='md'>
        <Box my={4} alignItems='center'>
          <ProfessorTop />
          {reviews && reviews.length > 0 ? (
            <Reviews reviews={reviews} />
          ) : (
            <Typography variant='h4' component='h1' gutterBottom align='center'>
              Professor {router.query.id} does not have any reviews yet
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}

export const getStaticPaths = async () => {
  connectDb();

  // let profs = await Course.find().distinct('reviews.professorName');
  // profs = profs.map(prof => {
  //   return prof.trim();
  // });
  // profs = [...new Set(profs)];

  // const paths = profs.map(prof => ({
  //   params: { id: prof },
  // }));
  const paths = [
    {
      params: { id: 'Alym Almani' },
    },
  ];

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
    const courses = await Course.find({
      'reviews.professorName': id,
    });

    const arrayOfReviewArrays = courses.map(course => {
      const courseIdName = course.idName;
      const profReviews = course.reviews.filter(
        review => review.professorName === id
      );
      return profReviews.map(review => ({
        ...review._doc,
        courseIdName,
      }));
    });
    // flatten reviews
    const reviews = [].concat.apply([], arrayOfReviewArrays);

    return {
      props: {
        reviews: JSON.parse(JSON.stringify(reviews)),
      },
      revalidate: 20,
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        reviews: [],
      },
      revalidate: 60,
    };
  }
};
