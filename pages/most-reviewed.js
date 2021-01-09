import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import DepartmentTop from '../pages-sections/department/departmentTop';
import DepartmentCourses from '../pages-sections/department/departmentCourses';
import connectDb from '../utils/connectDb';
import Course from '../models/Course';
import { NextSeo } from 'next-seo';

export default function department({ courses }) {
  const seoDescription = `Most reviewed courses at UBC`;
  const seoTitle = `Most Reviewed`;

  return (
    <>
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
          <DepartmentTop />
          <DepartmentCourses courses={courses} />
        </Box>
      </Container>
    </>
  );
}

export const getStaticProps = async ctx => {
  try {
    connectDb();
    const courses = await Course.find()
      .sort({
        numberOfReviews: -1,
        overallRating: -1,
      })
      .limit(150);

    return {
      props: {
        courses: JSON.parse(JSON.stringify(courses)),
      },
      revalidate: 5,
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        courses: [],
      },
      revalidate: 60,
    };
  }
};
