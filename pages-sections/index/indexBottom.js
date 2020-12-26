import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';

function top() {
  return (
    <div>
      <Typography variant='body1' component='h2' gutterBottom align='center'>
        Is there a certain course you can't find?{' '}
        <Link href='/add-course'>
          <a>add it here. </a>
        </Link>
      </Typography>
    </div>
  );
}

export default top;
