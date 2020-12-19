import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import IndexTop from '../pages-sections/index/indexTop';
import IndexBottom from '../pages-sections/index/indexBottom';
import Inputs from '../pages-sections/index/inputs';
import connectDb from '../utils/connectDb';
import Course from '../models/Course';
import { NextSeo } from 'next-seo';

// import AdSense from 'react-adsense';

export default function Index({ depts, profs }) {
  return (
    <>
      <NextSeo
        title='York Course Reviews'
        description='York Courses is the place to see reviews and ratings of courses and professors at York University'
        openGraph={{
          url: 'https://yorkcourses.com/',
          title: 'York Courses',
          description: 'York University Course Reviews and Ratings',
          site_name: 'York Course Reviews',
        }}
      />
      <Container maxWidth='sm'>
        <Box my={4} alignItems='center'>
          <IndexTop />
          <Inputs depts={depts} profs={profs} />
          <IndexBottom />
          {/* <AdSense.Google /> */}
        </Box>
      </Container>
    </>
  );
}

export const getStaticProps = async ctx => {
  try {
    connectDb();

    const uniqueDepts = await Course.find().distinct('deptCode');
    const profs = await Course.find().distinct('reviews.professorName');
    uniqueDepts.sort();
    profs.sort();

    return {
      props: {
        depts: JSON.parse(JSON.stringify(uniqueDepts)),
        profs: JSON.parse(JSON.stringify(profs)),
      },
      revalidate: 60,
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        depts: [],
      },
      revalidate: 60,
    };
  }
};
