import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import catchErrors from '../../utils/catchErrors';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useRouter } from 'next/router';
import cookie, { set } from 'js-cookie';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const terms = ['Fall', 'Winter', 'Summer'];
const years = ['2016', '2017', '2018', '2019', '2020', '2021'].reverse();
const grades = [
  'A+',
  'A',
  'A-',
  'B+',
  'B',
  'B-',
  'C+',
  'C',
  'C-',
  'D+',
  'D',
  'D-',
  'F',
  'Drop/Withdrawal',
  'Incomplete',
  'Not sure yet',
  'Rather not say',
  'Audit/No grade',
];

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  outerPaper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    margin: '50px 0',
    background: '#f0f0f0',
  },
  paper: {
    padding: '10px',
    textAlign: 'left',
    '& > div': {
      padding: '10px 0',
    },
    '& > div:not(:last-child)': {
      borderBottom: '1px solid #ddd',
    },
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > div': {
      //   margin: 'px 0',
      width: '30%',
    },
  },
  reviewSection: {
    padding: '8px 0',
  },
  submitButtonContainer: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const InitialReview = {
  easyRating: 3,
  interestingRating: 3,
  usefulRating: 3,
  professorName: '',
  term: '',
  year: '',
  grade: '',
  textbookUse: '',
  attendance: '',
  comment: '',
  advice: '',
};

function LeaveAReview({ setReviews, noReviews, reviewedBy }) {
  const classes = useStyles();
  const router = useRouter();

  const [review, setReview] = useState(InitialReview);
  const [spamPrevention, setSpamPrevention] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReviewedByUser, setIsReviewedByUser] = useState(false);
  const {
    easyRating,
    interestingRating,
    usefulRating,
    professorName,
    term,
    year,
    grade,
    textbookUse,
    attendance,
    comment,
    advice,
  } = review;
  const deviceId = cookie.get('deviceId');
  useEffect(() => {
    setIsReviewedByUser(reviewedBy.includes(deviceId));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'spamPrevention') setSpamPrevention(value);
    else if (
      name === 'easyRating' ||
      name === 'interestingRating' ||
      name === 'usefulRating'
    )
      setReview(prevState => ({ ...prevState, [name]: parseInt(value) }));
    else setReview(prevState => ({ ...prevState, [name]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const spamPreventionAdjusted = spamPrevention
      .replace(/\s/g, '')
      .toLowerCase();

    if (spamPreventionAdjusted !== 'britishcolumbia') {
      setSpamPrevention('');
      return setError('Wrong Province');
    }

    if (isReviewedByUser) return;
    try {
      setLoading(true);
      setSuccess(false);
      setError('');
      const fullRating = parseFloat(
        ((easyRating + interestingRating + usefulRating) / 3).toFixed(1)
      );
      const url = '/api/courses';
      const { id } = router.query;
      const payload = {
        review: { fullRating, ...review },
        id,
        deviceId,
      };

      const { data } = await axios.put(url, payload);
      setReviews(data.newReviews);
      setSuccess(true);
      setReview(InitialReview);
      setSpamPrevention('');
      setIsReviewedByUser(true);
    } catch (err) {
      catchErrors(err, setError);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <Typography variant='h4' component='p' align='center'>
        {noReviews && 'Be The First To'} Leave a Review
      </Typography>
      <Paper className={classes.outerPaper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item md={3} xs={12}>
              <Paper className={classes.paper}>
                <div>
                  <p>Easy</p>
                  <Rating
                    name='easyRating'
                    // defaultValue={2}
                    value={easyRating}
                    onChange={handleChange}
                    precision={1}
                    emptyIcon={<StarBorderIcon fontSize='inherit' />}
                  />
                </div>
                <div>
                  <p>Interesting</p>
                  <Rating
                    name='interestingRating'
                    value={interestingRating}
                    onChange={handleChange}
                    precision={1}
                    emptyIcon={<StarBorderIcon fontSize='inherit' />}
                  />
                </div>
                <div>
                  <p>Useful</p>
                  <Rating
                    name='usefulRating'
                    value={usefulRating}
                    onChange={handleChange}
                    precision={1}
                    emptyIcon={<StarBorderIcon fontSize='inherit' />}
                  />
                </div>
              </Paper>
            </Grid>
            <Grid item md={9} xs={12}>
              <Paper className={classes.paper}>
                {/* <div className={classes.header}> */}
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12}>
                    <TextField
                      fullWidth
                      variant='outlined'
                      label='Professor Name'
                      color='secondary'
                      name='professorName'
                      value={professorName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <TextField
                      fullWidth
                      variant='outlined'
                      label='Term'
                      required
                      color='secondary'
                      select
                      name='term'
                      value={term}
                      onChange={handleChange}
                    >
                      {terms.map(term => (
                        <MenuItem key={term} value={term}>
                          {term}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <TextField
                      fullWidth
                      select
                      variant='outlined'
                      label='Year'
                      required
                      color='secondary'
                      name='year'
                      value={year}
                      onChange={handleChange}
                    >
                      {years.map(aYear => (
                        <MenuItem key={aYear} value={aYear}>
                          {aYear}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {/* </Grid>
                <Grid container spacing={1}> */}
                  <Grid item md={4} xs={12}>
                    <TextField
                      fullWidth
                      variant='outlined'
                      label='Grade'
                      color='secondary'
                      select
                      name='grade'
                      value={grade}
                      onChange={handleChange}
                    >
                      {grades.map(grade => (
                        <MenuItem key={grade} value={grade}>
                          {grade}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <TextField
                      fullWidth
                      variant='outlined'
                      label='Textbook Use'
                      color='secondary'
                      select
                      name='textbookUse'
                      value={textbookUse}
                      onChange={handleChange}
                    >
                      <MenuItem value='Yes'>Yes </MenuItem>
                      <MenuItem value='No'>No</MenuItem>
                      <MenuItem value='Optional'>Optional</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <TextField
                      fullWidth
                      variant='outlined'
                      label='Attendance'
                      color='secondary'
                      select
                      name='attendance'
                      value={attendance}
                      onChange={handleChange}
                    >
                      <MenuItem value='Mandatory'>Mandatory </MenuItem>
                      <MenuItem value='Non-Mandatory'>Non-Mandatory</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                {/* </div> */}
                <div>
                  <div className={classes.reviewSection}>
                    <Typography variant='subtitle2' component='p' gutterBottom>
                      Comment*
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      variant='outlined'
                      label='Leave a comment'
                      required
                      color='secondary'
                      name='comment'
                      value={comment}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={classes.reviewSection}>
                    <Typography variant='subtitle2' component='p' gutterBottom>
                      Advice
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      variant='outlined'
                      label='Leave advice'
                      color='secondary'
                      name='advice'
                      value={advice}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={classes.reviewSection}>
                    <Typography variant='subtitle2' component='p' gutterBottom>
                      Spam Prevention*
                    </Typography>

                    <TextField
                      fullWidth
                      required
                      multiline
                      variant='outlined'
                      label='In what province is UBC U?'
                      color='secondary'
                      name='spamPrevention'
                      value={spamPrevention}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={classes.submitButtonContainer}>
                    <Button
                      disabled={loading || isReviewedByUser}
                      type='submit'
                      variant='contained'
                      color='secondary'
                    >
                      {loading
                        ? 'Adding...'
                        : isReviewedByUser
                        ? 'You Already Reviewed This Course'
                        : 'Submit'}
                    </Button>
                  </div>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity='success'>
          Review added successfully
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
    </div>
  );
}

export default LeaveAReview;
