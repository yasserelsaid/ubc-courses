import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import formatDate from '../../utils/formatDate';
import { useRouter } from 'next/router';
import axios from 'axios';
import cookie from 'js-cookie';
// import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
// import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vote: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& div': {
      marginLeft: '1px',
      fontSize: '18px',
    },
    margin: '0 -5px 0 -13px',
  },
  outerPaper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: '50px 0',
    background: '#f0f0f0',
    width: '100%',
  },
  paper: {
    padding: '0 10px',
    textAlign: 'left',
    // height: '100%',

    '& div': {
      padding: '10px 0',
    },
    '& div:not(:last-child)': {
      borderBottom: '1px solid #ddd',
    },
  },
  rating: {
    borderRadius: '5px',
    marginRight: '10px',
    color: '#fff',
    padding: '5px 10px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  reviewBody: {
    '& span': {
      display: 'inline-block',
      padding: '15px 20px 5px 0',
    },
  },
}));

function Review({ review }) {
  const router = useRouter();
  const {
    easyRating,
    interestingRating,
    usefulRating,
    fullRating,
    professorName,
    term,
    year,
    attendance,
    grade,
    textbookUse,
    comment,
    advice,
    date,
    id,
    upVotedBy,
    downVotedBy,
  } = review;
  const classes = useStyles();
  const deviceId = cookie.get('deviceId');

  const votes = upVotedBy.length - downVotedBy.length;

  const [currentVotes, setCurrentVotes] = useState(votes);
  const [upVote, setUpVote] = useState(false);
  const [downVote, setDownVote] = useState(false);
  const [changingVote, setChangingVote] = useState(false);

  useEffect(() => {
    setUpVote(upVotedBy.includes(deviceId));
    setDownVote(downVotedBy.includes(deviceId));
  }, []);

  async function handleChangeVote(direction) {
    if (changingVote) return;
    setChangingVote(true);
    let valueToChangeVotesBy = 0;
    let whatToChange = '';
    if (direction === 'up') {
      if (upVote) {
        // remove upvote
        valueToChangeVotesBy = -1;
        whatToChange = 'remove upVote';
      } else if (downVote) {
        // remove downvote and upvote
        valueToChangeVotesBy = 2;
        whatToChange = 'remove downVote and upVote';
      } else {
        // upvote
        whatToChange = 'upVote';
        valueToChangeVotesBy = 1;
      }
      setDownVote(false);
      setUpVote(prevState => !prevState);
    } else if (direction === 'down') {
      if (downVote) {
        // remove downvote
        valueToChangeVotesBy = 1;
        whatToChange = 'remove downVote';
      } else if (upVote) {
        // remove upvote and downvote
        valueToChangeVotesBy = -2;
        whatToChange = 'remove upVote and downVote';
      } else {
        // downvote
        valueToChangeVotesBy = -1;
        whatToChange = 'downVote';
      }

      setUpVote(false);
      setDownVote(prevState => !prevState);
    }
    setCurrentVotes(prevState => prevState + valueToChangeVotesBy);
    try {
      const url = '/api/votes';
      const courseId = router.query.id;
      const payload = {
        courseId,
        reviewId: id,
        deviceId,
        whatToChange,
      };

      await axios.put(url, payload);
    } catch (err) {
      console.log(err);
    } finally {
      setChangingVote(false);
    }
  }
  return (
    <div className={classes.container}>
      <div className={classes.vote}>
        <ArrowDropUpIcon
          style={{ color: upVote && 'green', fontSize: '45px' }}
          onClick={() => handleChangeVote('up')}
        />
        <div>{currentVotes}</div>
        <ArrowDropDownIcon
          style={{ color: downVote && 'red', fontSize: '45px' }}
          onClick={() => handleChangeVote('down')}
        />
      </div>
      <Paper className={classes.outerPaper}>
        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Paper className={classes.paper}>
              <div>
                <span
                  className={classes.rating}
                  style={{
                    background:
                      easyRating === 0
                        ? '#999'
                        : easyRating <= 2
                        ? '#a61919'
                        : easyRating >= 4
                        ? 'green'
                        : '#c7c700',
                  }}
                >
                  {easyRating}
                </span>
                Easy
              </div>
              <div>
                <span
                  className={classes.rating}
                  style={{
                    background:
                      interestingRating === 0
                        ? '#999'
                        : interestingRating <= 2
                        ? '#a61919'
                        : interestingRating >= 4
                        ? 'green'
                        : '#c7c700',
                  }}
                >
                  {interestingRating}
                </span>
                Interesting
              </div>
              <div>
                <span
                  className={classes.rating}
                  style={{
                    background:
                      usefulRating === 0
                        ? '#999'
                        : usefulRating <= 2
                        ? '#a61919'
                        : usefulRating >= 4
                        ? 'green'
                        : '#c7c700',
                  }}
                >
                  {usefulRating}
                </span>
                Useful
              </div>
            </Paper>
          </Grid>
          <Grid item md={9} xs={12}>
            <Paper className={classes.paper}>
              <div className={classes.reviewHeader}>
                <Typography variant='subtitle2' component='p'>
                  Prof: {professorName} / {term} {year}
                </Typography>
                <Typography variant='subtitle2' component='p'>
                  {formatDate(date)}
                </Typography>
              </div>
              <div className={classes.reviewBody}>
                <Typography variant='subtitle2' component='p' gutterBottom>
                  Comments
                </Typography>
                <Typography variant='body2' component='p' gutterBottom>
                  {comment}
                </Typography>
                {advice && (
                  <>
                    <Typography variant='subtitle2' component='p' gutterBottom>
                      Advice
                    </Typography>
                    <Typography variant='body2' component='p' gutterBottom>
                      {advice}
                    </Typography>
                  </>
                )}
                {grade && (
                  <span>
                    Grade: <strong>{grade}</strong>
                  </span>
                )}
                {attendance && (
                  <span>
                    Attendance: <strong>{attendance}</strong>
                  </span>
                )}
                {textbookUse && (
                  <span>
                    Textbook Use: <strong>{textbookUse}</strong>
                  </span>
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Review;
