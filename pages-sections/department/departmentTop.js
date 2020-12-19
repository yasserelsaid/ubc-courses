import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
  top: {
    margin: '50px 0',
  },
}));

function departmentTop() {
  const classes = useStyles();
  const router = useRouter();
  return (
    <div className={classes.top}>
      <Typography variant='h4' component='h1' gutterBottom>
        {router.query.id} Courses
      </Typography>
    </div>
  );
}

export default departmentTop;
