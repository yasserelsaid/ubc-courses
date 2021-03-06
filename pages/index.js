import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import IndexTop from '../pages-sections/index/indexTop';
import IndexBottom from '../pages-sections/index/indexBottom';
import Inputs from '../pages-sections/index/inputs';
import connectDb from '../utils/connectDb';
import Course from '../models/Course';
import { NextSeo } from 'next-seo';

import AdSense from 'react-adsense';

export default function Index({ depts, profs }) {
  return (
    <>
      <NextSeo
        title='Rate My Courses UBC'
        description='Rate My Courses UBC is the place to see reviews and ratings of courses and professors at UBC '
        openGraph={{
          url: 'https://ratemycoursesubc.com/',
          title: 'Rate My Courses UBC',
          description: 'UBC Course Reviews and Ratings',
          site_name: 'Rate My Courses UBC',
        }}
      />
      <Container maxWidth='sm'>
        <Box my={4} alignItems='center'>
          <IndexTop />
          <Inputs depts={depts} profs={profs} />
          <IndexBottom />
        </Box>
        <AdSense.Google
          client='ca-pub-9351737408787682'
          slot='8693404703'
          format='auto'
        />
      </Container>
    </>
  );
}

export const getStaticProps = async ctx => {
  try {
    connectDb();

    const uniqueDepts = await Course.find().distinct('deptCode');
    let profs = await Course.find().distinct('reviews.professorName');
    uniqueDepts.sort();
    profs = profs.map(prof => {
      return prof.trim();
    });
    profs = [...new Set(profs)];
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
