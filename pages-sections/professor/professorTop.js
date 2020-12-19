import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
  top: {
    margin: '50px 0',
  },
}));

function professorTop() {
  const classes = useStyles();
  const router = useRouter();
  return (
    <div className={classes.top}>
      <Typography variant='h4' component='h1' gutterBottom>
        {router.query.id} Reviews
      </Typography>
    </div>
  );
}

export default professorTop;
