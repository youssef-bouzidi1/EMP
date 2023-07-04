import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import axios from 'axios';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FileUpload from '@mui/icons-material/FileUpload';
import Alert from '@mui/material/Alert';

const SignUp = () => {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [user_type, setuser_type] = React.useState('');
  const [formError, setFormError] = React.useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let id;
    const first_name = data.get('first_name');
    const last_name = data.get('last_name');
    const email = data.get('email');
    const password = data.get('password');
    const user_type = data.get('user_type');
    const date_of_birth = dayjs(selectedDate).format('YYYY-MM-DD');

    // Check if any required fields are empty
    if (!first_name || !last_name || !email || !password || !user_type || !date_of_birth) {
      setFormError(true);
      return;
    } else {
      setFormError(false);
    }

    // Handle registration for recruiter or job seeker
    const formData = {
      first_name,
      last_name,
      email,
      password,
      user_type,
      date_of_birth,
    };

    if (user_type === 'R') {
      const name = data.get('name');
      const description = data.get('description');
      const website = data.get('website');
      formData.name = name;
      formData.description = description;
      formData.website = website;
      formData.logo = logoFile;
    } else if (user_type === 'E') {
      const degree = data.get('degree');
      const speciality = data.get('speciality');
      formData.degree = degree;
      formData.speciality = speciality;
      formData.resume = cvFile;
    }

    axios
      .post('http://localhost:8000/register/', formData,{
        headers: {
          'content-type': 'multipart/form-data'
        }})
      .then((response) => {
        console.log(formData);
        console.log('Registration:', response.data);
        id = response.data.id;
        console.log(id);
        setRegistrationSuccess(true); // Set success state
        setRegistrationError(false); // Clear error state
        // Handle any necessary steps after form submission

        // Proceed to the next step or navigate to the next page
      })
      .catch((error) => {
        console.error('Error during registration:', error);
        setRegistrationSuccess(false); // Clear success state
        setRegistrationError(true); // Set error state
      });
  };

  const theme = createTheme();

  const handleCvFileChange = (event) => {
    setCvFile(event.target.files[0]);
  };
  const handleLogoFileChange = (event) => {
    setLogoFile(event.target.files[0]);
  };

  const renderSuccessMessage = () => {
    if (registrationSuccess) {
      return (
        <Grid item xs={12}>
          <Alert severity="success">Registration Successful</Alert>
        </Grid>
      );
    }
    return null;
  };

  const renderErrorMessage = () => {
    if (registrationError) {
      return (
        <Grid item xs={12}>
                <Alert severity="error">Registration Failed</Alert>
        </Grid>
      );
    }
    return null;
  };

  const renderRecruiterFields = () => {
    return (
      <>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="name"
            label="Company Name"
            type="text"
            id="name"
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="description"
            label="Company Description"
            type="text"
            id="description"
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="website"
            label="Website"
            type="text"
            id="website"
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12}>
          <input
            accept="image/*"
            id="logo-file"
            type="file"
            onChange={handleLogoFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="logo-file">
            <IconButton color="primary" aria-label="upload logo" component="span">
              <FileUpload />
            </IconButton>
            {logoFile ? logoFile.name : 'Upload Logo'}
          </label>
        </Grid>
      </>
    );
  };
  
  const renderJobSeekerFields = () => {
    return (
      <>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="degree"
            label="Degree"
            type="text"
            id="degree"
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="speciality"
            label="Speciality"
            type="text"
            id="speciality"
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12}>
        <input
          accept=".pdf,.doc,.docx"
          id="cv-file"
          type="file"
          onChange={handleCvFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="cv-file">
          <IconButton color="primary" aria-label="upload CV" component="span">
            <FileUpload />
          </IconButton>
          {cvFile ? cvFile.name : 'Upload CV'}
        </label>
      </Grid>
      </>
    );
  };

  const renderFormError = () => {
    return (
      <Grid item xs={12}>
        <Typography variant="caption" color="error">
          Please fill in all required fields.
        </Typography>
      </Grid>
    );
  };

  const renderFieldsBasedOnUserType = () => {
    switch (user_type) {
      case 'R':
        return renderRecruiterFields();
      case 'E':
        return renderJobSeekerFields();
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">            
          <Grid container spacing={2}>
          {renderSuccessMessage()}
              {renderErrorMessage()}
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="first_name"
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    required
                    fullWidth
                    label="Date of Birth"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <RadioGroup
                  row
                  aria-label="user_type"
                  name="user_type"
                  value={user_type}
                  onChange={(event) => setuser_type(event.target.value)}
                >
                  <FormControlLabel value="R" control={<Radio />} label="Recruiter" />
                  <FormControlLabel value="E" control={<Radio />} label="Job Seeker" />
                </RadioGroup>
              </Grid>
              {renderFieldsBasedOnUserType()}
              {formError && renderFormError()}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
