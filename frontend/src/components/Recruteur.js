import * as React from 'react';
import axios from 'axios';

function ResponsiveAppBar() {
  const [un, setUn] = React.useState('');
  const fetchData = async () => {
    try {
      let id = localStorage.getItem('id');
      const response = await axios.get(`http://localhost:8000/user/${id}/`);
      console.log(response.data); // Handle the response data
      setUn(response.data.first_name);
    } catch (error) {
      console.error(error); // Handle the error
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);


  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          backgroundColor: '#f2f2f2',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          fontSize: '24px',
          fontWeight: 'bold',
          textTransform: 'uppercase', 
        }}
      >
        Welcome Back, {un}
      </div>
    </>
  );
}

export default ResponsiveAppBar;
