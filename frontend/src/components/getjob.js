import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField } from '@mui/material';
import axios from 'axios';

export default function Getjob() {
  const [jobData, setJobData] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const uid = localStorage.getItem("id")
      const response = await axios.get(`http://127.0.0.1:8000/job/${uid}/`);
      setJobData(response.data);
    } catch (error) {
      console.error('Error fetching job data:', error);
    }
  };

  const handleDescriptionClick = (params) => {
    const description = params.row.description;
    setSelectedDescription(description);
  };

  const handleDeleteJob = async (params) => {
    const jobId = params.row.id;
    try {
      await axios.delete(`http://127.0.0.1:8000/job/${jobId}/`);
      fetchData();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredJobData = jobData.filter((job) => {
    const values = Object.values(job).map((value) =>
      typeof value === 'string' ? value.toLowerCase() : ''
    );
    return values.some((value) => value.includes(searchQuery.toLowerCase()));
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 200 },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      renderCell: (params) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleDescriptionClick(params)}
        >
          {params.row.description}
        </div>
      ),
    },
    { field: 'location', headerName: 'City', width: 300 },

    { field: 'created_at', headerName: 'Created_at', width: 300 },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      renderCell: (params) => (
        <button onClick={() => handleDeleteJob(params)}>Delete</button>
      ),
    },
    // Add more columns as needed based on your data structure
  ];

  return (
    <div>
      <TextField
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DataGrid rows={filteredJobData} columns={columns} />
      </div>
      <div>
        <h3>Selected Description:</h3>
        <div>{selectedDescription}</div>
      </div>
    </div>
  );
}
