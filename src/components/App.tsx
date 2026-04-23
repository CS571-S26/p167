import { Container, Navbar, Nav, Button} from "react-bootstrap"
import { Routes, Route, useLocation, useSearchParams, NavLink } from 'react-router-dom';
import  { useState, useEffect } from "react"
import Home from './pages/Home';
import About from './pages/About';
import WorldMap from './pages/WorldMap';
import USAMap from "./pages/USAMap"
import CountryNews from "./pages/ CountryNews"
import ThemeContext from "../contexts/ThemeContext"
import TranslationContext from "../contexts/TranslationContext"
import StateNews from "./pages/StateNews"
import 'bootstrap-icons/font/bootstrap-icons.css';
import Profile from "./pages/Profile"
import { UserProvider } from "../contexts/UserContext";
import SavedNews from "./pages/SavedNews"
import "../App.css"


function App() {
  const [searchParams] = useSearchParams();
  const lang: string = searchParams.get('lang') || ''; // Get the language for the news request, used to dyanmically show translation button only if the country's language is not English
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("webproject-theme");
    return storedTheme ? storedTheme : "dark";
  });

  const [translationToggle, setTranslationToggle] = useState(true);

  // Update local storage when the theme changes and change the page background
  useEffect(() => {
    localStorage.setItem("webproject-theme", theme);
    document.body.className = `bg-page-${theme}`;
  }, [theme]);

  return (
    <UserProvider>
    <TranslationContext.Provider value={[translationToggle, setTranslationToggle]}>
      <ThemeContext.Provider value={[theme, setTheme]}>
        <Navbar className="custom-navbar" bg={`custom-${theme}`} variant={`${theme}`}>
          <Container fluid>

            {/* Items on the left of the navbar */}
            <Nav className={`me-auto gap-2 gap-lg-3`}>
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/worldmap">World Map</Nav.Link>
              <Nav.Link as={NavLink} to="/usamap">US States Map</Nav.Link>
              <Nav.Link as={NavLink} to="/news/saved">Saved Articles</Nav.Link>
              <Nav.Link as={NavLink} to="/about">About</Nav.Link>
            </Nav>

            {/* Items on the right of the navbar */}
            <Nav className={`ms-auto gap-2 gap-lg-3 `}>
              <Container className="d-flex align-items-center">
              {location.pathname.startsWith("/news") && 
              !location.pathname.startsWith("/news/United%20States") &&
              lang !== "en" && (
                <Nav.Link 
                  onClick={() => setTranslationToggle(prev => !prev)}
                  className="nav-text-link px-3"
                >
                  {translationToggle ? "Show in original language" : "Translate to English"}
                </Nav.Link>
              )}
              <Nav.Link 
                as={NavLink}
                to="/profile"
                className="ms-lg-3 px-4 rounded-pill shadow-none nav-pill-btn btn btn-out"
                >
                <i className="bi bi-person-circle me-2"></i> Profile
              </Nav.Link>
              <Nav.Link 
                as={Button} 
                
                variant={"outline-muted"}
                onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
                className="rounded-pill px-4 theme-toggle-btn" 
              >
                {theme === "dark" ? (
                  <i className="bi bi-sun-fill theme-icon-sun"></i>
                ) : (
                  <i className="bi bi-moon-stars-fill theme-icon-moon"></i>
                )}
              </Nav.Link>
              </Container>
            </Nav>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worldmap" element={<WorldMap/>} />
          <Route path="/about" element={<About />} />
          <Route path="/usamap/" element={<USAMap/>} ></Route>
          <Route path="/news/:countryName" element={<CountryNews />} />
          <Route path="/news/United States/:stateName" element={<StateNews />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/news/saved" element={<SavedNews />} />
        </Routes>
        
      </ThemeContext.Provider>
    </TranslationContext.Provider>
    </UserProvider>
  );
  
}

export default App;