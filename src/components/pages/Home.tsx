import React, { useContext } from 'react';
import ThemeContext from '../../contexts/ThemeContext';
import { Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

const Home: React.FC = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];
  const navigate = useNavigate();
  const isDark = theme === "dark";

 const fadeIn: Variants = {
  hidden: { 
    opacity: 0, 
    y: 15
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.15, 
      duration: 0.8, 
      ease: [0.215, 0.61, 0.355, 1] as const,
      opacity: { duration: 0.5 },
      y: { duration: 0.5 }
    }
  })
};

  return (
  <div className={`vh-100 position-relative overflow-hidden ${isDark ? 'dark-theme bg-black text-white' : 'bg-light text-dark'}`}>
    <div className={`vh-100 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-light text-dark'}`}>
      
      <div className="position-absolute z-0" style={{ top: '5%' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          className="position-relative"
          style={{ width: '700px', height: '700px' }}
        >
          {/* Internal Glow */}
          <div className="position-absolute start-50 top-50 translate-middle rounded-circle" style={{
            width: '80%', height: '80%',
            background: isDark 
              ? 'radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 70%)' 
              : 'radial-gradient(circle, rgba(0, 102, 255, 0.03) 0%, transparent 70%)',
          }} />

          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            {/* Latitude Lines */}
            {[10, 25, 40, 50, 60, 75, 90].map((ry, i) => (
              <ellipse key={`lat-${i}`} cx="50" cy="50" rx="49" ry={ry/2} strokeWidth="0.1" opacity={isDark ? 0.3 : 0.1} />
            ))}
            
            {/* Longitude Lines */}
            {[10, 25, 40, 50, 60, 75, 90].map((rx, i) => (
              <ellipse key={`lon-${i}`} cx="50" cy="50" rx={rx/2} ry="49" strokeWidth="0.1" opacity={isDark ? 0.3 : 0.1} />
            ))}

            {/* Outer Shell */}
            <circle cx="50" cy="50" r="49.5" strokeWidth="0.2" opacity="0.5" />
          </svg>
        </motion.div>
      </div>

      <main className="container position-relative z-1 text-center">
        
        {/* Title */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}>
          <h1 className="display-1 fw-bold mb-2 title-shadow">
            World News Mapper
          </h1>
          <p className={`lead mx-auto mb-5 ${isDark ? 'text-secondary' : 'text-muted'}`} style={{ maxWidth: '600px', fontWeight: 300 }}>
            The world is bigger than your feed <br/>
            <span className="fw-normal opacity-100 text-primary">Open the map to explore local news globally</span>
          </p>
        </motion.div>

       <div className="row g-4 mb-5 justify-content-center">
          {[
            { icon: "📍", title: "1. Point", desc: "Hover over the map to see countries light up" },
            { icon: "🖱️", title: "2. Click", desc: "Select a nation for domestic news" },
            { icon: "⚡", title: "3. Know", desc: "Understand news from the local source" }
          ].map((item, idx) => (
            <div key={idx} className="col-md-4 col-lg-3">
              <motion.div 
                custom={idx + 1} 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
                className="glass-card-substantial p-4 h-100 text-start"
              >
                <div className="fs-4 mb-3">{item.icon}</div>
                <h6 className="fw-bold mb-2 text-uppercase small" style={{ letterSpacing: '0.15em' }}>
                  {item.title}
                </h6>
                <p className="small opacity-60 mb-0">{item.desc}</p>
                <div className="shimmer-line" />
              </motion.div>
            </div>
          ))}
        </div>
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn}>
          <Stack direction="vertical" gap={3} className="flex-md-row justify-content-center align-items-center mt-4">
            <Button 
              className="btn-luxury px-5 py-3 shadow-lg"
              onClick={() => navigate("/worldmap")}
            >
              Start Exploring The World
            </Button>
            <Button
              className="btn-luxury px-5 py-3"
              onClick={() => navigate("/usamap")}
            >
              Start Exploring The USA
            </Button>
          </Stack>
        </motion.div>
      </main>
    </div>
    </div>
  );
};

export default Home;

