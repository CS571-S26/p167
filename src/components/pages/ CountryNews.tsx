import { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from "../NewsCard.tsx";
import type { APIResponse } from "../../types.ts";
import countryToLang from '../../languages.json';
import { supabase } from '../../supabaseClient.ts';
import ThemeContext from "../../contexts/ThemeContext.ts";

const CountryNews = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];
  const isDark = theme === "dark";
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('top');
  const [data, setData] = useState<APIResponse | null>(null);
  const { countryName } = useParams<{ countryName: string }>();
  const [searchParams] = useSearchParams();
  let isoCode: string = searchParams.get('iso') || '';
  const countryLanguage = (countryToLang as Record<string, string>)[isoCode.toLowerCase()] || 'en';

  // Fixes issue with South Sudan by showing Sudan news, South Sudan is not handled by the API properly
  if(isoCode === "SS") isoCode = "SD"; 

  // Convert Greenland's iso code to Denmark's, the API does not handle Greenland as a seperate country
  if (isoCode === "GL") isoCode = "DK";

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('news-proxy', {
      body: { isoCode, countryLanguage, category }
    });

    if (error) {
      console.error('Error:', error);
    } else {
      setData(data);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [category]);

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
            News for <span className="text-primary-blue">{countryName}</span>
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
              {data && data.results && data.results.length > 0 ? (
                <Row className="g-4">
                  {data.results.map(s => <NewsCard key={s.article_id} article={s} />)}
                </Row>
              ) : (
                <div className="text-center py-5 glass-card-substantial">
                  <p className="opacity-50">No news found for {countryName} in this category.</p>
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