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
import Button from '@material-ui/core/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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
    alignItems: 'center',
  },

  reviewBody: {
    '& span': {
      display: 'inline-block',
      padding: '15px 20px 5px 0',
    },
  },
  dateAndThreeDots: {
    display: 'flex',
    alignItems: 'center',
    margin: '-15px 0',
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
    reportedBy,
  } = review;
  const classes = useStyles();
  const deviceId = cookie.get('deviceId');

  const votes = upVotedBy.length - downVotedBy.length;

  const [currentVotes, setCurrentVotes] = useState(votes);
  const [upVote, setUpVote] = useState(false);
  const [downVote, setDownVote] = useState(false);
  const [changingVote, setChangingVote] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [reporting, setReporting] = React.useState(false);
  const [reported, setReported] = React.useState(false);

  const handleTreeDotsClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setUpVote(upVotedBy && upVotedBy.includes(deviceId));
    setDownVote(downVotedBy && downVotedBy.includes(deviceId));
    setReported(reportedBy && reportedBy.includes(deviceId));
  }, []);

  async function handleRequest(change) {
    if (changingVote) return;
    setChangingVote(true);
    let valueToChangeVotesBy = 0;
    let whatToChange = '';
    if (change === 'report') {
      if (reported) return;
      setReporting(true);
      whatToChange = 'report';
    } else if (change === 'up') {
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
    } else if (change === 'down') {
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
      const url = '/api/review';
      const courseId = router.query.id;
      const payload = {
        courseId,
        reviewId: id,
        deviceId,
        whatToChange,
      };

      await axios.put(url, payload);
      if (change === 'report') setReported(true);
    } catch (err) {
      console.log(err);
    } finally {
      setChangingVote(false);
      setReporting(false);
    }
  }
  return (
    <div className={classes.container}>
      <div className={classes.vote}>
        <ArrowDropUpIcon
          style={{ color: upVote && 'green', fontSize: '45px' }}
          onClick={() => handleRequest('up')}
        />
        <div>{currentVotes}</div>
        <ArrowDropDownIcon
          style={{ color: downVote && 'red', fontSize: '45px' }}
          onClick={() => handleRequest('down')}
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
                <div className={classes.dateAndThreeDots}>
                  <Typography variant='subtitle2' component='p'>
                    {formatDate(date)}
                  </Typography>
                  <IconButton
                    aria-label='more'
                    aria-controls='long-menu'
                    aria-haspopup='true'
                    onClick={handleTreeDotsClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id='simple-menu'
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem>
                      <Button
                        onClick={() => handleRequest('report')}
                        color='secondary'
                        disabled={reporting || reported}
                      >
                        {reported
                          ? 'Review Reported'
                          : reporting
                          ? 'Reporting...'
                          : 'Report Review'}
                      </Button>
                    </MenuItem>
                  </Menu>
                </div>
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
