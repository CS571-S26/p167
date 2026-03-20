import { Container, Navbar, Nav, Button} from "react-bootstrap"
import { Routes, Route, Link } from 'react-router-dom';
import  { useState, useEffect } from "react"
import Home from './pages/Home';
import About from './pages/About';
import MapPage from './pages/MapPage';
import CountryNews from "./pages/CountryNews"
import ThemeContext from "../contexts/ThemeContext"

function App() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("webproject-theme");
    return storedTheme ? storedTheme : "dark";
  });

  // Update local storage when the theme changes and change the page background
  useEffect(() => {
    localStorage.setItem("webproject-theme", theme);
    document.body.className = `bg-page-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <Navbar bg={`custom-${theme}`} variant={`${theme}`}>
        <Container fluid>

          {/* Items on the left of the navbar */}
          <Nav className={`me-auto`}>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/map ">Map</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
          </Nav>

          {/* Items on the right of the navbar */}
          <Nav className={`ms-auto`}>
            <Nav.Link 
              as={Button} 
              
              variant={theme === "dark" ? "outline-light" : "outline-primary"}
              onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
              className="rounded-pill px-4" 
            >
              {theme === "dark" ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/news/:countryName" element={<CountryNews />} /> 
      </Routes>
      
    </ThemeContext.Provider>
  );
  
}

export default App;