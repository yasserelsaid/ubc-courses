import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import catchErrors from '../utils/catchErrors';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles(theme => ({
  input: {
    margin: '20px 0',
  },
}));

export default function addCourse() {
  const classes = useStyles();
  const router = useRouter();

  const [idName, setIdName] = useState('');
  const [name, setName] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [spamPrevention, setSpamPrevention] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!/\d/.test(idName)) {
      setIdName('');
      setName('');
      setCreditHours('');
      setSpamPrevention('');
      return setError('Course Id should be formatted like this EECS 1012');
    }
    let idNameWithSpace = idName;

    if (!idName.includes(' ')) {
      // add white space
      const re = /[^0-9](?=[0-9])/g;
      idNameWithSpace = idName.replace(re, '$& ');
    }

    const spamPreventionAdjusted = spamPrevention
      .replace(/\s/g, '')
      .toLowerCase();
    if (spamPreventionAdjusted !== 'ontario') {
      setSpamPrevention('');
      return setError('Wrong Province');
    }
    if (creditHours < 1) {
      setIdName('');
      setName('');
      setCreditHours('');
      setSpamPrevention('');
      return setError('Wrong Province');
    }
    try {
      setLoading(true);
      setSuccess(false);
      setError('');
      const url = '/api/courses';

      const payload = {
        idName: idNameWithSpace.toUpperCase(),
        name,
        creditHours,
      };
      await axios.post(url, payload);
      setSuccess(true);
      setIdName('');
      setName('');
      setCreditHours('');
      setSpamPrevention('');
      // setTimeout(
      //   () => router.push(`/course/${idName.toUpperCase().replace(/\s/g, '')}`),
      //   1000
      // );
    } catch (err) {
      console.log(err);
      setIdName('');
      setName('');
      setCreditHours('');
      setSpamPrevention('');
      catchErrors(err, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NextSeo
        title='Add a Course'
        description='Add a course to be reviewed by other students at York University'
      />
      <Container maxWidth='sm'>
        <Box my={4} alignItems='center'>
          <Typography variant='h4' component='p' align='center'>
            Add a course
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className={classes.input}>
              <TextField
                required
                fullWidth
                label='Enter Course ID'
                color='secondary'
                variant='outlined'
                helperText='e.g. EECS 1012'
                name='idName'
                value={idName}
                onChange={e => setIdName(e.target.value)}
              />
            </div>
            <div className={classes.input}>
              <TextField
                required
                fullWidth
                label='Enter Course Name'
                color='secondary'
                variant='outlined'
                name='name'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className={classes.input}>
              <TextField
                required
                fullWidth
                label='Credit Hours'
                color='secondary'
                variant='outlined'
                type='number'
                name='creditHours'
                value={creditHours}
                onChange={e => setCreditHours(e.target.value)}
                // InputProps={{ inputProps: { min: 0, max: 12 } }}
              />
            </div>
            <div className={classes.input}>
              <TextField
                fullWidth
                required
                label='In what province is York U?'
                color='secondary'
                variant='outlined'
                name='spamPrevention'
                value={spamPrevention}
                onChange={e => setSpamPrevention(e.target.value)}
              />
            </div>
            <Button
              disabled={loading}
              type='submit'
              variant='contained'
              color='secondary'
            >
              {loading ? 'Adding...' : 'Submit'}
            </Button>
          </form>
        </Box>
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
        >
          <Alert onClose={() => setSuccess(false)} severity='success'>
            Course added successfully
          </Alert>
        </Snackbar>
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={3000}
          onClose={() => setError('')}
        >
          <Alert onClose={() => setError('')} severity='error'>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
