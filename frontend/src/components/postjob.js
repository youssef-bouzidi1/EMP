import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Alert } from '@mui/material';
import axios from 'axios';
import Container from '@mui/material/Container';

const PostJobForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isJobPosted, setIsJobPosted] = useState(false);
  const posted_by=localStorage.getItem("id");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/post-job/', {
        title,
        description,
        location,
        posted_by,
      });
      console.log(response.data); // Handle the response data
      setIsJobPosted(true); // Set the success status
      // Reset the form
      setTitle('');
      setDescription('');
      setLocation('');
    } catch (error) {
      console.error(error); // Handle the error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <Container  sx={{
          marginTop: 8,
        }} component="main" maxWidth="xs">
      <Stack spacing={2}>
        <TextField
          required
          label="Job Title"
          value={title}
          onChange={handleTitleChange}
        />
        <TextField
          required
          multiline
          rows={4}
          label="Job Description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <TextField
          required
          label="Location"
          value={location}
          onChange={handleLocationChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Post Job
        </Button>
        {isJobPosted && <Alert severity="success">Job Added Successfuly !</Alert>}
      </Stack>
      </Container>
    </form>
  );
};

export default PostJobForm;
