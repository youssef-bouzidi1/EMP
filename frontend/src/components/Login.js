import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

import axios from 'axios';

function LoginForm() {
  const navigate = useNavigate(); // Access the navigate function from react-router-dom
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showAlert, setShowAlert] = useState(false); // New state variable

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email , password } = formData;
    const csrfToken = getCookie('csrftoken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    };
    const body = JSON.stringify({ email , password, csrfmiddlewaretoken: csrfToken });
    try {
      const res = await axios.post('http://localhost:8000/login/', { email: email, password: password }, config);
      if (res.data.Login) {
        if (res.data.user_type === 'R') {
          navigate('/recruteur'); // Navigate to '/recruteur' route
          localStorage.setItem("id",res.data.uid)
        } else if (res.data.user_type === 'E') {
          navigate('/candidat'); // Navigate to '/recruteur' route
          localStorage.setItem("id",res.data.uid)
        }
        console.log(res.data);
      } else {
        setShowAlert(true); // Display the alert
        console.log(res.data.Login);
      };
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {showAlert && ( // Render the Alert component conditionally
            <Alert severity="error">Incorrect Username / Password ,Try Again</Alert>
          )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email} 
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password} 
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: 'blue',
              '&:hover': {
                bgcolor: 'darkblue',
                backdropFilter: 'blur(0px)', // Add blur effect on hover
              },
              backdropFilter: 'blur(0px)', // Initial blur effect
            }}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <RouterLink to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </RouterLink>
            </Grid>
          </Grid>

          
        </Box>
      </Box>
    </Container>
  );
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default LoginForm;
