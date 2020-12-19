import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
const useStyles = makeStyles(theme => ({
  iContainer: {
    margin: '50px',
    textAlign: 'center',
  },
  input: {
    margin: '20px 0',
  },
}));

function inputs({ depts, profs }) {
  const classes = useStyles();
  const router = useRouter();
  const [course, setCourse] = React.useState('');

  const handleChange = event => {
    setCourse(event.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    router.push(`/course/${course.toUpperCase().replace(/\s/g, '')}`);
  };
  return (
    <div className={classes.iContainer}>
      <div className={classes.input}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label='Enter Course ID'
            color='secondary'
            variant='outlined'
            helperText='e.g. CPSC 221'
            onChange={handleChange}
            value={course}
          />
          <Button
            type='submit'
            variant='contained'
            color='secondary'
            disabled={course === ''}
          >
            Go
          </Button>
        </form>
      </div>
      <Typography variant='h5' component='h1' gutterBottom align='center'>
        OR
      </Typography>
      <div className={classes.input}>
        <Autocomplete
          getOptionLabel={course => course}
          options={depts}
          onChange={(e, newValue) => router.push(`/department/${newValue}`)}
          renderInput={params => (
            <TextField
              {...params}
              label='Choose Department'
              variant='outlined'
              fullWidth
              color='secondary'
            />
          )}
        >
          {depts.map(course => (
            <MenuItem key={course} value={course}>
              {course}
            </MenuItem>
          ))}
        </Autocomplete>
      </div>
      <Typography variant='h5' component='h1' gutterBottom align='center'>
        OR
      </Typography>
      <div className={classes.input}>
        <Autocomplete
          getOptionLabel={prof => prof}
          options={profs}
          onChange={(e, newValue) => router.push(`/professor/${newValue}`)}
          renderInput={params => (
            <TextField
              {...params}
              label='Choose Professor'
              variant='outlined'
              fullWidth
              color='secondary'
            />
          )}
        >
          {profs.map(prof => (
            <MenuItem key={prof} value={prof}>
              {prof}
            </MenuItem>
          ))}
        </Autocomplete>
      </div>
    </div>
  );
}

export default inputs;
