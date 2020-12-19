import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  top: {
    margin: '50px 0',
  },
}));

function courseTop({ course }) {
  const classes = useStyles();
  return (
    <div className={classes.top}>
      <Typography variant='h4' component='h1' gutterBottom>
        {course.idName}
      </Typography>
      <Typography variant='h5' component='h2' gutterBottom>
        {course.name}
      </Typography>
      <Typography variant='subtitle1' component='p' gutterBottom>
        Credit Hours: {course.creditHours}
      </Typography>
    </div>
  );
}

export default courseTop;
