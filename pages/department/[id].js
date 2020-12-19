import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import DepartmentTop from '../../pages-sections/department/departmentTop';
import DepartmentCourses from '../../pages-sections/department/departmentCourses';
import connectDb from '../../utils/connectDb';
import Course from '../../models/Course';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

export default function department({ courses }) {
  const router = useRouter();
  const deptCode = router.query.id;
  const seoDescription = `Reviews of courses from ${deptCode} department at York University`;
  const seoTitle = `${deptCode} Reviews`;

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        openGraph={{
          type: 'website',
          url: 'https://yorkcourses.com/',
          title: seoTitle,
          description: seoDescription,
          site_name: 'York Course Reviews',
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

export const getStaticPaths = async () => {
  connectDb();

  const departments = await Course.find().distinct('deptCode');

  const paths = departments.map(deptCode => ({
    params: { id: deptCode },
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
    const courses = await Course.find({ deptCode: id.toUpperCase() }).sort({
      numberOfReviews: -1,
      id: 1,
    });

    return {
      props: {
        courses: JSON.parse(JSON.stringify(courses)),
      },
      revalidate: 20,
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
