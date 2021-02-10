import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Review from './review';
import Typography from '@material-ui/core/Typography';
import AdSense from 'react-adsense';

// const useStyles = makeStyles(theme => ({
//   top: {
//     margin: '50px 0',
//   },
// }));

function Reviews({ reviews }) {
  //   const classes = useStyles();
  {
    return (
      reviews.length > 0 && (
        <div>
          {reviews.map((review, index) => {
            return index % 2 === 0 ? (
              <Review review={review} key={review.id} />
            ) : (
              <>
                <Review review={review} key={review.id} />
                <AdSense.Google
                  client='ca-pub-9351737408787682'
                  slot='8693404703'
                  format='auto'
                />
              </>
            );
          })}
        </div>
      )
    );
  }
}

export default Reviews;
