import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from 'next/link';

const useStyles = makeStyles(theme => ({
  table: {
    background: '#fafafa',
  },
  rating: {
    borderRadius: '5px',
    marginRight: '10px',
    color: '#fff',
    padding: '5px 10px',
  },
  numberOfRatings: {
    marginRight: '5px',
  },
  tableRow: {
    cursor: 'pointer',
  },
  rowLink: {
    color: 'inherit',
  },
}));

function departmentCourses({ courses }) {
  const classes = useStyles();
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell align='left'>Course Name</TableCell>
              <TableCell align='right'>Overall Rating</TableCell>
            </TableRow>
          </TableHead>
          {courses && (
            <TableBody>
              {courses.map(course => (
                <Link href={`/course/${course.id}`} passHref key={course._id}>
                  <TableRow className={classes.tableRow}>
                    <TableCell component='th' scope='row'>
                      <a className={classes.rowLink}>{course.idName}</a>
                    </TableCell>
                    <TableCell>
                      <a className={classes.rowLink}>{course.name}</a>
                    </TableCell>
                    <TableCell align='right'>
                      <span className={classes.numberOfRatings}>
                        ({course.numberOfReviews})
                      </span>
                      <span
                        className={classes.rating}
                        style={{
                          background:
                            course.overallRating === 0
                              ? '#999'
                              : course.overallRating <= 2
                              ? '#a61919'
                              : course.overallRating >= 4
                              ? 'green'
                              : '#c7c700',
                        }}
                      >
                        {course.overallRating}
                      </span>
                    </TableCell>
                  </TableRow>
                </Link>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </div>
  );
}

export default departmentCourses;
