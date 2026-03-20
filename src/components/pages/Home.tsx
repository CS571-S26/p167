import React, { useContext } from 'react';
import ThemeContext from '../../contexts/ThemeContext';
import { Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];
  const navigate = useNavigate();


  // Define dynamic classes based on theme
  const bgClass = theme === "dark" ? 'bg-custom-dark text-white' : 'bg-custom-light text-dark';
  const cardClass = theme === "dark"
    ? 'bg-secondary bg-opacity-10 border-secondary border-opacity-25' 
    : 'bg-white border-light shadow-sm';
  const textClass = theme === "dark" ? 'text-white' : 'text-dark';
  const subTextClass = theme === "dark" ? 'text-secondary' : 'text-muted';

  return (
    /* Dynamic background and text colors, based on the user-selected theme */
    <div className={`${bgClass} vh-100 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden`}>

      <main className="container position-relative z-1 text-center py-5">
        <div className="fade-in-up">
          <h1 className={`display-1 fw-bold mb-3 tracking-tight ${textClass}`}>
            World News Mapper
          </h1>

          <p className={`lead ${subTextClass} mx-auto mb-5 px-3`} style={{ maxWidth: '700px' }}>
            The world is bigger than your feed. Open the map to explore local news around the world.
          </p>

          {/* Cards on the home page*/}
          <div className="row g-4 mb-5 text-start justify-content-center">
            {[
              { icon: "📍", title: "1. Point", color: "text-primary" },
              { icon: "🖱️", title: "2. Click", color: "text-info" },
              { icon: "⚡", title: "3. Know", color: "text-warning" }
            ].map((item, idx) => (
              <div key={idx} className="col-md-4">
                <div className={`card h-100 p-4 ${cardClass}`}>
                  <div className={`${item.color} mb-3 fs-3`}>{item.icon}</div>
                  <h5 className={`fw-bold ${textClass}`}>{item.title}</h5>
                  <p className={`small ${subTextClass} mb-0`}>
                    {idx === 0 && "Hover over the map to see countries light up."}
                    {idx === 1 && "Select any nation to trigger a deep-dive."}
                    {idx === 2 && "Access 200+ domestic news feeds."}
                  </p>
                </div>
              </div>
            ))}
          </div>

         <Stack 
          direction="vertical" 
          gap={3} 
          className="flex-md-row justify-content-center mt-4 align-items-center"
        >
          <Button 
            variant={theme === "dark" ? "primary" : "dark"}
            className="btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg w-100 w-md-auto"
            onClick={() => navigate("/worldmap")}
          >
            Start Exploring The World
          </Button>

          <Button 
            variant={theme === "dark" ? "primary" : "dark"}
            className="btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg w-100 w-md-auto"
            onClick={() => navigate("/usamap")}
          >
            Start Exploring The USA
          </Button>
        </Stack>
        </div>
      </main>
      
      <style>{`
        .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;