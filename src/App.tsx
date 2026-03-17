import { Container, Navbar, Nav} from "react-bootstrap"
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import MapPage from './pages/MapPage';
import CountryNews from "./pages/CountryNews"

function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Nav>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/map ">Map</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/country/:id" element={<CountryNews />} />
      </Routes>
      
    </>
  );
  
}

export default App;