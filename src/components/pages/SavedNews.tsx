import { useState, useContext, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from "../NewsCard.tsx";
import type { Article } from "../../types";
import ThemeContext from "../../contexts/ThemeContext";
import { useUser } from "../../hooks/useUser";

const CountryNews = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];
  const isDark = theme === "dark";
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('top');
  const {savedArticles, user } = useUser();

  useEffect(() => {
  if (savedArticles) {
    setLoading(false);
  }
}, [savedArticles]);

  return (
    <div className={`news-page-container ${isDark ? 'dark-theme' : ''}`}>
      <Container>
        {/* Header */}
        <header className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="pulse-dot" />
            <span className="status-text text-primary" style={{ letterSpacing: '0.3em', fontSize: '0.7rem', fontWeight: 800 }}>
              World News Mapper
            </span>
          </div>
          <h1 className="display-4 fw-bold tracking-tighter mb-4">
            Saved News Articles
          </h1>

          {/* Category Filters */}
          <div className="d-flex flex-wrap gap-2">
            {['top', 'politics', 'technology', 'business', 'science'].map((cat) => (
              <button 
                key={cat}
                className={`category-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat === 'top' ? 'Headlines' : cat}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
            >
              <Row>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Col key={i} md={6} lg={4} className="mb-4">
                    <div className="skeleton-glass" style={{ height: '400px' }} />
                  </Col>
                ))}
              </Row>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {savedArticles  && savedArticles.length > 0 ? (
                <Row className="g-4">
                  {savedArticles.map((s: Article)=> <NewsCard key={s.article_id} article={s} />)}
                </Row>
              ) : 
              ((!user) ? 
                <div className="text-center py-5 glass-card-substantial">
                  <p className="opacity-50">You must login to view saved articles</p>
                </div>
              : <div className="text-center py-5 glass-card-substantial">
                  <p className="opacity-50">You have not saved any articles</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default CountryNews;