import React from 'react';
import { Box, Title } from '@mantine/core';
import './Home.css';

function Home() {
  return (
    <main>
      <Box className="home-top-sect" style={{ backgroundImage: 'url(/images/home-bg2.jpg)' }}>
        <Title className="home-title">A More Convenient Home Rental With Us</Title>
      </Box>
      <Box className="home-top-sect" style={{ backgroundImage: 'url(/images/home-bg2.jpg)' }}>
        <Title className="home-title">A More Convenient Home Rental With Us</Title>
      </Box>
      <Box className="home-top-sect" style={{ backgroundImage: 'url(/images/home-bg2.jpg)' }}>
        <Title className="home-title">A More Convenient Home Rental With Us</Title>
      </Box>
    </main>
  );
}

export default Home;
