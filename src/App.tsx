import { Container, Navbar, Nav} from "react-bootstrap"
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import MapPage from './pages/MapPage';
import CountryNews from "./pages/CountryNews"

function App() {
  return (
    <Container fluid>
      {/* content-container is a custom css look that makes text pages more readable */}
      <Navbar>
        <Nav>
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/map ">Map</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
        </Nav>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/country/:id" element={<CountryNews />} />
      </Routes>
    </Container>
  );
  
}

export default App;