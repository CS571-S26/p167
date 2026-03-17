// pages/CountryDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const CountryNews = () => {
  const { id } = useParams(); // Grabs the country name from the URL
  const navigate = useNavigate();

  return (
    <Container className="content-container">
      <h1>News for {id}</h1>
      <p>There will be a call here to serve news from an API about {id}</p>
      
      <Button variant="primary" onClick={() => navigate('/map')}>
        Back to Map
      </Button>
    </Container>
  );
};

export default CountryNews;