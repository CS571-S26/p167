import React from 'react';
import { motion } from 'framer-motion';

const MapOverlay: React.FC = () => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="terminal-glass-panel"
      >
        {/* Top Status Header */}
        <div className="status-header">
          <motion.div 
            className="pulse-dot"
            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span className="status-text">State News Mapper</span>
        </div>

        {/* Description */}
        <p className="terminal-description">
          Click on a state to read local news
        </p>
      </motion.div>
    </>
  );
};

export default MapOverlay;