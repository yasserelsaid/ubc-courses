import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';

function top() {
  return (
    <div>
      <Typography variant='body1' component='h2' gutterBottom align='center'>
        Is there a certain course you can't find?{' '}
        <Link href='/add-course'>
          <a>
            {' '}
            <Typography
              variant='body1'
              component='p'
              color='secondary'
              display='inline'
            >
              add it here.{' '}
            </Typography>
          </a>
        </Link>
      </Typography>
    </div>
  );
}

export default top;
