import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppNewsUpdate from '../app-news-update';

// ----------------------------------------------------------------------

export default function AppView() {

  
  const [meetings, setMeetings] = useState([]);

  useEffect( () => {
    async function fetchMeetings() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/meetings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }); 

        const data = await response.json(); 
        setMeetings(data);
      } catch (error) {
        console.error("Erro ao buscar meetings:", error);
        setMeetings([]); 
      }
    }
    fetchMeetings();
    
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Olá, Bem Vindo 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={12} lg={12}>
          <AppNewsUpdate
            title="Novas Reuniões"
            list={meetings}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
