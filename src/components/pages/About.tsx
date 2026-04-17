import { Container } from 'react-bootstrap';

const About = () => (
  <Container className="about-page">
    <h1>About This Project</h1>
    <p>This map was built using React-Leaflet and TypeScript.</p>
    <p>The project involves two API calls for different news sources, one for the US States and one for the World.</p>
    <p>The project also involves an API call to the Google Cloud Translate API for on-website translation of article titles and short descriptions.</p>
    <p>All of the API calls are being handled with a backend hosted on Supabase.</p>
    <p>Project built for CS571 at UW-Madison.</p>
  </Container>
);

export default About;