import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Review from './review';
import Typography from '@material-ui/core/Typography';

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
          {reviews.map(review => (
            <Review review={review} key={review.id} />
          ))}
        </div>
      )
    );
  }
}

export default Reviews;
