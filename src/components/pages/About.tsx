import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ThemeContext from '../../contexts/ThemeContext';

const About = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];
  const isDark = theme === "dark";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className={`about-page-container ${isDark ? 'dark-theme' : ''}`}>
      <Container>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-5">
            <h6 className="fw-bold text-primary-blue mb-2" style={{ letterSpacing: '0.2em' }}>
              PROJECT OVERVIEW
            </h6>
            <h1 className="display-4 fw-bold mb-3 tracking-tighter">About World News Mapper</h1>
            <p className="lead opacity-75" style={{ maxWidth: '700px' }}>
              An interactive website built to provide direct access to domestic news perspectives from around the world
            </p>
          </motion.div>

          <Row className="g-4">
            {[
              { label: "Frontend", title: "Visual Design", desc: "Developed with TypeScript, React, React-Bootstrap and Framer Motion, using React-Leaflet for map rendering" },
              { label: "Backend", title: "Data Management", desc: "Managed via Supabase for secure data handling and deployment" },
              { label: "Data", title: "News Sources", desc: "Utilizes separate APIs for US state and global news" },
              { label: "Languages", title: "Translation", desc: "Utilizes Google Cloud Translate API for article translations to English" },
            ].map((spec, idx) => (
              <Col key={idx} md={6}>
                <motion.div variants={itemVariants} className="about-card p-4 h-100">
                  <div className="small fw-bold text-primary-blue mb-1">{spec.label}</div>
                  <h5 className="fw-bold mb-3">{spec.title}</h5>
                  <p className="opacity-75 m-0" style={{ lineHeight: '1.6' }}>{spec.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>

          <motion.div variants={itemVariants} className="mt-5 pt-4 border-top border-secondary border-opacity-25">
            <p className="small fw-bold opacity-50 mb-0">
              Developed for CS571 at the University of Wisconsin-Madison
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default About;