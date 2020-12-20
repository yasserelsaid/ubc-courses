import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  top: {
    margin: '50px 0',
  },
}));

function courseTop({ courseIdName, courseName }) {
  const classes = useStyles();
  return (
    <div className={classes.top}>
      <Typography variant='h4' component='h1' gutterBottom>
        {courseIdName}
      </Typography>
      <Typography variant='h5' component='h2' gutterBottom>
        {courseName}
      </Typography>
    </div>
  );
}

export default courseTop;
